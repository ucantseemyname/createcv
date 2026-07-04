// Tech: monospace section labels and skill tags — tuned for engineering roles.
export default function TechTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white px-9 py-8 font-sans text-[13px] leading-relaxed text-dark">
      {/* Header */}
      <header className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-[color:var(--accent)]">{"</>"}</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-dark">
            {personal.fullName || "Your Name"}
          </h1>
        </div>
        <p className="mt-0.5 font-mono text-[12px] text-[color:var(--accent)]">
          {personal.jobTitle || resume?.experience?.[0]?.title || ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[11px] text-muted">
          {contacts.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </header>

      <div className="mt-5 space-y-5">
        {resume?.summary && (
          <Section title="about">
            <p className="text-[12.5px] text-slate-700">{resume.summary}</p>
          </Section>
        )}

        {resume?.skills?.length > 0 && (
          <Section title="stack">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <span
                  key={s}
                  className="rounded border border-[color:var(--accent-border)] bg-[var(--accent-softer)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--accent)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="experience">
            <div className="space-y-4">
              {resume.experience.map((job, i) => (
                <div key={i} className="border-l-2 border-[color:var(--accent-border)] pl-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-dark">{job.title}</h3>
                    <span className="shrink-0 font-mono text-[11px] text-muted">{job.dates}</span>
                  </div>
                  <p className="font-mono text-[12px] text-[color:var(--accent)]">{job.company}</p>
                  <ul className="mt-1.5 space-y-1">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="flex gap-2 text-[12px] text-slate-700">
                        <span className="font-mono text-[color:var(--accent)]">▹</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {resume?.education?.length > 0 && (
          <Section title="education">
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-bold text-dark">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p className="text-[12px] text-slate-600">{edu.institution}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-muted">{edu.year}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(resume?.languages?.length > 0 || resume?.certifications?.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            {resume?.languages?.length > 0 && (
              <Section title="languages">
                <p className="text-[12px] text-slate-700">{resume.languages.join(" · ")}</p>
              </Section>
            )}
            {resume?.certifications?.length > 0 && (
              <Section title="certs">
                <p className="text-[12px] text-slate-700">{resume.certifications.join(" · ")}</p>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 font-mono text-[11px] font-bold lowercase tracking-wider text-[color:var(--accent)]">
        <span className="text-muted">## </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
