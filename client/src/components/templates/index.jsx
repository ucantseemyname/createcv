import { forwardRef } from "react";
import ModernTemplate from "./ModernTemplate.jsx";
import MinimalTemplate from "./MinimalTemplate.jsx";
import ClassicTemplate from "./ClassicTemplate.jsx";
import BoldTemplate from "./BoldTemplate.jsx";
import ElegantTemplate from "./ElegantTemplate.jsx";
import CreativeTemplate from "./CreativeTemplate.jsx";
import ExecutiveTemplate from "./ExecutiveTemplate.jsx";
import CompactTemplate from "./CompactTemplate.jsx";
import TechTemplate from "./TechTemplate.jsx";
import ProfessionalTemplate from "./ProfessionalTemplate.jsx";
import { accentVars } from "../../lib/accent.js";

const map = {
  Modern: ModernTemplate,
  Minimal: MinimalTemplate,
  Classic: ClassicTemplate,
  Bold: BoldTemplate,
  Elegant: ElegantTemplate,
  Creative: CreativeTemplate,
  Executive: ExecutiveTemplate,
  Compact: CompactTemplate,
  Tech: TechTemplate,
  Professional: ProfessionalTemplate,
};

// Single source of truth for the picker UIs (Build + Resume + Landing).
// `suitable` = one-line "why this fits". `photo` = template shows a profile picture.
// `accent` = template responds to the chosen accent color (Minimal/Classic stay mono).
export const TEMPLATE_LIST = [
  {
    name: "Modern",
    desc: "Accent header, two columns",
    suitable: "Best for tech, product, and startup roles where clean structure wins.",
    photo: true,
    accent: true,
    ats: true,
    pro: false,
  },
  {
    name: "Minimal",
    desc: "Black & white, airy",
    suitable: "Best when you want the content to speak — great for academia and finance.",
    photo: false,
    accent: false,
    ats: true,
    pro: false,
  },
  {
    name: "Classic",
    desc: "Serif, traditional",
    suitable: "Best for traditional fields like law, government, and academia.",
    photo: false,
    accent: false,
    ats: true,
    pro: false,
  },
  {
    name: "Compact",
    desc: "Dense, single page",
    suitable: "Best when you have lots of experience to fit on one page.",
    photo: false,
    accent: true,
    ats: true,
    pro: false,
  },
  {
    name: "Elegant",
    desc: "Editorial, refined spacing",
    suitable: "Best for senior professionals who want a refined, understated look.",
    photo: false,
    accent: true,
    ats: true,
    pro: true,
  },
  {
    name: "Bold",
    desc: "Dark sidebar, high contrast",
    suitable: "Best for standing out in design, marketing, and creative-leaning roles.",
    photo: true,
    accent: true,
    ats: false,
    pro: true,
  },
  {
    name: "Creative",
    desc: "Gradient, modern blocks",
    suitable: "Best for designers and marketers who want personality with polish.",
    photo: true,
    accent: true,
    ats: false,
    pro: true,
  },
  {
    name: "Executive",
    desc: "Photo header, authoritative",
    suitable: "Best for leadership and C-suite roles that call for gravitas.",
    photo: true,
    accent: true,
    ats: true,
    pro: true,
  },
  {
    name: "Tech",
    desc: "Monospace, skill-forward",
    suitable: "Best for software engineers and data roles that emphasize the stack.",
    photo: false,
    accent: true,
    ats: true,
    pro: false,
  },
  {
    name: "Professional",
    desc: "Serif, centered header, ruled sections",
    suitable: "Best for multi-industry professionals and ATS-heavy applications.",
    photo: false,
    accent: true,
    ats: true,
    pro: true,
  },
];

export const templateMeta = (name) =>
  TEMPLATE_LIST.find((t) => t.name === name) || TEMPLATE_LIST[0];

export const FONT_OPTIONS = ["Default", "Sans", "Serif", "Mono"];

// Renders the chosen template at fixed A4 width so PDF export is print-ready.
// The forwarded ref points at the A4 sheet for html2pdf.
const ResumeSheet = forwardRef(function ResumeSheet(
  {
    template = "Modern",
    personal,
    resume,
    accent = "#2563EB",
    accentOpacity = 1,
    font = "Default",
  },
  ref
) {
  const Template = map[template] || ModernTemplate;
  const fontClass =
    font === "Sans"
      ? "sheet-font-sans"
      : font === "Serif"
      ? "sheet-font-serif"
      : font === "Mono"
      ? "sheet-font-mono"
      : "";
  return (
    <div
      ref={ref}
      className={`mx-auto w-[794px] overflow-hidden rounded-lg bg-white shadow-card ${fontClass}`}
      style={{ minHeight: "1123px", ...accentVars(accent, accentOpacity) }}
    >
      <Template personal={personal} resume={resume} />
    </div>
  );
});

export default ResumeSheet;
