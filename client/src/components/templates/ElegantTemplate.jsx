// Elegant: refined editorial layout — Playfair name, teal hairline accents, airy spacing.
export default function ElegantTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white px-12 py-12 font-sans text-[13px] leading-relaxed text-dark">
      {/* Header */}
      <header className="text-center">
        <h1 className="font-display text-[34px] font-bold leading-none tracking-tight text-dark">
          {personal.fullName || "Your Name"}
        </h1>
        <div className="mx-auto my-3 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[var(--accent-border)]" />
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[color:var(--accent)]">
            {personal.jobTitle || resume?.experience?.[0]?.title || ""}
          </p>
          <span className="h-px w-10 bg-[var(--accent-border)]" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
          {contacts.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </header>

      <div className="mt-9 space-y-7">
        {resume?.summary && (
          <Section title="Profile">
            <p className="text-center text-[12.5px] italic leading-relaxed text-slate-600">
              {resume.summary}
            </p>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="Experience">
            <div className="space-y-5">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-[15px] font-semibold text-dark">
                      {job.title}
                    </h3>
                    <span className="shrink-0 text-[11px] uppercase tracking-wide text-muted">
                      {job.dates}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-[color:var(--accent)]">
                    {job.company}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="flex gap-2.5 text-[12px] text-slate-700">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-[var(--accent)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {resume?.education?.length > 0 && (
            <Section title="Education">
              <div className="space-y-2.5">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-display text-[13px] font-semibold text-dark">
                      {edu.degree}
                    </p>
                    {edu.field && <p className="text-[12px] text-slate-600">{edu.field}</p>}
                    <p className="text-[11px] text-muted">
                      {edu.institution}
                      {edu.year ? ` · ${edu.year}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume?.skills?.length > 0 && (
            <Section title="Skills">
              <p className="text-[12px] leading-relaxed text-slate-700">
                {resume.skills.join(" · ")}
              </p>
            </Section>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {resume?.languages?.length > 0 && (
            <Section title="Languages">
              <p className="text-[12px] text-slate-700">{resume.languages.join(" · ")}</p>
            </Section>
          )}
          {resume?.certifications?.length > 0 && (
            <Section title="Certifications">
              <p className="text-[12px] text-slate-700">{resume.certifications.join(" · ")}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
