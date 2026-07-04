// Modern: teal header bar, two-column layout, teal section dividers, Inter font.
export default function ModernTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="font-sans text-[13px] leading-relaxed text-dark">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[var(--accent)] px-8 py-6 text-white">
        {personal.photo && (
          <img
            src={personal.photo}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full border-2 border-white/60 object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-white/85">
            {personal.jobTitle || resume?.experience?.[0]?.title || ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/90">
            {contacts.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-8 py-6">
        {/* Main column */}
        <div className="col-span-2 space-y-5">
          {resume?.summary && (
            <Section title="Summary">
              <p className="text-[12.5px] text-slate-700">{resume.summary}</p>
            </Section>
          )}

          {resume?.experience?.length > 0 && (
            <Section title="Experience">
              <div className="space-y-4">
                {resume.experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[13px] font-semibold text-dark">{job.title}</h3>
                      <span className="shrink-0 text-[11px] text-muted">{job.dates}</span>
                    </div>
                    <p className="text-[12px] font-medium text-[color:var(--accent)]">{job.company}</p>
                    <ul className="mt-1.5 space-y-1">
                      {(job.bullets || []).map((b, j) => (
                        <li key={j} className="flex gap-2 text-[12px] text-slate-700">
                          <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent-strong)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {resume?.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {resume?.education?.length > 0 && (
            <Section title="Education">
              <div className="space-y-2.5">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-[12px] font-semibold text-dark">{edu.degree}</p>
                    {edu.field && <p className="text-[11px] text-slate-600">{edu.field}</p>}
                    <p className="text-[11px] text-muted">
                      {edu.institution}
                      {edu.year ? ` · ${edu.year}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume?.languages?.length > 0 && (
            <Section title="Languages">
              <ul className="space-y-1 text-[12px] text-slate-700">
                {resume.languages.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Section>
          )}

          {resume?.certifications?.length > 0 && (
            <Section title="Certifications">
              <ul className="space-y-1 text-[12px] text-slate-700">
                {resume.certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
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
      <h2 className="mb-2 border-b-2 border-[color:var(--accent-border)] pb-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
