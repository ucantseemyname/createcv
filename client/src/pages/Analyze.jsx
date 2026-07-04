import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useResume } from "../context/ResumeContext.jsx";
import { TEMPLATE_LIST } from "../components/templates/index.jsx";
import TemplateThumb from "../components/templates/TemplateThumbs.jsx";
import { ACCENT_COLORS } from "../lib/accent.js";
import { ArrowRight, CheckIcon, SparkIcon } from "../components/Icons.jsx";

function scoreColor(s) {
  if (s >= 75) return "#22C55E";
  if (s >= 50) return "#D97706";
  return "#DC2626";
}

function ScoreRing({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  const col = scoreColor(score);
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold" style={{ color: col }}>
          {score}
        </span>
        <span className="text-xs font-medium text-muted">ATS score</span>
      </div>
    </div>
  );
}

export default function Analyze() {
  const navigate = useNavigate();
  const { setForm, setResume } = useResume();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [pasted, setPasted] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [template, setTemplate] = useState("Modern");
  const [accent, setAccent] = useState("#2563EB");

  const analyze = async () => {
    setError("");
    setLoading(true);
    try {
      let text = pasted.trim();
      if (file && !text) {
        const { extractCvText } = await import("../lib/parseCv.js");
        text = await extractCvText(file);
      }
      if (!text || text.length < 40) {
        throw new Error(
          "Couldn't read enough text. Upload a text-based PDF/.txt, or paste your resume."
        );
      }

      const res = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetRole }),
      });
      const rawBody = (await res.text()).trim();
      let data = {};
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          throw new Error("The server returned an unexpected response. Is the backend running?");
        }
      } else {
        throw new Error(
          "Couldn't reach the server. Start the backend (npm run server) and set ANTHROPIC_API_KEY."
        );
      }
      if (!res.ok || data.error) throw new Error(data.error || "Analysis failed.");
      setResult(data);
      if (data.extracted?.personal?.jobTitle && !targetRole)
        setTargetRole(data.extracted.personal.jobTitle);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const rebuild = () => {
    const ex = result.extracted;
    setForm({
      personal: ex.personal,
      experience: ex.experience.length
        ? ex.experience
        : [{ company: "", title: "", startDate: "", endDate: "", responsibilities: "" }],
      education: ex.education.length
        ? ex.education
        : [{ degree: "", institution: "", year: "", field: "" }],
      extras: ex.extras,
      target: {
        role: targetRole || ex.personal.jobTitle || "",
        industry: "",
        tone: "Professional",
        template,
        accent,
        accentOpacity: 1,
        font: "Default",
      },
    });
    setResume(null);
    navigate("/resume", { state: { generate: true } });
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Free ATS check
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            Score your current resume
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Upload your CV to get an instant ATS score and fixes — then rebuild it into a
            recruiter-ready template in seconds.
          </p>
        </div>

        {/* ---------------- Upload / paste ---------------- */}
        {!result && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-soft sm:p-8">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setShowPaste(false);
                  setPasted("");
                }
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface px-6 py-10 text-center transition hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-dark">
                {file ? file.name : "Drop your CV here or click to upload"}
              </p>
              <p className="mt-1 text-xs text-muted">PDF or TXT · text-based files work best</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.txt,text/plain,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setShowPaste(false);
                    setPasted("");
                  }
                }}
              />
            </div>

            <button
              onClick={() => {
                setShowPaste((v) => !v);
                setFile(null);
              }}
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              {showPaste ? "…or upload a file instead" : "…or paste your resume text instead"}
            </button>
            {showPaste && (
              <textarea
                rows={7}
                className="field-input mt-2 resize-none text-sm"
                placeholder="Paste your resume text here…"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
            )}

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-dark">
                Target role <span className="font-normal text-muted">(optional — sharpens the score)</span>
              </label>
              <input
                className="field-input"
                placeholder="e.g. Senior Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading || (!file && !pasted.trim())}
              className="btn-primary mt-5 w-full"
            >
              {loading ? "Scoring your resume…" : "Get my ATS score"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* ---------------- Result ---------------- */}
        {result && (
          <div className="mt-10 space-y-6">
            {/* score + ratings */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <ScoreRing score={result.atsScore} />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-dark">Your resume scored {result.atsScore}/100</h2>
                  <p className="mt-1 text-sm text-muted">{result.summaryLine}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {result.ratings.map((r) => (
                  <div key={r.category} className="rounded-xl bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-dark">{r.category}</span>
                      <span className="text-xs font-bold" style={{ color: scoreColor(r.score) }}>
                        {r.score}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.score}%`, background: scoreColor(r.score) }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] leading-snug text-muted">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* strengths + improvements */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                <h3 className="text-sm font-semibold text-dark">What's working</h3>
                <ul className="mt-3 space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                <h3 className="text-sm font-semibold text-dark">Fix these</h3>
                <ul className="mt-3 space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber/10 text-[10px] font-bold text-amber">
                        !
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* rebuild */}
            <div className="rounded-2xl border border-primary/30 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-2">
                <SparkIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-dark">Rebuild it, better</h3>
              </div>
              <p className="mt-1 text-sm text-muted">
                We pulled your details from the file. Pick a template and theshaqsco rewrites it
                into a polished, ATS-optimized resume.
              </p>

              <div className="mt-4">
                <span className="mb-2 block text-xs font-medium text-muted">Accent color</span>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_COLORS.slice(0, 12).map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAccent(c.value)}
                      title={c.name}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        accent === c.value ? "ring-2 ring-offset-2" : "hover:scale-110"
                      }`}
                      style={{ background: c.value, "--tw-ring-color": c.value }}
                    >
                      {accent === c.value && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {TEMPLATE_LIST.map((t) => {
                  const active = template === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => setTemplate(t.name)}
                      className={`overflow-hidden rounded-lg border-2 text-left transition ${
                        active ? "border-primary shadow-soft" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="bg-surface p-1.5">
                        <div className="overflow-hidden rounded border border-border">
                          <TemplateThumb name={t.name} accent={t.accent ? accent : "#0f172a"} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className={`text-[11px] font-semibold ${active ? "text-primary" : "text-dark"}`}>
                          {t.name}
                        </span>
                        {active && <CheckIcon className="h-3 w-3 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={rebuild} className="btn-primary">
                  Create improved resume <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setPasted("");
                  }}
                  className="btn-ghost"
                >
                  Analyze another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
