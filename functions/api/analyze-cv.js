import { ANALYZE_SYSTEM, callClaude, extractJSON, json } from "./_shared.js";

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json(
      { error: "Missing ANTHROPIC_API_KEY. Set it as a Pages environment variable." },
      500
    );
  }

  const body = await request.json().catch(() => ({}));
  const text = String(body?.text || "").trim();
  const targetRole = String(body?.targetRole || "").trim();
  if (text.length < 40) {
    return json(
      {
        error:
          "Couldn't read enough text. Try a text-based PDF, a .txt file, or paste your resume text.",
      },
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
      return json(
        { error: "The AI returned an unexpected format. Please try again." },
        502
      );
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
        skills: ex.extras?.skills || "",
        languages: ex.extras?.languages || "",
        certifications: ex.extras?.certifications || "",
        summary: ex.extras?.summary || "",
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
