import { useState } from "react";

const faqs = [
  {
    q: "What types of job seekers do you work with?",
    a: "Everyone — from new graduates writing their first resume to senior professionals switching industries. Just answer a few questions and theshaqsco tailors the wording to your target role.",
  },
  {
    q: "How long does it take to build a resume?",
    a: "Under two minutes. You fill in a short guided form, theshaqsco writes achievement-focused content, and you download a print-ready PDF.",
  },
  {
    q: "Do I need writing skills to get started?",
    a: "Not at all. theshaqsco turns your raw notes into polished, quantified bullet points with strong action verbs — no blank-page anxiety required.",
  },
  {
    q: "Will my resume pass ATS screening systems?",
    a: "Yes. Every template uses clean, parseable structure and standard headings, and theshaqsco weaves in relevant keywords for your role and industry.",
  },
  {
    q: "Can I edit and switch templates after generating?",
    a: "Anytime. Jump back to the form to change details, regenerate the content, or switch instantly between all six templates — your info is saved as you go.",
  },
];

function Toggle({ open }) {
  return (
    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <span className="absolute h-[1.5px] w-3 rounded bg-white" />
      <span
        className={`absolute h-3 w-[1.5px] rounded bg-white transition-transform duration-300 ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border transition ${
              isOpen ? "border-primary/30 bg-surface" : "border-border bg-surface"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-medium text-dark">{item.q}</span>
              <Toggle open={isOpen} />
            </button>
            <div
              className={`grid overflow-hidden px-5 transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="min-h-0 max-w-2xl text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
