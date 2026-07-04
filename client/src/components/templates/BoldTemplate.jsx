// Bold: dark left sidebar with name + contact + skills, white main column. Trendy & high-contrast.
export default function BoldTemplate({ personal, resume }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="flex min-h-full font-sans text-[13px] leading-relaxed text-dark">
      {/* Sidebar */}
      <aside className="w-[38%] bg-dark px-6 py-8 text-white">
        <div className="border-b border-white/15 pb-5">
          {personal.photo && (
            <img
              src={personal.photo}
              alt=""
              className="mb-4 h-20 w-20 rounded-full border-2 border-white/40 object-cover"
            />
          )}
          <h1 className="text-[22px] font-extrabold leading-tight tracking-tight">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-[12px] font-medium text-[color:var(--accent)]">
            {personal.jobTitle || resume?.experience?.[0]?.title || ""}
          </p>
        </div>

        {contacts.length > 0 && (
          <SideSection title="Contact">
            <ul className="space-y-1.5 text-[11.5px] text-white/80">
              {contacts.map((c) => (
                <li key={c} className="break-words">
                  {c}
                </li>
              ))}
            </ul>
          </SideSection>
        )}

        {resume?.skills?.length > 0 && (
          <SideSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white/10 px-2 py-1 text-[10.5px] font-medium text-white/90"
                >
                  {s}
                </span>
              ))}
            </div>
          </SideSection>
        )}

        {resume?.languages?.length > 0 && (
          <SideSection title="Languages">
            <ul className="space-y-1 text-[11.5px] text-white/80">
              {resume.languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </SideSection>
        )}

        {resume?.certifications?.length > 0 && (
          <SideSection title="Certifications">
            <ul className="space-y-1 text-[11.5px] text-white/80">
              {resume.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </SideSection>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 space-y-6 px-7 py-8">
        {resume?.summary && (
          <MainSection title="Profile">
            <p className="text-[12.5px] text-slate-700">{resume.summary}</p>
          </MainSection>
        )}

        {resume?.experience?.length > 0 && (
          <MainSection title="Experience">
            <div className="space-y-4">
              {resume.experience.map((job, i) => (
                <div key={i} className="relative border-l-2 border-[color:var(--accent-border)] pl-4">
                  <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-dark">{job.title}</h3>
                    <span className="shrink-0 text-[11px] text-muted">{job.dates}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-[color:var(--accent)]">{job.company}</p>
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
          </MainSection>
        )}

        {resume?.education?.length > 0 && (
          <MainSection title="Education">
            <div className="space-y-2.5">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-bold text-dark">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </p>
                    <p className="text-[12px] text-slate-600">{edu.institution}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted">{edu.year}</span>
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </main>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[color:var(--accent)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({ title, children }) {
  return (
    <section>
      <h2 className="mb-2.5 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wider text-dark">
        <span className="h-3 w-1 rounded bg-[var(--accent)]" />
        {title}
      </h2>
      {children}
    </section>
  );
}
