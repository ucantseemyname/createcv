import { useRef, useState } from "react";

// Compact "import an existing resume" bar. Extracts text (PDF/TXT), asks the
// backend to parse it into form data, and hands it back via onImport().
export default function CvImport({ onImport }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handle = async (file) => {
    if (!file) return;
    setError("");
    setDone(false);
    setLoading(true);
    try {
      const { extractCvText } = await import("../lib/parseCv.js");
      const text = await extractCvText(file);
      if (!text || text.length < 40) {
        throw new Error(
          "Couldn't read enough text — try a text-based PDF or a .txt file."
        );
      }
      const res = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      if (!res.ok || data.error) throw new Error(data.error || "Import failed.");
      onImport(data.extracted);
      setDone(true);
    } catch (e) {
      setError(e.message || "Import failed.");
    } finally {
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
            <p className="text-sm font-semibold text-dark">Already have a resume?</p>
            <p className="text-xs text-muted">
              Upload it (PDF/TXT) and we'll fill in the form for you — then review &amp; edit.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="btn-ghost shrink-0 !py-2 text-sm"
        >
          {loading ? "Importing…" : "Import resume"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,text/plain,application/pdf"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>

      {done && (
        <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
          ✓ Imported — we filled in what we found. Review the fields below and fix anything.
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
