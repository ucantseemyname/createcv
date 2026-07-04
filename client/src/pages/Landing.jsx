import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Logo from "../components/Logo.jsx";
import FAQ from "../components/FAQ.jsx";
import HeroShowcase from "../components/HeroShowcase.jsx";
import { Reveal, CountUp } from "../components/Motion.jsx";
import { TEMPLATE_LIST } from "../components/templates/index.jsx";
import TemplateThumb from "../components/templates/TemplateThumbs.jsx";
import {
  PencilIcon,
  SparkIcon,
  DownloadIcon,
  ShieldIcon,
  LayersIcon,
  TargetIcon,
  PenIcon,
  CheckIcon,
  ArrowRight,
  ClockIcon,
  QuoteIcon,
} from "../components/Icons.jsx";

/* --------------------------------------------------------------- data */

const stats = [
  { to: 20, suffix: "k+", label: "Resumes created" },
  { to: 92, suffix: "%", label: "Got more interviews" },
  { text: "< 2 min", label: "Average build time" },
  { to: 9, suffix: "", label: "Recruiter-ready templates" },
];

const steps = [
  {
    icon: PencilIcon,
    title: "Fill in your details",
    desc: "Answer a short, guided form about your experience, skills, and the role you're targeting.",
  },
  {
    icon: SparkIcon,
    title: "theshaqsco writes it",
    desc: "theshaqsco drafts a tailored, achievement-focused, ATS-optimized resume in seconds.",
  },
  {
    icon: DownloadIcon,
    title: "Download your PDF",
    desc: "Preview it live, switch templates if you like, and export a print-ready PDF.",
  },
];

const features = [
  {
    icon: SparkIcon,
    title: "Done-for-you content",
    desc: "theshaqsco turns your notes into sharp bullet points with strong action verbs and quantified impact.",
  },
  {
    icon: ShieldIcon,
    title: "ATS optimized",
    desc: "Clean structure and the right keywords so applicant tracking systems read you correctly.",
  },
  {
    icon: LayersIcon,
    title: "Nine templates",
    desc: "Switch instantly between nine styles — with your own accent color and optional photo.",
  },
  {
    icon: DownloadIcon,
    title: "Instant PDF export",
    desc: "Download a crisp, print-ready A4 PDF with a single click — no watermarks.",
  },
  {
    icon: TargetIcon,
    title: "Tailored to your role",
    desc: "Everything is rewritten around your target job title and industry.",
  },
  {
    icon: PenIcon,
    title: "No writing skills needed",
    desc: "Skip the blank page. Describe your work and let theshaqsco handle the wording.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Data Analyst",
    quote:
      "I'd been tweaking my resume for weeks. createcv wrote a stronger one in two minutes — and I got a callback three days later.",
  },
  {
    name: "Marcus T.",
    role: "Product Manager",
    quote:
      "It reframed my support-team experience into PM-ready bullet points I never would've thought of. Genuinely impressive.",
  },
  {
    name: "Lena K.",
    role: "New Graduate",
    quote:
      "As a new grad I had no idea how to sound professional. The tone options and ATS formatting felt like a personal career coach.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: ["1 resume", "Basic template", "PDF download", "ATS-friendly structure"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    cadence: "/month",
    features: [
      "Unlimited resumes",
      "All six templates",
      "Cover letter generator",
      "Priority generation",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Lifetime",
    price: "$9",
    cadence: "once",
    features: [
      "Lifetime access",
      "All current & future templates",
      "Unlimited resumes",
      "Every feature included",
    ],
    cta: "Get Lifetime",
    highlighted: false,
  },
];

/* ------------------------------------------------------------ helpers */

function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 ${className}`}>
      {children}
    </section>
  );
}

function Kicker({ children }) {
  return (
    <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- page */

export default function Landing() {
  const navigate = useNavigate();
  const go = () => navigate("/build");

  return (
    <div id="top" className="min-h-screen bg-bg text-dark">
      <Navbar />

      {/* ============================ HERO */}
      <div className="relative overflow-hidden">
        {/* animated aurora background */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span
            className="aurora-blob animate-aurora"
            style={{ width: 420, height: 420, top: -120, left: -80, background: "#3B82F6" }}
          />
          <span
            className="aurora-blob animate-aurora-slow"
            style={{ width: 480, height: 480, top: -60, right: -120, background: "#2563EB" }}
          />
          <span
            className="aurora-blob animate-aurora"
            style={{ width: 360, height: 360, top: 240, left: "48%", background: "#22C55E", opacity: 0.1 }}
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-[560px] grid-pattern [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <Section className="relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-24">
          {/* LEFT — copy */}
          <div className="text-center lg:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted shadow-soft backdrop-blur">
                <span className="h-1.5 w-1.5 animate-twinkle rounded-full bg-success" />
                Made by theshaqsco
                <span className="text-border">·</span>
                <span className="text-primary">★ 5.0 rated</span>
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-dark sm:text-4xl lg:text-[2.6rem]">
                Land your{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                  dream job
                </span>
                <br className="hidden sm:block" /> with a standout resume
              </h1>
            </Reveal>

            <Reveal delay={170}>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted lg:mx-0">
                Answer a few questions and theshaqsco builds a polished, ATS-ready resume in
                seconds. No templates to wrestle with, no blank page.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <button onClick={go} className="btn-primary sheen text-base hover:-translate-y-0.5">
                  Build My Resume Free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/analyze")}
                  className="btn-ghost text-base hover:-translate-y-0.5"
                >
                  Score my current CV
                </button>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex -space-x-2">
                  {["#2563EB", "#3B82F6", "#22C55E", "#0F2A4A"].map((c, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-sm"
                      style={{ background: c }}
                    >
                      {["P", "M", "L", "A"][i]}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted">
                  Joined by <span className="font-semibold text-dark">20,000+</span> job
                  seekers
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — animated showcase */}
          <Reveal delay={200} className="lg:pl-6">
            <HeroShowcase />
          </Reveal>
        </Section>
      </div>

      {/* ============================ STATS */}
      <Section className="pb-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group bg-white px-6 py-7 text-center transition-colors hover:bg-surface"
              >
                <div className="text-3xl font-extrabold tracking-tight text-primary transition-transform group-hover:scale-110">
                  {s.text ? (
                    s.text
                  ) : (
                    <CountUp to={s.to} suffix={s.suffix} />
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ============================ HOW IT WORKS */}
      <Section id="how" className="py-20 text-center">
        <Reveal>
          <Kicker>How it works</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            A great resume in three simple steps
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            From blank page to recruiter-ready in under two minutes.
          </p>
        </Reveal>
        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-border md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 110} className="group relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-primary shadow-soft transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-card">
                <step.icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="mx-auto mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-dark">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================ FEATURES */}
      <section id="features" className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <Kicker>Features</Kicker>
            <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
              Everything you need to get hired
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 3) * 90}
                className="group rounded-2xl border border-border bg-white p-6 text-left transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ TEMPLATES */}
      <Section id="templates" className="py-20 text-center">
        <Reveal>
          <Kicker>Templates</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            Nine recruiter-ready templates
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Each one shows exactly how it looks and why it fits. Generate once, then switch
            styles and colors instantly.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_LIST.map((t, i) => (
            <Reveal
              key={t.name}
              delay={(i % 3) * 80}
              className="group overflow-hidden rounded-2xl border border-border bg-white text-left transition duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-card"
            >
              <div className="relative border-b border-border bg-surface p-5">
                <div className="overflow-hidden rounded-lg border border-border shadow-sm">
                  <TemplateThumb name={t.name} accent="#2563EB" />
                </div>
                <div className="absolute left-6 top-6 flex gap-1">
                  {t.ats && (
                    <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      ATS
                    </span>
                  )}
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold shadow-sm ${
                      t.pro
                        ? "bg-dark text-white"
                        : "bg-white text-success ring-1 ring-success/30"
                    }`}
                  >
                    {t.pro ? "PRO" : "FREE"}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-dark">{t.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {t.photo && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
                        Photo
                      </span>
                    )}
                    {t.accent && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Color
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{t.suitable}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <button onClick={go} className="btn-primary sheen mt-10 text-base hover:-translate-y-0.5">
          Try a Template Free <ArrowRight className="h-4 w-4" />
        </button>
      </Section>

      {/* ============================ TESTIMONIALS */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <Kicker>Testimonials</Kicker>
            <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
              Job seekers love their results
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 110}
                as="figure"
                className="rounded-2xl border border-border bg-white p-7 text-left shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-card"
              >
                <QuoteIcon className="h-8 w-8 text-primary/25" />
                <blockquote className="mt-3 text-sm leading-relaxed text-dark">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-dark">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PRICING */}
      <Section id="pricing" className="py-20 text-center">
        <Reveal>
          <Kicker>Pricing</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            Simple pricing that pays for itself
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Start free. Upgrade only when you want unlimited resumes and every template.
          </p>
        </Reveal>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 100}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 text-left transition duration-300 ${
                p.highlighted
                  ? "border-primary shadow-card ring-2 ring-primary/15 md:-translate-y-3 hover:md:-translate-y-4"
                  : "border-border shadow-soft hover:-translate-y-1.5 hover:shadow-card"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-soft">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-dark">{p.name}</h3>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-dark">
                  {p.price}
                </span>
                <span className="mb-1 text-sm text-muted">{p.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-dark">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={go}
                className={`mt-7 ${p.highlighted ? "btn-primary sheen" : "btn-ghost"}`}
              >
                {p.cta}
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================ FAQ */}
      <Section id="faq" className="py-20">
        <Reveal className="mb-12 text-center">
          <Kicker>FAQ</Kicker>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <FAQ />
        </Reveal>
      </Section>

      {/* ============================ FINAL CTA */}
      <Section className="pb-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-dark px-8 py-16 text-center text-white shadow-float">
          <div className="absolute inset-0 hero-glow opacity-60" />
          <span className="aurora-blob animate-aurora absolute -right-16 -top-16 h-60 w-60 rounded-full bg-primary/40" />
          <span className="aurora-blob animate-aurora-slow absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-secondary/30" />
          <div className="relative">
            <ClockIcon className="mx-auto h-10 w-10 animate-bob text-white/70" />
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Start building your resume now
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/75">
              Your dream job starts with the perfect resume. It only takes two minutes.
            </p>
            <button
              onClick={go}
              className="sheen mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-soft transition hover:-translate-y-0.5 hover:bg-surface active:scale-[0.98]"
            >
              Build My Resume Free <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </Section>

      {/* ============================ FOOTER */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted">
            Your dream job starts with the perfect resume.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="#features" className="hover:text-dark">Features</a>
            <a href="#templates" className="hover:text-dark">Templates</a>
            <a href="#pricing" className="hover:text-dark">Pricing</a>
            <a href="#faq" className="hover:text-dark">FAQ</a>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted">
          © {new Date().getFullYear()} createcv by theshaqsco.
        </div>
      </footer>
    </div>
  );
}
