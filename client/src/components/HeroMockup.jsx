// Decorative floating resume card shown in the hero.
export default function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* glow */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-secondary/10 to-transparent blur-2xl" />

      {/* floating accent chips */}
      <div className="absolute -left-6 top-10 z-20 hidden animate-float rounded-xl border border-border bg-white px-3 py-2 shadow-card sm:block [animation-delay:-2s]">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-success/10 text-success">
            ✓
          </span>
          <span className="text-xs font-semibold text-dark">ATS Optimized</span>
        </div>
      </div>
      <div className="absolute -right-5 bottom-16 z-20 hidden animate-float rounded-xl border border-border bg-white px-3 py-2 shadow-card sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            ★
          </span>
          <span className="text-xs font-semibold text-dark">Made by theshaqsco</span>
        </div>
      </div>

      {/* resume card */}
      <div className="relative z-10 animate-float rounded-2xl border border-border bg-white p-6 shadow-float">
        {/* teal header bar */}
        <div className="-mx-6 -mt-6 mb-5 rounded-t-2xl bg-primary px-6 py-5 text-white">
          <div className="text-lg font-bold">Jordan Avery</div>
          <div className="text-sm text-white/80">Senior Product Designer</div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 h-2 w-24 rounded bg-primary/70" />
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded bg-surface" />
              <div className="h-2 w-11/12 rounded bg-surface" />
              <div className="h-2 w-4/5 rounded bg-surface" />
            </div>
          </div>

          <div>
            <div className="mb-2 h-2 w-20 rounded bg-primary/70" />
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-surface" />
                    <div className="h-2 w-5/6 rounded bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["Figma", "Research", "Prototyping", "Strategy"].map((s) => (
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
  );
}
