// Minimal: all white, black text, single column, thin grey dividers, lots of whitespace.
export default function MinimalTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white px-10 py-10 font-sans text-[13px] leading-relaxed text-black">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {personal.jobTitle || resume?.experience?.[0]?.title || ""}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
          {contacts.map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              {c}
              {i < contacts.length - 1 && <span className="text-neutral-300">·</span>}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8 space-y-7">
        {resume?.summary && (
          <Section title="Summary">
            <p className="text-[12.5px] text-neutral-800">{resume.summary}</p>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="Experience">
            <div className="space-y-5">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-semibold">{job.title}</h3>
                    <span className="shrink-0 text-[11px] text-neutral-500">{job.dates}</span>
                  </div>
                  <p className="text-[12px] text-neutral-600">{job.company}</p>
                  <ul className="mt-2 space-y-1.5">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="flex gap-2 text-[12px] text-neutral-800">
                        <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-neutral-400" />
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
          <Section title="Education">
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-semibold">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p className="text-[12px] text-neutral-600">{edu.institution}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-neutral-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {resume?.skills?.length > 0 && (
          <Section title="Skills">
            <p className="text-[12px] text-neutral-800">{resume.skills.join(" · ")}</p>
          </Section>
        )}

        {resume?.languages?.length > 0 && (
          <Section title="Languages">
            <p className="text-[12px] text-neutral-800">{resume.languages.join(" · ")}</p>
          </Section>
        )}

        {resume?.certifications?.length > 0 && (
          <Section title="Certifications">
            <p className="text-[12px] text-neutral-800">{resume.certifications.join(" · ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {title}
      </h2>
      <div className="border-t border-neutral-200 pt-3">{children}</div>
    </section>
  );
}
