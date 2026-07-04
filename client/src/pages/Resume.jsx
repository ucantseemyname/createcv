import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import ResumeSheet, {
  TEMPLATE_LIST,
  templateMeta,
  FONT_OPTIONS,
} from "../components/templates/index.jsx";
import TemplateThumb from "../components/templates/TemplateThumbs.jsx";
import { ACCENT_COLORS } from "../lib/accent.js";
import { useResume } from "../context/ResumeContext.jsx";
import {
  DownloadIcon,
  PencilIcon,
  SparkIcon,
  CopyIcon,
  CheckIcon,
  ArrowRight,
  ChevronIcon,
} from "../components/Icons.jsx";

const LOADING_MESSAGES = [
  "Reading your experience…",
  "Crafting a professional summary…",
  "Writing achievement-focused bullet points…",
  "Optimizing for ATS keywords…",
  "Polishing the final draft…",
];

export default function Resume() {
  const navigate = useNavigate();
  const location = useLocation();
  const { form, resume, setResume, updateSection } = useResume();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typedStatus, setTypedStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const sheetRef = useRef(null);
  const hasRequested = useRef(false);

  const template = form.target.template || "Modern";
  const accent = form.target.accent || "#2563EB";
  const accentOpacity = form.target.accentOpacity ?? 1;
  const font = form.target.font || "Default";

  // --- Inline content editing / reordering (keeps template layout intact) ---
  const patchResume = (patch) => setResume({ ...resume, ...patch });
  const updateExp = (i, key, value) =>
    patchResume({
      experience: resume.experience.map((e, idx) =>
        idx === i ? { ...e, [key]: value } : e
      ),
    });
  const updateExpBullets = (i, text) =>
    updateExp(
      i,
      "bullets",
      text.split("\n").map((s) => s.replace(/^[-•\s]+/, "").trim())
    );
  const moveExp = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= resume.experience.length) return;
    const list = [...resume.experience];
    [list[i], list[j]] = [list[j], list[i]];
    patchResume({ experience: list });
  };
  const removeExp = (i) =>
    patchResume({ experience: resume.experience.filter((_, idx) => idx !== i) });

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      try {
        res = await fetch("/api/generate-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } catch {
        throw new Error(
          "Can't reach the server. Make sure the backend is running (npm run server) on port 3001."
        );
      }

      // Read as text first so an empty or non-JSON body never throws on .json().
      const raw = (await res.text()).trim();
      if (!raw) {
        // Empty body almost always means the backend isn't reachable (proxy 500).
        throw new Error(
          "Couldn't reach the resume server. Start the backend (npm run server) and make sure ANTHROPIC_API_KEY is set in .env, then try again."
        );
      }
      let data = {};
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          `The server returned an unexpected response (status ${res.status}). ` +
            "Check that the backend is running and ANTHROPIC_API_KEY is set in .env."
        );
      }

      if (!res.ok || data.error) {
        throw new Error(
          data.error ||
            `Generation failed (status ${res.status}). Please try again.`
        );
      }
      if (!data.resume) {
        throw new Error("The server didn't return a resume. Please try regenerating.");
      }
      setResume(data.resume);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Kick off generation when arriving with intent, or if no resume exists yet.
  useEffect(() => {
    if (hasRequested.current) return;
    const wantsGenerate = location.state?.generate;
    if (wantsGenerate || !resume) {
      hasRequested.current = true;
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typing effect that cycles through loading messages.
  useEffect(() => {
    if (!loading) return;
    let msgIndex = 0;
    let charIndex = 0;
    let timer;

    const tick = () => {
      const current = LOADING_MESSAGES[msgIndex];
      charIndex += 1;
      setTypedStatus(current.slice(0, charIndex));
      if (charIndex < current.length) {
        timer = setTimeout(tick, 35);
      } else {
        // pause, then move to next message
        timer = setTimeout(() => {
          msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
          charIndex = 0;
          tick();
        }, 900);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [loading]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleDownload = async () => {
    if (!sheetRef.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const name = (form.personal.fullName || "resume")
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase();
      await html2pdf()
        .set({
          margin: 0,
          filename: `${name}_resume.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
        })
        .from(sheetRef.current)
        .save();
    } catch (err) {
      setError("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <Logo />
          <button
            onClick={() => navigate("/build")}
            className="text-sm font-medium text-muted hover:text-dark"
          >
            ← Back to form
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_320px]">
        {/* LEFT — preview */}
        <div className="order-2 lg:order-1">
          <div className="overflow-x-auto rounded-2xl bg-slate-100 p-4 sm:p-8">
            {loading ? (
              <SkeletonResume typedStatus={typedStatus} />
            ) : error && !resume ? (
              <ErrorState message={error} onRetry={generate} />
            ) : resume ? (
              <div className="animate-fade-up">
                <ResumeSheet
                  ref={sheetRef}
                  template={template}
                  personal={form.personal}
                  resume={resume}
                  accent={accent}
                  accentOpacity={accentOpacity}
                  font={font}
                />
              </div>
            ) : (
              <SkeletonResume typedStatus="Preparing…" />
            )}
          </div>
        </div>

        {/* RIGHT — actions */}
        <aside className="order-1 lg:order-2">
          <div className="sticky top-20 space-y-5">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <h2 className="text-sm font-semibold text-dark">Your Resume</h2>
              <p className="mt-1 text-xs text-muted">
                {loading
                  ? "theshaqsco is writing your resume…"
                  : resume
                  ? "Ready! Download or fine-tune below."
                  : "Generate to get started."}
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  onClick={handleDownload}
                  disabled={!resume || loading || exporting}
                  className="btn-primary w-full"
                >
                  <DownloadIcon className="h-4 w-4" />
                  {exporting ? "Exporting…" : "Download PDF"}
                </button>

                <button
                  onClick={() => navigate("/build")}
                  className="btn-ghost w-full"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Info
                </button>

                <button
                  onClick={generate}
                  disabled={loading || exporting}
                  className="btn-ghost w-full"
                >
                  <SparkIcon className="h-4 w-4" />
                  {loading ? "Generating…" : "Regenerate"}
                </button>
              </div>
            </div>

            {/* Style: color, opacity, font */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <h3 className="text-sm font-semibold text-dark">Style</h3>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Accent color</span>
                <label
                  className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary"
                  title="Pick any custom color"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ background: accent }}
                  />
                  Custom
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => updateSection("target", { accent: e.target.value })}
                    className="h-0 w-0 opacity-0"
                  />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => {
                  const active = accent.toLowerCase() === c.value.toLowerCase();
                  return (
                    <button
                      key={c.value}
                      title={c.name}
                      onClick={() => updateSection("target", { accent: c.value })}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        active ? "ring-2 ring-offset-2" : "hover:scale-110"
                      }`}
                      style={{ background: c.value, "--tw-ring-color": c.value }}
                    >
                      {active && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
              {!templateMeta(template).accent && (
                <p className="mt-2 text-xs text-muted">
                  {template} is black &amp; white — pick another template to use color.
                </p>
              )}

              {/* Opacity */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">Accent intensity</span>
                  <span className="text-xs font-medium text-dark">
                    {Math.round(accentOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.05"
                  value={accentOpacity}
                  onChange={(e) =>
                    updateSection("target", { accentOpacity: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-primary"
                />
              </div>

              {/* Font */}
              <div className="mt-4">
                <span className="text-xs font-medium text-muted">Font</span>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {FONT_OPTIONS.map((f) => {
                    const active = font === f;
                    return (
                      <button
                        key={f}
                        onClick={() => updateSection("target", { font: f })}
                        className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted hover:border-primary/40"
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Edit content — inline text edits + reordering (layout unchanged) */}
            {resume && (
              <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                <button
                  onClick={() => setEditingOpen((v) => !v)}
                  className="flex w-full items-center justify-between"
                >
                  <h3 className="text-sm font-semibold text-dark">Edit Content</h3>
                  <ChevronIcon
                    className={`h-4 w-4 text-muted transition-transform ${
                      editingOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {editingOpen && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted">
                        Summary
                      </label>
                      <textarea
                        rows={4}
                        className="field-input resize-none text-xs"
                        value={resume.summary || ""}
                        onChange={(e) => patchResume({ summary: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted">Experience</span>
                        <span className="text-[10px] text-muted">
                          reorder with ↑ ↓
                        </span>
                      </div>
                      <div className="space-y-3">
                        {(resume.experience || []).map((job, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-border bg-surface p-3"
                          >
                            <div className="mb-2 flex items-center justify-end gap-1">
                              <button
                                onClick={() => moveExp(i, -1)}
                                disabled={i === 0}
                                className="rounded p-1 text-muted hover:bg-white hover:text-dark disabled:opacity-30"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveExp(i, 1)}
                                disabled={i === resume.experience.length - 1}
                                className="rounded p-1 text-muted hover:bg-white hover:text-dark disabled:opacity-30"
                                title="Move down"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => removeExp(i)}
                                className="rounded p-1 text-muted hover:bg-white hover:text-red-500"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              className="field-input mb-1.5 text-xs"
                              value={job.title || ""}
                              placeholder="Job title"
                              onChange={(e) => updateExp(i, "title", e.target.value)}
                            />
                            <div className="mb-1.5 grid grid-cols-2 gap-1.5">
                              <input
                                className="field-input text-xs"
                                value={job.company || ""}
                                placeholder="Company"
                                onChange={(e) => updateExp(i, "company", e.target.value)}
                              />
                              <input
                                className="field-input text-xs"
                                value={job.dates || ""}
                                placeholder="Dates"
                                onChange={(e) => updateExp(i, "dates", e.target.value)}
                              />
                            </div>
                            <textarea
                              rows={3}
                              className="field-input resize-none text-xs"
                              value={(job.bullets || []).join("\n")}
                              placeholder="One bullet per line"
                              onChange={(e) => updateExpBullets(i, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted">
                        Skills (comma separated)
                      </label>
                      <input
                        className="field-input text-xs"
                        value={(resume.skills || []).join(", ")}
                        onChange={(e) =>
                          patchResume({
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>

                    <p className="text-[11px] leading-relaxed text-muted">
                      Edits update the preview live and keep the template layout. Regenerating
                      replaces these edits.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Template switcher */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <h3 className="text-sm font-semibold text-dark">Change Template</h3>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {TEMPLATE_LIST.map((tpl) => {
                  const active = template === tpl.name;
                  return (
                    <button
                      key={tpl.name}
                      onClick={() => updateSection("target", { template: tpl.name })}
                      title={tpl.suitable}
                      className={`overflow-hidden rounded-lg border-2 text-left transition ${
                        active
                          ? "border-primary shadow-soft"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="relative bg-surface p-2">
                        <div className="overflow-hidden rounded border border-border">
                          <TemplateThumb name={tpl.name} accent={accent} />
                        </div>
                        <div className="absolute left-3 top-3 flex gap-1">
                          {tpl.ats && (
                            <span className="rounded bg-success/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                              ATS
                            </span>
                          )}
                          {tpl.pro && (
                            <span className="rounded bg-dark/85 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                              PRO
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span
                          className={`text-xs font-semibold ${
                            active ? "text-primary" : "text-dark"
                          }`}
                        >
                          {tpl.name}
                        </span>
                        {active && <CheckIcon className="h-3.5 w-3.5 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {templateMeta(template).suitable}
              </p>
            </div>

            {/* Share */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <h3 className="text-sm font-semibold text-dark">Share Link</h3>
              <p className="mt-1 text-xs text-muted">
                Copy the page URL to share your work in progress.
              </p>
              <button onClick={handleCopy} className="btn-ghost mt-3 w-full">
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    Copy URL
                  </>
                )}
              </button>
            </div>

            {error && resume && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            {!resume && !loading && (
              <button onClick={() => navigate("/build")} className="btn-primary w-full">
                Start a Resume
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function SkeletonResume({ typedStatus }) {
  return (
    <div className="mx-auto w-[794px]" style={{ minHeight: "600px" }}>
      <div className="overflow-hidden rounded-lg bg-white shadow-card">
        <div className="bg-primary px-8 py-6">
          <div className="h-6 w-52 rounded bg-white/30 shimmer" />
          <div className="mt-2 h-3 w-36 rounded bg-white/20" />
        </div>
        <div className="space-y-6 p-8">
          <div className="rounded-lg bg-primary/5 px-4 py-3 text-center">
            <span className="text-sm font-medium text-primary typing-caret">
              {typedStatus}
            </span>
          </div>
          {[0, 1, 2].map((s) => (
            <div key={s} className="space-y-2">
              <div className="h-3 w-28 rounded bg-slate-200 shimmer" />
              <div className="h-2.5 w-full rounded bg-slate-100 shimmer" />
              <div className="h-2.5 w-11/12 rounded bg-slate-100 shimmer" />
              <div className="h-2.5 w-4/5 rounded bg-slate-100 shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-white px-8 py-16 text-center shadow-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
        ⚠️
      </div>
      <h3 className="mt-4 text-lg font-semibold text-dark">Couldn't generate</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <button onClick={onRetry} className="btn-primary mt-6">
        <SparkIcon className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
