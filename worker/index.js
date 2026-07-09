// Cloudflare Worker: serves the static SPA (via the ASSETS binding) and the
// /api/* routes. Static assets that match a file are served directly by the
// platform; everything else hits this Worker.
import {
  MODEL,
  GENERATE_SYSTEM,
  ANALYZE_SYSTEM,
  buildUserMessage,
  callClaude,
  extractJSON,
  json,
} from "./shared.js";

async function generateResume(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Missing ANTHROPIC_API_KEY. Set it in the Worker's variables." }, 500);
  }
  try {
    const body = await request.json().catch(() => ({}));
    const text = await callClaude(env, {
      system: GENERATE_SYSTEM,
      messages: [{ role: "user", content: buildUserMessage(body) }],
      max_tokens: 4096,
    });
    let resume;
    try {
      resume = extractJSON(text);
    } catch {
      return json({ error: "The AI returned an unexpected format. Please try regenerating." }, 502);
    }
    return json({
      resume: {
        summary: resume.summary || "",
        experience: Array.isArray(resume.experience) ? resume.experience : [],
        education: Array.isArray(resume.education) ? resume.education : [],
        skills: Array.isArray(resume.skills) ? resume.skills : [],
        languages: Array.isArray(resume.languages) ? resume.languages : [],
        certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
      },
    });
  } catch (err) {
    return json({ error: err?.message || "Something went wrong generating your resume." }, 500);
  }
}

// The model sometimes returns skills/languages as arrays — always coerce to a
// comma-separated string (the form fields expect strings).
const toStr = (v) =>
  Array.isArray(v) ? v.filter(Boolean).join(", ") : v == null ? "" : String(v);

async function analyzeCv(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Missing ANTHROPIC_API_KEY. Set it in the Worker's variables." }, 500);
  }
  const body = await request.json().catch(() => ({}));
  const text = String(body?.text || "").trim();
  const targetRole = String(body?.targetRole || "").trim();
  if (text.length < 40) {
    return json(
      { error: "Couldn't read enough text. Try a text-based PDF, a .txt file, or paste your resume text." },
      400
    );
  }
  try {
    const userMsg =
      (targetRole ? `Target role: ${targetRole}\n\n` : "") +
      `Resume text:\n"""\n${text.slice(0, 12000)}\n"""`;
    const raw = await callClaude(env, {
      system: ANALYZE_SYSTEM,
      messages: [{ role: "user", content: userMsg }],
      max_tokens: 6000,
    });
    let data;
    try {
      data = extractJSON(raw);
    } catch {
      return json({ error: "The AI returned an unexpected format. Please try again." }, 502);
    }
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
      experience: (Array.isArray(ex.experience) ? ex.experience : []).slice(0, 3).map((j) => ({
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
        skills: toStr(ex.extras?.skills),
        languages: toStr(ex.extras?.languages),
        certifications: toStr(ex.extras?.certifications),
        summary: toStr(ex.extras?.summary),
      },
    };
    return json({
      atsScore: Math.max(0, Math.min(100, Number(data.atsScore) || 0)),
      summaryLine: data.summaryLine || "",
      ratings: Array.isArray(data.ratings) ? data.ratings : [],
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
      extracted,
    });
  } catch (err) {
    return json({ error: err?.message || "Something went wrong analyzing your resume." }, 500);
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      return json({ ok: true, model: MODEL, hasKey: Boolean(env.ANTHROPIC_API_KEY) });
    }
    if (pathname === "/api/generate-resume" && request.method === "POST") {
      return generateResume(request, env);
    }
    if (pathname === "/api/analyze-cv" && request.method === "POST") {
      return analyzeCv(request, env);
    }
    if (pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    // Everything else → static site (SPA fallback handled by [assets] config).
    return env.ASSETS.fetch(request);
  },
};
