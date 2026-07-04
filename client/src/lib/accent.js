// Accent color helpers. We precompute concrete rgba tints (rather than using
// Tailwind opacity or CSS color-mix) so they survive html2canvas / PDF export.

export const ACCENT_COLORS = [
  { name: "Blue", value: "#2563EB" },
  { name: "Sky", value: "#0284C7" },
  { name: "Teal", value: "#0D9488" },
  { name: "Emerald", value: "#059669" },
  { name: "Green", value: "#16A34A" },
  { name: "Lime", value: "#65A30D" },
  { name: "Amber", value: "#D97706" },
  { name: "Orange", value: "#EA580C" },
  { name: "Red", value: "#DC2626" },
  { name: "Rose", value: "#E11D48" },
  { name: "Pink", value: "#DB2777" },
  { name: "Fuchsia", value: "#C026D3" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Navy", value: "#1E3A8A" },
  { name: "Slate", value: "#334155" },
  { name: "Charcoal", value: "#111827" },
  { name: "Bronze", value: "#92400E" },
];

export const DEFAULT_ACCENT = "#2563EB";

function hexToRgb(hex) {
  let h = String(hex || DEFAULT_ACCENT).replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// CSS custom properties applied to the resume sheet wrapper. Templates read
// these via Tailwind arbitrary values, e.g. bg-[var(--accent)].
// `opacity` (0.4–1) fades the accent for a softer or bolder look.
export function accentVars(hex, opacity = 1) {
  const base = hex || DEFAULT_ACCENT;
  const o = Math.min(1, Math.max(0.2, opacity));
  return {
    "--accent": rgba(base, o),
    "--accent-soft": rgba(base, 0.1 * o),
    "--accent-softer": rgba(base, 0.06 * o),
    "--accent-border": rgba(base, 0.28 * o),
    "--accent-strong": rgba(base, 0.7 * o),
  };
}
