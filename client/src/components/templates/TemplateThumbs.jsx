// Live miniature of the real template, filled with sample data, so each thumbnail
// shows exactly how the template looks (name, sections, bullets, skills, photo).
import { useLayoutEffect, useRef, useState } from "react";
import ResumeSheet, { templateMeta } from "./index.jsx";

// A small inline avatar used on photo-friendly templates.
const SAMPLE_PHOTO =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>` +
      `<rect width='120' height='120' fill='#cbd5e1'/>` +
      `<circle cx='60' cy='48' r='22' fill='#f8fafc'/>` +
      `<circle cx='60' cy='118' r='40' fill='#f8fafc'/></svg>`
  );

const SAMPLE_PERSONAL = {
  fullName: "Alex Morgan",
  jobTitle: "Marketing Lead",
  email: "alex@email.com",
  phone: "+1 555 0100",
  location: "Austin, USA",
  linkedin: "linkedin.com/in/alex",
  website: "alexmorgan.co",
};

const SAMPLE_RESUME = {
  summary:
    "Marketing leader with 8+ years growing brands through data-driven campaigns and strong, cross-functional teams that beat their targets.",
  experience: [
    {
      company: "Acme Inc.",
      title: "Marketing Lead",
      dates: "2021 – Present",
      bullets: [
        "Grew revenue 40% via lifecycle and CRM programs.",
        "Led a team of 6 across brand and growth.",
      ],
    },
    {
      company: "Brightline Co.",
      title: "Marketing Manager",
      dates: "2018 – 2021",
      bullets: ["Launched 3 products, all hitting first-year targets."],
    },
  ],
  education: [
    { degree: "B.A.", field: "Marketing", institution: "UT Austin", year: "2016" },
  ],
  skills: ["Brand Strategy", "SEO / SEM", "Analytics", "Content", "Email", "Research"],
  languages: ["English (Native)", "Spanish (Fluent)"],
  certifications: ["Google Ads Certified"],
};

const SHEET_WIDTH = 794; // A4 px width the real sheet renders at

export default function TemplateThumb({ name, accent = "#2563EB", photo }) {
  const meta = templateMeta(name);
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.24);

  // Scale the full-size sheet down to whatever width the thumbnail container is.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / SHEET_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const showPhoto = photo ?? meta.photo;
  const personal = { ...SAMPLE_PERSONAL, photo: showPhoto ? SAMPLE_PHOTO : "" };
  const usedAccent = meta.accent ? accent : "#0f172a";

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="relative w-full select-none overflow-hidden rounded bg-white"
      style={{ aspectRatio: "4 / 3" }}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: SHEET_WIDTH, transform: `scale(${scale})` }}
      >
        <ResumeSheet
          template={name}
          personal={personal}
          resume={SAMPLE_RESUME}
          accent={usedAccent}
        />
      </div>
    </div>
  );
}
