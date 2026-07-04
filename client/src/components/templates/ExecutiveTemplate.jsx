// Executive: accent header band with profile photo, refined for senior roles.
export default function ExecutiveTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="font-sans text-[13px] leading-relaxed text-dark">
      {/* Header band */}
      <div className="flex items-center gap-5 bg-[var(--accent)] px-8 py-6 text-white">
        {personal.photo ? (
          <img
            src={personal.photo}
            alt=""
            className="h-20 w-20 shrink-0 rounded-full border-2 border-white/70 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-white/60 bg-white/20 text-2xl font-bold">
            {(personal.fullName || "?").charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="text-sm font-medium text-white/85">
            {personal.jobTitle || resume?.experience?.[0]?.title || ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-white/90">
            {contacts.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 px-8 py-7">
        {resume?.summary && (
          <Section title="Executive Summary">
            <p className="text-[12.5px] text-slate-700">{resume.summary}</p>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="Professional Experience">
            <div className="space-y-4">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-dark">
                      {job.title}
                      <span className="font-medium text-[color:var(--accent)]">
                        {job.company ? ` · ${job.company}` : ""}
                      </span>
                    </h3>
                    <span className="shrink-0 text-[11px] text-muted">{job.dates}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="flex gap-2 text-[12px] text-slate-700">
                        <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {resume?.education?.length > 0 && (
            <Section title="Education">
              <div className="space-y-2">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-[12.5px] font-bold text-dark">{edu.degree}</p>
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
          {resume?.skills?.length > 0 && (
            <Section title="Core Competencies">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[11px] font-medium text-[color:var(--accent)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
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
      <h2 className="mb-2 border-b-2 border-[color:var(--accent-border)] pb-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
