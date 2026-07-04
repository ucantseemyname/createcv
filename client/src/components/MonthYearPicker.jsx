// Month + Year dropdowns that emit a "Mon YYYY" string (or "Present").
// Set yearOnly to render just the year select (used for graduation year).
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => NOW + 3 - i);

function parse(value) {
  if (!value || value === "Present") return { month: "", year: "" };
  const [month = "", year = ""] = String(value).split(/\s+/);
  return { month, year };
}

export default function MonthYearPicker({
  value,
  onChange,
  allowPresent = false,
  yearOnly = false,
}) {
  const isPresent = value === "Present";
  const { month, year } = parse(value);

  const emit = (nextMonth, nextYear) => {
    if (yearOnly) return onChange(nextYear || "");
    onChange([nextMonth, nextYear].filter(Boolean).join(" "));
  };

  if (yearOnly) {
    return (
      <select
        className="field-input"
        value={year}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          className="field-input"
          disabled={isPresent}
          value={month}
          onChange={(e) => emit(e.target.value, year)}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="field-input"
          disabled={isPresent}
          value={year}
          onChange={(e) => emit(month, e.target.value)}
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {allowPresent && (
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted">
          <input
            type="checkbox"
            className="h-3.5 w-3.5 accent-primary"
            checked={isPresent}
            onChange={(e) => onChange(e.target.checked ? "Present" : "")}
          />
          I currently work here
        </label>
      )}
    </div>
  );
}
