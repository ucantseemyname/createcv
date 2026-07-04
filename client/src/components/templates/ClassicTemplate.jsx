// Classic: traditional serif layout, name centered, underlined section headers.
export default function ClassicTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white px-10 py-10 font-serif text-[13px] leading-relaxed text-black">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-[26px] font-bold tracking-wide">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-1 text-[13px] italic text-neutral-700">
          {personal.jobTitle || resume?.experience?.[0]?.title || ""}
        </p>
        <div className="mt-2 text-[11px] text-neutral-600">
          {contacts.join("  •  ")}
        </div>
      </header>

      <div className="mt-6 space-y-5">
        {resume?.summary && (
          <Section title="Professional Summary">
            <p className="text-[12.5px] text-neutral-900">{resume.summary}</p>
          </Section>
        )}

        {resume?.experience?.length > 0 && (
          <Section title="Professional Experience">
            <div className="space-y-4">
              {resume.experience.map((job, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-bold">
                      {job.title}
                      {job.company ? `, ${job.company}` : ""}
                    </h3>
                    <span className="shrink-0 text-[11px] italic text-neutral-600">
                      {job.dates}
                    </span>
                  </div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5">
                    {(job.bullets || []).map((b, j) => (
                      <li key={j} className="text-[12px] text-neutral-900">
                        {b}
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
                  <p className="text-[12.5px]">
                    <span className="font-bold">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </span>
                    {" — "}
                    {edu.institution}
                  </p>
                  <span className="shrink-0 text-[11px] italic text-neutral-600">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {resume?.skills?.length > 0 && (
          <Section title="Skills">
            <p className="text-[12px] text-neutral-900">{resume.skills.join(", ")}</p>
          </Section>
        )}

        {resume?.languages?.length > 0 && (
          <Section title="Languages">
            <p className="text-[12px] text-neutral-900">{resume.languages.join(", ")}</p>
          </Section>
        )}

        {resume?.certifications?.length > 0 && (
          <Section title="Certifications">
            <p className="text-[12px] text-neutral-900">{resume.certifications.join(", ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 border-b border-black pb-1 text-[12px] font-bold uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}
