import { Tilt, Typewriter } from "./Motion.jsx";
import TemplateThumb from "./templates/TemplateThumbs.jsx";

// The redesigned hero visual: a 3D-tilt resume card with an animated gradient
// border and a live "AI typing" line, with template cards fanned behind it.
export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* glow */}
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/25 via-secondary/15 to-success/15 blur-3xl" />

      {/* fanned template cards behind */}
      <div className="absolute -left-10 top-10 hidden w-40 rotate-[-9deg] animate-float-slow rounded-xl border border-border bg-white p-2 shadow-card sm:block">
        <TemplateThumb name="Bold" accent="#2563EB" />
      </div>
      <div className="absolute -right-8 top-16 hidden w-40 rotate-[8deg] animate-float rounded-xl border border-border bg-white p-2 shadow-card sm:block [animation-delay:-2.5s]">
        <TemplateThumb name="Creative" accent="#22C55E" />
      </div>

      {/* floating chips */}
      <div className="absolute -left-5 -top-5 z-20 animate-float rounded-xl border border-border bg-white px-3 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-success/10 text-success">✓</span>
          <span className="text-xs font-semibold text-dark">ATS Optimized</span>
        </div>
      </div>
      <div className="absolute -bottom-5 right-2 z-20 animate-float rounded-xl border border-border bg-white px-3 py-2 shadow-card [animation-delay:-1.5s]">
        <div className="flex items-center gap-2">
          <span className="animate-twinkle text-primary">✦</span>
          <span className="text-xs font-semibold text-dark">Made by theshaqsco</span>
        </div>
      </div>

      {/* main card with animated gradient border + tilt */}
      <Tilt className="relative z-10">
        <div className="grad-border shadow-float">
          <div className="rounded-[18px] bg-white p-5">
            {/* header */}
            <div className="-m-5 mb-4 rounded-t-[18px] bg-primary px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">Jordan Avery</div>
                  <div className="text-xs text-white/80">Senior Product Designer</div>
                </div>
                <span className="h-2.5 w-2.5 animate-twinkle rounded-full bg-white/90" />
              </div>
            </div>

            {/* live AI typing line */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
              <span className="animate-twinkle text-primary">✦</span>
              <span className="text-[12px] font-medium text-muted">
                <Typewriter
                  words={[
                    "Writing your summary…",
                    "Adding quantified wins…",
                    "Optimizing for ATS…",
                  ]}
                />
              </span>
            </div>

            {/* shimmering body lines */}
            <div className="space-y-3">
              <div>
                <div className="mb-2 h-2 w-20 rounded bg-primary/60" />
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded shimmer" />
                  <div className="h-2 w-11/12 rounded shimmer" />
                  <div className="h-2 w-4/5 rounded shimmer" />
                </div>
              </div>
              <div>
                <div className="mb-2 h-2 w-16 rounded bg-primary/60" />
                {[0, 1].map((i) => (
                  <div key={i} className="mb-1.5 flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-full rounded shimmer" />
                      <div className="h-2 w-5/6 rounded shimmer" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Figma", "Research", "Design Systems", "Strategy"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
