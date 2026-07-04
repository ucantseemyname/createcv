import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from the project root (one level up from /server)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a professional resume writer with 20 years of experience. Write a complete, ATS-optimized resume based on the provided information. Return a JSON object with these exact fields:
- summary: string (3-4 sentence professional summary)
- experience: array of { company, title, dates, bullets: string[] (4-5 achievement-focused bullet points) }
- education: array of { degree, institution, year, field }
- skills: string[] (organized list)
- languages: string[]
- certifications: string[]

Make bullet points achievement-focused with action verbs. Quantify where possible. Tailor everything to the target job role and industry. Respond with ONLY the raw JSON object — no markdown code fences, no commentary.`;

// Build the user-facing message from the structured form data.
function buildUserMessage(data) {
  const {
    personal = {},
    experience = [],
    education = [],
    extras = {},
    target = {},
  } = data;

  const lines = [];

  lines.push("## Candidate Information");
  lines.push("");
  lines.push("### Personal");
  lines.push(`Full Name: ${personal.fullName || ""}`);
  lines.push(`Current/Target Job Title: ${personal.jobTitle || ""}`);
  lines.push(`Email: ${personal.email || ""}`);
  lines.push(`Phone: ${personal.phone || ""}`);
  lines.push(`Location: ${personal.location || ""}`);
  if (personal.linkedin) lines.push(`LinkedIn: ${personal.linkedin}`);
  if (personal.website) lines.push(`Portfolio/Website: ${personal.website}`);

  lines.push("");
  lines.push("### Work Experience");
  if (experience.length === 0) {
    lines.push("(No work experience provided — infer a reasonable entry-level framing.)");
  }
  experience.forEach((job, i) => {
    lines.push(`Job ${i + 1}:`);
    lines.push(`  Company: ${job.company || ""}`);
    lines.push(`  Title: ${job.title || ""}`);
    lines.push(`  Dates: ${job.startDate || ""} – ${job.endDate || "Present"}`);
    lines.push(`  Responsibilities: ${job.responsibilities || ""}`);
  });

  lines.push("");
  lines.push("### Education");
  education.forEach((edu, i) => {
    lines.push(`Education ${i + 1}:`);
    lines.push(`  Degree: ${edu.degree || ""}`);
    lines.push(`  Field of Study: ${edu.field || ""}`);
    lines.push(`  Institution: ${edu.institution || ""}`);
    lines.push(`  Graduation Year: ${edu.year || ""}`);
  });

  lines.push("");
  lines.push("### Skills & Extras");
  lines.push(`Skills: ${extras.skills || ""}`);
  lines.push(`Languages: ${extras.languages || ""}`);
  lines.push(`Certifications: ${extras.certifications || ""}`);
  if (extras.summary) {
    lines.push(`Provided Summary/Bio: ${extras.summary}`);
  } else {
    lines.push("Provided Summary/Bio: (none — please write one)");
  }

  lines.push("");
  lines.push("### Target");
  lines.push(`Job Role Applying For: ${target.role || personal.jobTitle || ""}`);
  lines.push(`Industry: ${target.industry || ""}`);
  lines.push(`Desired Tone: ${target.tone || "Professional"}`);

  return lines.join("\n");
}

// Strip accidental markdown fences and extract the JSON object.
function extractJSON(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, model: MODEL, hasKey: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.post("/api/generate-resume", async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error:
        "Missing ANTHROPIC_API_KEY. Add it to the .env file in the project root and restart the server.",
    });
  }

  try {
    const userMessage = buildUserMessage(req.body || {});

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    let resume;
    try {
      resume = extractJSON(text);
    } catch (parseErr) {
      console.error("Failed to parse Claude response:", text);
      return res.status(502).json({
        error: "The AI returned an unexpected format. Please try regenerating.",
      });
    }

    // Normalize shape so the frontend never crashes on missing fields.
    const normalized = {
      summary: resume.summary || "",
      experience: Array.isArray(resume.experience) ? resume.experience : [],
      education: Array.isArray(resume.education) ? resume.education : [],
      skills: Array.isArray(resume.skills) ? resume.skills : [],
      languages: Array.isArray(resume.languages) ? resume.languages : [],
      certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
    };

    res.json({ resume: normalized });
  } catch (err) {
    console.error("Generation error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Something went wrong generating your resume.",
    });
  }
});

// ----------------------------------------------------------------------------
// Analyze an uploaded CV: return an ATS score + feedback + extracted form data.
// ----------------------------------------------------------------------------
const ANALYZE_SYSTEM = `You are an expert resume reviewer and ATS (applicant tracking system) specialist. Analyze the resume text provided. Return ONLY a raw JSON object (no markdown fences, no commentary) with these exact fields:
- atsScore: integer 0-100 overall ATS-friendliness/quality score
- summaryLine: string (one sentence overall verdict)
- ratings: array of exactly 5 { category: string, score: 0-100, note: string } for categories: "Keywords & Skills", "Formatting & Structure", "Impact & Metrics", "Clarity & Grammar", "Contact & Sections"
- strengths: string[] (3-4 concrete strengths)
- improvements: string[] (3-5 specific, actionable fixes)
- extracted: {
    personal: { fullName, jobTitle, email, phone, location, linkedin, website },
    experience: array of { company, title, startDate, endDate, responsibilities } (responsibilities = a short paragraph of what they did),
    education: array of { degree, institution, year, field },
    extras: { skills (comma-separated string), languages (comma-separated string), certifications (comma-separated string), summary (string) }
  }
Extract real values from the resume; use "" for anything not found. Be honest and specific in scores and feedback.`;

app.post("/api/analyze-cv", async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error:
        "Missing ANTHROPIC_API_KEY. Add it to the .env file in the project root and restart the server.",
    });
  }

  const text = String(req.body?.text || "").trim();
  const targetRole = String(req.body?.targetRole || "").trim();
  if (text.length < 40) {
    return res.status(400).json({
      error:
        "Couldn't read enough text from that file. Try a text-based PDF, a .txt file, or paste your resume text.",
    });
  }

  try {
    const userMsg =
      (targetRole ? `Target role: ${targetRole}\n\n` : "") +
      `Resume text:\n"""\n${text.slice(0, 12000)}\n"""`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2600,
      system: ANALYZE_SYSTEM,
      messages: [{ role: "user", content: userMsg }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    let data;
    try {
      data = extractJSON(raw);
    } catch {
      console.error("Failed to parse analyze response:", raw);
      return res
        .status(502)
        .json({ error: "The AI returned an unexpected format. Please try again." });
    }

    // Normalize the extracted form shape so the frontend can trust it.
    const ex = data.extracted || {};
    const extracted = {
      personal: {
        fullName: ex.personal?.fullName || "",
        jobTitle: ex.personal?.jobTitle || targetRole || "",
        email: ex.personal?.email || "",
        phone: ex.personal?.phone || "",
        location: ex.personal?.location || "",
        linkedin: ex.personal?.linkedin || "",
        website: ex.personal?.website || "",
        photo: "",
      },
      experience: (Array.isArray(ex.experience) ? ex.experience : [])
        .slice(0, 3)
        .map((j) => ({
          company: j.company || "",
          title: j.title || "",
          startDate: j.startDate || "",
          endDate: j.endDate || "",
          responsibilities: j.responsibilities || "",
        })),
      education: (Array.isArray(ex.education) ? ex.education : []).map((e) => ({
        degree: e.degree || "",
        institution: e.institution || "",
        year: e.year || "",
        field: e.field || "",
      })),
      extras: {
        skills: ex.extras?.skills || "",
        languages: ex.extras?.languages || "",
        certifications: ex.extras?.certifications || "",
        summary: ex.extras?.summary || "",
      },
    };

    res.json({
      atsScore: Math.max(0, Math.min(100, Number(data.atsScore) || 0)),
      summaryLine: data.summaryLine || "",
      ratings: Array.isArray(data.ratings) ? data.ratings : [],
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
      extracted,
    });
  } catch (err) {
    console.error("Analyze error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Something went wrong analyzing your resume.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Resumix server running on http://localhost:${PORT}`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  API key loaded: ${Boolean(process.env.ANTHROPIC_API_KEY)}\n`);
});
