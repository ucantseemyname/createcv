// Shared logic for the Cloudflare Pages Functions (edge runtime).
// Files starting with "_" are not routed — safe to import from route handlers.

export const MODEL = "claude-sonnet-4-6";

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });

// Call the Anthropic Messages API directly (no SDK needed on Workers).
export async function callClaude(env, { system, messages, max_tokens }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, max_tokens, system, messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `Anthropic error ${res.status}`);
  }
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}

// Strip accidental markdown fences and extract the JSON object.
export function extractJSON(text) {
  let cleaned = String(text || "").trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
}

export const GENERATE_SYSTEM = `You are a professional resume writer with 20 years of experience. Write a complete, ATS-optimized resume based on the provided information. Return a JSON object with these exact fields:
- summary: string (3-4 sentence professional summary)
- experience: array of { company, title, dates, bullets: string[] (4-5 achievement-focused bullet points) }
- education: array of { degree, institution, year, field }
- skills: string[] (organized list)
- languages: string[]
- certifications: string[]

Make bullet points achievement-focused with action verbs. Quantify where possible. Tailor everything to the target job role and industry. Respond with ONLY the raw JSON object — no markdown code fences, no commentary.`;

export const ANALYZE_SYSTEM = `You are an expert resume reviewer and ATS (applicant tracking system) specialist. Analyze the resume text provided. Return ONLY a raw JSON object (no markdown fences, no commentary) with these exact fields:
- atsScore: integer 0-100 overall ATS-friendliness/quality score
- summaryLine: string (one sentence overall verdict)
- ratings: array of exactly 5 { category: string, score: 0-100, note: string } for categories: "Keywords & Skills", "Formatting & Structure", "Impact & Metrics", "Clarity & Grammar", "Contact & Sections"
- strengths: string[] (3-4 concrete strengths)
- improvements: string[] (3-5 specific, actionable fixes)
- extracted: {
    personal: { fullName, jobTitle, email, phone, location, linkedin, website },
    experience: array of { company, title, startDate, endDate, responsibilities },
    education: array of { degree, institution, year, field },
    extras: { skills, languages, certifications, summary }
  }
Extract real values from the resume; use "" for anything not found. Be honest and specific in scores and feedback.`;

// Build the generate prompt from the structured form data.
export function buildUserMessage(data) {
  const {
    personal = {},
    experience = [],
    education = [],
    extras = {},
    target = {},
  } = data;
  const lines = [];
  lines.push("## Candidate Information", "", "### Personal");
  lines.push(`Full Name: ${personal.fullName || ""}`);
  lines.push(`Current/Target Job Title: ${personal.jobTitle || ""}`);
  lines.push(`Email: ${personal.email || ""}`);
  lines.push(`Phone: ${personal.phone || ""}`);
  lines.push(`Location: ${personal.location || ""}`);
  if (personal.linkedin) lines.push(`LinkedIn: ${personal.linkedin}`);
  if (personal.website) lines.push(`Portfolio/Website: ${personal.website}`);

  lines.push("", "### Work Experience");
  if (!experience.length) lines.push("(No work experience provided — infer entry-level framing.)");
  experience.forEach((job, i) => {
    lines.push(`Job ${i + 1}:`);
    lines.push(`  Company: ${job.company || ""}`);
    lines.push(`  Title: ${job.title || ""}`);
    lines.push(`  Dates: ${job.startDate || ""} – ${job.endDate || "Present"}`);
    lines.push(`  Responsibilities: ${job.responsibilities || ""}`);
  });

  lines.push("", "### Education");
  education.forEach((edu, i) => {
    lines.push(`Education ${i + 1}:`);
    lines.push(`  Degree: ${edu.degree || ""}`);
    lines.push(`  Field of Study: ${edu.field || ""}`);
    lines.push(`  Institution: ${edu.institution || ""}`);
    lines.push(`  Graduation Year: ${edu.year || ""}`);
  });

  lines.push("", "### Skills & Extras");
  lines.push(`Skills: ${extras.skills || ""}`);
  lines.push(`Languages: ${extras.languages || ""}`);
  lines.push(`Certifications: ${extras.certifications || ""}`);
  lines.push(`Provided Summary/Bio: ${extras.summary || "(none — please write one)"}`);

  lines.push("", "### Target");
  lines.push(`Job Role Applying For: ${target.role || personal.jobTitle || ""}`);
  lines.push(`Industry: ${target.industry || ""}`);
  lines.push(`Desired Tone: ${target.tone || "Professional"}`);
  return lines.join("\n");
}
