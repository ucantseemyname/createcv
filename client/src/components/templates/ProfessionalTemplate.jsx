// Professional: centered serif header, contact line with separators, uppercase
// ruled section headers, and a 3-column skills grid. ATS-friendly single column.
// Modeled on a classic multi-industry CV layout.
export default function ProfessionalTemplate({ personal, resume }) {
  const contacts = [
    personal.email && { label: personal.email, link: true },
    personal.phone && { label: personal.phone, link: false },
    personal.location && { label: personal.location, link: false },
  ].filter(Boolean);

  const links = [
    personal.website && { label: personal.website },
    personal.linkedin && { label: personal.linkedin },
  ].filter(Boolean);

  // Split skills across three columns like the reference CV.
  const skills = resume?.skills || [];
  const cols = [[], [], []];
  skills.forEach((s, i) => cols[i % 3].push(s));

  return (
    <div className="bg-white px-11 py-9 font-serif text-[12.5px] leading-relaxed text-black">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-[24px] font-bold tracking-tight">
          {personal.fullName || "Your Name"}
        </h1>
        {(personal.jobTitle || resume?.experience?.[0]?.title) && (
          <p className="mt-0.5 text-[12px] font-medium text-neutral-700">
            {personal.jobTitle || resume?.experience?.[0]?.title}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-neutral-700">
          {contacts.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={c.link ? "text-[color:var(--accent)] underline" : ""}>
                {c.label}
              </span>
              {i < contacts.length - 1 && <span className="text-neutral-400">•</span>}
            </span>
          ))}
        </div>
        {links.length > 0 && (
          <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-2 text-[11px]">
            {links.map((l, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-[color:var(--accent)] underline">{l.label}</span>
                {i < links.length - 1 && <span className="text-neutral-400">•</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Intro / overview */}
      {resume?.summary && (
        <p className="mt-4 text-[12px] leading-relaxed text-neutral-800">{resume.summary}</p>
      )}

      {/* Skills — 3 columns */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div className="grid grid-cols-3 gap-4">
            {cols.map((col, i) => (
              <ul key={i} className="space-y-0.5 text-[11.5px] text-neutral-800">
                {col.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      {resume?.experience?.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3.5">
            {resume.experience.map((job, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[13px] font-bold text-black">{job.title}</h3>
                  <span className="shrink-0 text-[11px] font-medium text-neutral-600">
                    {job.dates}
                  </span>
                </div>
                {job.company && (
                  <p className="text-[12px] font-semibold text-[color:var(--accent)]">
                    {job.company}
                  </p>
                )}
                <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-neutral-400">
                  {(job.bullets || []).map((b, j) => (
                    <li key={j} className="text-[11.5px] text-neutral-800">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {resume?.education?.length > 0 && (
        <Section title="Education">
          <div className="space-y-1.5">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <p className="text-[12px]">
                  <span className="font-bold">
                    {edu.degree}
                    {edu.field ? `, ${edu.field}` : ""}
                  </span>
                  {edu.institution ? ` — ${edu.institution}` : ""}
                </p>
                <span className="shrink-0 text-[11px] font-medium text-neutral-600">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {(resume?.languages?.length > 0 || resume?.certifications?.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          {resume?.languages?.length > 0 && (
            <Section title="Languages">
              <p className="text-[11.5px] text-neutral-800">{resume.languages.join(", ")}</p>
            </Section>
          )}
          {resume?.certifications?.length > 0 && (
            <Section title="Certifications">
              <p className="text-[11.5px] text-neutral-800">
                {resume.certifications.join(", ")}
              </p>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 border-b border-[color:var(--accent)] pb-0.5 text-[13px] font-bold uppercase tracking-wide text-black">
        {title}
      </h2>
      {children}
    </section>
  );
}
