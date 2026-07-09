import {
  GENERATE_SYSTEM,
  buildUserMessage,
  callClaude,
  extractJSON,
  json,
} from "./_shared.js";

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json(
      { error: "Missing ANTHROPIC_API_KEY. Set it as a Pages environment variable." },
      500
    );
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
      return json(
        { error: "The AI returned an unexpected format. Please try regenerating." },
        502
      );
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
