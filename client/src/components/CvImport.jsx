import { useRef, useState } from "react";

// "Fill the form fast" bar. Two ways in:
//  1) Upload a resume file (PDF/TXT) — text is extracted client-side.
//  2) Paste all your details as free text.
// Either way the text goes to /api/analyze-cv, which parses it into form data,
// handed back via onImport().
export default function CvImport({ onImport }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasted, setPasted] = useState("");

  // Shared: send any text to the extractor and fill the form.
  const fillFrom = async (text, label) => {
    setError("");
    setDone(false);
    if (!text || text.trim().length < 25) {
      setError(`Add a bit more detail${label ? "" : ""} so we can fill the form.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const raw = (await res.text()).trim();
      let data = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error("The server returned an unexpected response.");
        }
      } else {
        throw new Error("Couldn't reach the server — start the backend (npm run server).");
      }
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't read that.");
      onImport(data.extracted);
      setDone(true);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setDone(false);
    setLoading(true);
    try {
      const { extractCvText } = await import("../lib/parseCv.js");
      const text = await extractCvText(file);
      if (!text || text.length < 25) {
        throw new Error("Couldn't read enough text — try a text-based PDF or a .txt file.");
      }
      setLoading(false);
      await fillFrom(text);
    } catch (e) {
      setError(e.message || "Import failed.");
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-dark">Fill this in for me</p>
            <p className="text-xs text-muted">
              Upload your resume, or paste all your details in one go — we'll sort them
              into the right fields.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="btn-ghost !py-2 text-sm"
          >
            {loading ? "Reading…" : "Upload resume"}
          </button>
          <button
            type="button"
            onClick={() => setShowPaste((v) => !v)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              showPaste ? "bg-primary text-white" : "text-primary hover:bg-primary/10"
            }`}
          >
            Paste details
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {showPaste && (
        <div className="mt-4">
          <textarea
            rows={6}
            className="field-input resize-none text-sm"
            placeholder={
              "Paste everything here — name, email, phone, location, your jobs (company, title, dates, what you did), education, and skills. Plain text is fine, e.g.:\n\nJordan Avery — Product Designer\njordan@email.com · +1 555 0100 · Austin, USA\nAcme Inc, Senior Designer, 2021–present: led redesign, grew activation 32%\nBSc HCI, UT Austin, 2018\nSkills: Figma, Research, Prototyping"
            }
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fillFrom(pasted)}
              disabled={loading || pasted.trim().length < 25}
              className="btn-primary !py-2 text-sm"
            >
              {loading ? "Sorting your details…" : "Fill in the form"}
            </button>
            <span className="text-xs text-muted">We only fill fields — you can edit after.</span>
          </div>
        </div>
      )}

      {done && (
        <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
          ✓ Done — we filled in what we found. Review the fields below and fix anything.
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
