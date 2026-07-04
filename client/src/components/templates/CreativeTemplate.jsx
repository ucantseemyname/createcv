// Creative: gradient header, rounded accent blocks, skill pills. Modern & expressive.
export default function CreativeTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white font-sans text-[13px] leading-relaxed text-dark">
      {/* Gradient header */}
      <div
        className="flex items-center gap-5 px-8 py-8 text-white"
        style={{
          background:
            "linear-gradient(120deg, var(--accent) 0%, var(--accent-strong) 100%)",
        }}
      >
        {personal.photo && (
          <img
            src={personal.photo}
            alt=""
            className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/50 object-cover"
          />
        )}
        <div className="min-w-0">
        <h1 className="text-[26px] font-extrabold tracking-tight">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-0.5 text-[13px] font-medium text-white/90">
          {personal.jobTitle || resume?.experience?.[0]?.title || ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {contacts.map((c) => (
            <span
              key={c}
              className="rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-medium backdrop-blur"
            >
              {c}
            </span>
          ))}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-8 py-7">
        {/* Main */}
        <div className="col-span-2 space-y-6">
          {resume?.summary && (
            <div className="rounded-xl bg-surface p-4">
              <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
                About
              </h2>
              <p className="text-[12.5px] text-slate-700">{resume.summary}</p>
            </div>
          )}

          {resume?.experience?.length > 0 && (
            <Section title="Experience">
              <div className="space-y-4">
                {resume.experience.map((job, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[13px] font-bold text-dark">{job.title}</h3>
                      <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--accent)]">
                        {job.dates}
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-[color:var(--accent)]">{job.company}</p>
                    <ul className="mt-2 space-y-1">
                      {(job.bullets || []).map((b, j) => (
                        <li key={j} className="flex gap-2 text-[12px] text-slate-700">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
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
        <div className="space-y-6">
          {resume?.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10.5px] font-semibold text-[color:var(--accent)]"
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
                  <div key={i} className="rounded-lg bg-surface p-3">
                    <p className="text-[12px] font-bold text-dark">{edu.degree}</p>
                    {edu.field && <p className="text-[11px] text-slate-600">{edu.field}</p>}
                    <p className="text-[10.5px] text-muted">
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
      <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
