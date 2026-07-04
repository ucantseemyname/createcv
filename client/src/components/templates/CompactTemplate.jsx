// Compact: space-efficient single column with an accent rule — fits lots of content.
export default function CompactTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white px-9 py-8 font-sans text-[12.5px] leading-snug text-dark">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 border-b-2 border-[color:var(--accent)] pb-2">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-dark">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="text-[12px] font-semibold text-[color:var(--accent)]">
            {personal.jobTitle || resume?.experience?.[0]?.title || ""}
          </p>
        </div>
        <div className="text-right text-[10.5px] leading-tight text-muted">
          {contacts.map((c) => (
            <div key={c}>{c}</div>
          ))}
        </div>
      </header>

      <div className="mt-4 space-y-3.5">
        {resume?.summary && (
          <Section title="Summary">
            <p className="text-[12px] text-slate-700">{resume.summary}</p>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="Experience">
            <div className="space-y-2.5">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[12.5px] font-bold text-dark">
                      {job.title}
                      {job.company ? `, ${job.company}` : ""}
                    </h3>
                    <span className="shrink-0 text-[10.5px] text-muted">{job.dates}</span>
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-[color:var(--accent)]">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="text-[11.5px] text-slate-700">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
          {resume?.education?.length > 0 && (
            <Section title="Education">
              <div className="space-y-1.5">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-[11.5px] font-bold text-dark">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p className="text-[10.5px] text-muted">
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
              <p className="text-[11.5px] text-slate-700">{resume.skills.join(" · ")}</p>
            </Section>
          )}
          {resume?.languages?.length > 0 && (
            <Section title="Languages">
              <p className="text-[11.5px] text-slate-700">{resume.languages.join(" · ")}</p>
            </Section>
          )}
          {resume?.certifications?.length > 0 && (
            <Section title="Certifications">
              <p className="text-[11.5px] text-slate-700">{resume.certifications.join(" · ")}</p>
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
      <h2 className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
