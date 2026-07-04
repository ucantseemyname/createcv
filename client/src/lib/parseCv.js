import * as pdfjs from "pdfjs-dist";
// `?url` lets Vite resolve + serve the worker asset reliably in dev and build.
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Extract plain text from an uploaded CV (PDF or plain text).
export async function extractCvText(file) {
  const name = (file.name || "").toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((i) => i.str).join(" ") + "\n";
    }
    return text.trim();
  }

  // .txt / .md / anything readable as text
  return (await file.text()).trim();
}
