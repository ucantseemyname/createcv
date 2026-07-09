import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useResume } from "../context/ResumeContext.jsx";
import { TEMPLATE_LIST, FONT_OPTIONS } from "../components/templates/index.jsx";
import TemplateThumb from "../components/templates/TemplateThumbs.jsx";
import PhotoUpload from "../components/PhotoUpload.jsx";
import CvImport from "../components/CvImport.jsx";
import MonthYearPicker from "../components/MonthYearPicker.jsx";
import { ACCENT_COLORS } from "../lib/accent.js";
import { ArrowRight, CheckIcon } from "../components/Icons.jsx";

const STEPS = [
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills & Extras",
  "Job Target",
];

const STEP_SUB = [
  "Tell us who you are and the role you're targeting.",
  "Add your roles — most recent first.",
  "Where and what you studied.",
  "Skills, languages, and anything extra.",
  "Fine-tune the output and pick a look.",
];

// Small line icons for the vertical stepper.
const STEP_ICONS = [
  "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.7-8 6v1h16v-1c0-3.3-3.6-6-8-6Z", // user
  "M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M3 7h18v13H3zM3 12h18", // briefcase
  "M12 3 2 8l10 5 10-5-10-5ZM6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5", // cap
  "M4 6h16M4 12h10M4 18h7", // list
  "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8", // spark
];

function Field({ label, optional, required, error, children }) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>
      )}
    </label>
  );
}

export default function Build() {
  const navigate = useNavigate();
  const {
    form,
    setForm,
    updateSection,
    setExperience,
    setEducation,
    setResume,
  } = useResume();

  // Merge extracted resume data (from an uploaded CV) into the form.
  const importCv = (ex) => {
    if (!ex) return;
    setForm((prev) => ({
      personal: { ...prev.personal, ...ex.personal, photo: prev.personal.photo },
      experience:
        ex.experience && ex.experience.length ? ex.experience : prev.experience,
      education: ex.education && ex.education.length ? ex.education : prev.education,
      extras: { ...prev.extras, ...ex.extras },
      target: {
        ...prev.target,
        role: prev.target.role || ex.personal?.jobTitle || "",
      },
    }));
    setFieldErrors({});
  };

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const clearErr = (k) =>
    setFieldErrors((p) => {
      if (!p[k]) return p;
      const n = { ...p };
      delete n[k];
      return n;
    });
  // Red styling appended to an input's className when that field has an error.
  const invalid = (k) =>
    fieldErrors[k] ? " !border-red-400 focus:!ring-red-100" : "";

  // Required-field rules per step. Returns { field: message }.
  const validateStep = (s) => {
    const e = {};
    const p = form.personal;
    const t = form.target;
    const j = form.experience[0] || {};
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    if (s === 0) {
      if (!p.fullName.trim()) e.fullName = "Full name is required.";
      if (!p.jobTitle.trim()) e.jobTitle = "Target job title is required.";
      if (!p.email.trim()) e.email = "Email is required.";
      else if (!emailOk(p.email)) e.email = "Enter a valid email address.";
      if (!p.location.trim()) e.location = "Location is required.";
    } else if (s === 1) {
      if (!j.company?.trim()) e.company = "Company name is required.";
      if (!j.title?.trim()) e.title = "Job title is required.";
      if (!j.responsibilities?.trim())
        e.responsibilities = "Describe what you did — this is what we turn into your resume.";
    } else if (s === 2) {
      if (!edu0.degree.trim()) e.degree = "Degree is required.";
      if (!edu0.institution.trim()) e.institution = "Institution is required.";
    } else if (s === 3) {
      if (!String(form.extras.skills || "").trim()) e.skills = "Add at least a few skills.";
    } else if (s === 4) {
      if (!t.role.trim()) e.role = "Target role is required.";
      if (!t.industry.trim()) e.industry = "Industry is required.";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    setFieldErrors(e);
    if (Object.keys(e).length) {
      setError("Please fill in the required fields highlighted below.");
      return;
    }
    setError("");
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const back = () => {
    setError("");
    setFieldErrors({});
    if (step > 0) setStep(step - 1);
  };
  // Sidebar navigation — jump back to any completed step freely.
  const goTo = (i) => {
    if (i < step) {
      setError("");
      setFieldErrors({});
      setStep(i);
    }
  };

  // --- Experience helpers ---
  const updateJob = (index, key, value) => {
    const updated = form.experience.map((job, i) =>
      i === index ? { ...job, [key]: value } : job
    );
    setExperience(updated);
  };
  const addJob = () => {
    if (form.experience.length >= 3) return;
    setExperience([
      ...form.experience,
      { company: "", title: "", startDate: "", endDate: "", responsibilities: "" },
    ]);
  };
  const removeJob = (index) => {
    setExperience(form.experience.filter((_, i) => i !== index));
  };

  // --- Education helpers ---
  // Guard against a missing/empty education array (e.g. shared or seeded state).
  const edu0 = form.education[0] || { degree: "", institution: "", year: "", field: "" };
  const updateEdu = (index, key, value) => {
    const base = form.education.length
      ? form.education
      : [{ degree: "", institution: "", year: "", field: "" }];
    const updated = base.map((edu, i) =>
      i === index ? { ...edu, [key]: value } : edu
    );
    setEducation(updated);
  };

  const generate = async () => {
    const e = validateStep(4);
    setFieldErrors(e);
    if (Object.keys(e).length) {
      setError("Please fill in the required fields highlighted below.");
      return;
    }
    // Stash the form and head to the output page, which runs the generation.
    navigate("/resume", { state: { generate: true } });
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface lg:flex">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 flex-col border-r border-border bg-white px-6 py-7 lg:flex">
        <Logo />
        <div className="mt-9 flex-1">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
            <span>Your resume</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-1">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${
                    active
                      ? "bg-primary/[0.06]"
                      : i < step
                      ? "hover:bg-surface"
                      : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                      done
                        ? "border-primary bg-primary text-white"
                        : active
                        ? "border-primary bg-white text-primary"
                        : "border-border bg-white text-muted"
                    }`}
                  >
                    {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-semibold ${
                        active || done ? "text-dark" : "text-muted"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="block text-[11px] text-muted">
                      {done ? "Completed" : active ? "In progress" : "Up next"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-left text-sm font-medium text-muted transition hover:text-dark"
        >
          ← Back to home
        </button>
      </aside>

      {/* ===== Main ===== */}
      <main className="min-w-0 flex-1">
        {/* mobile top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-white lg:hidden">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Logo />
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-muted hover:text-dark"
            >
              Cancel
            </button>
          </div>
          <div className="h-1 w-full bg-border">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div
          className={`mx-auto my-8 rounded-2xl border border-border bg-white p-6 shadow-soft sm:p-9 lg:my-14 ${
            step === 4 ? "max-w-4xl" : "max-w-2xl"
          }`}
        >
          <div className="mb-7 flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={STEP_ICONS[step]} />
              </svg>
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step {step + 1} of {STEPS.length}
              </span>
              <h1 className="display mt-0.5 text-2xl text-dark sm:text-[1.7rem]">
                {STEPS[step]}
              </h1>
              <p className="mt-1 text-sm text-muted">{STEP_SUB[step]}</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* STEP 1 — Personal */}
          {step === 0 && (
            <div>
              <CvImport onImport={importCv} />
              <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" required error={fieldErrors.fullName}>
                <input
                  className={"field-input" + invalid("fullName")}
                  placeholder="Jordan Avery"
                  value={form.personal.fullName}
                  onChange={(e) => {
                    updateSection("personal", { fullName: e.target.value });
                    clearErr("fullName");
                  }}
                />
              </Field>
              <Field label="Job Title (role you're targeting)" required error={fieldErrors.jobTitle}>
                <input
                  className={"field-input" + invalid("jobTitle")}
                  placeholder="Senior Product Designer"
                  value={form.personal.jobTitle}
                  onChange={(e) => {
                    updateSection("personal", { jobTitle: e.target.value });
                    clearErr("jobTitle");
                  }}
                />
              </Field>
              <Field label="Email" required error={fieldErrors.email}>
                <input
                  type="email"
                  className={"field-input" + invalid("email")}
                  placeholder="jordan@email.com"
                  value={form.personal.email}
                  onChange={(e) => {
                    updateSection("personal", { email: e.target.value });
                    clearErr("email");
                  }}
                />
              </Field>
              <Field label="Phone" optional>
                <input
                  className="field-input"
                  placeholder="+1 555 123 4567"
                  value={form.personal.phone}
                  onChange={(e) => updateSection("personal", { phone: e.target.value })}
                />
              </Field>
              <Field label="Location (City, Country)" required error={fieldErrors.location}>
                <input
                  className={"field-input" + invalid("location")}
                  placeholder="Austin, USA"
                  value={form.personal.location}
                  onChange={(e) => {
                    updateSection("personal", { location: e.target.value });
                    clearErr("location");
                  }}
                />
              </Field>
              <Field label="LinkedIn URL" optional>
                <input
                  className="field-input"
                  placeholder="linkedin.com/in/jordan"
                  value={form.personal.linkedin}
                  onChange={(e) => updateSection("personal", { linkedin: e.target.value })}
                />
              </Field>
              <Field label="Portfolio / Website" optional>
                <input
                  className="field-input"
                  placeholder="jordanavery.com"
                  value={form.personal.website}
                  onChange={(e) => updateSection("personal", { website: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2 border-t border-border pt-5">
                <PhotoUpload
                  value={form.personal.photo}
                  onChange={(photo) => updateSection("personal", { photo })}
                />
                <p className="mt-2 text-xs text-muted">
                  Shown on photo-friendly templates (Modern, Bold, Creative, Executive).
                </p>
              </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Experience */}
          {step === 1 && (
            <div className="space-y-6">
              {form.experience.map((job, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-dark">Job {i + 1}</h3>
                    {form.experience.length > 1 && (
                      <button
                        onClick={() => removeJob(i)}
                        className="text-xs font-medium text-muted hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Company Name"
                      required={i === 0}
                      error={i === 0 ? fieldErrors.company : undefined}
                    >
                      <input
                        className={"field-input" + (i === 0 ? invalid("company") : "")}
                        placeholder="Acme Inc."
                        value={job.company}
                        onChange={(e) => {
                          updateJob(i, "company", e.target.value);
                          if (i === 0) clearErr("company");
                        }}
                      />
                    </Field>
                    <Field
                      label="Job Title"
                      required={i === 0}
                      error={i === 0 ? fieldErrors.title : undefined}
                    >
                      <input
                        className={"field-input" + (i === 0 ? invalid("title") : "")}
                        placeholder="Product Designer"
                        value={job.title}
                        onChange={(e) => {
                          updateJob(i, "title", e.target.value);
                          if (i === 0) clearErr("title");
                        }}
                      />
                    </Field>
                    <Field label="Start Date">
                      <MonthYearPicker
                        value={job.startDate}
                        onChange={(v) => updateJob(i, "startDate", v)}
                      />
                    </Field>
                    <Field label="End Date">
                      <MonthYearPicker
                        value={job.endDate}
                        onChange={(v) => updateJob(i, "endDate", v)}
                        allowPresent
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <Field
                      label="Key responsibilities"
                      required={i === 0}
                      error={i === 0 ? fieldErrors.responsibilities : undefined}
                    >
                      <textarea
                        rows={3}
                        className={
                          "field-input resize-none" +
                          (i === 0 ? invalid("responsibilities") : "")
                        }
                        placeholder="Describe what you did — theshaqsco will turn this into achievement-focused bullet points."
                        value={job.responsibilities}
                        onChange={(e) => {
                          updateJob(i, "responsibilities", e.target.value);
                          if (i === 0) clearErr("responsibilities");
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
              {form.experience.length < 3 && (
                <button
                  onClick={addJob}
                  className="w-full rounded-xl border border-dashed border-primary/40 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                >
                  + Add Another Job
                </button>
              )}
            </div>
          )}

          {/* STEP 3 — Education */}
          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Degree" required error={fieldErrors.degree}>
                <input
                  className={"field-input" + invalid("degree")}
                  placeholder="B.Sc."
                  value={edu0.degree}
                  onChange={(e) => {
                    updateEdu(0, "degree", e.target.value);
                    clearErr("degree");
                  }}
                />
              </Field>
              <Field label="Field of Study" optional>
                <input
                  className="field-input"
                  placeholder="Computer Science"
                  value={edu0.field}
                  onChange={(e) => updateEdu(0, "field", e.target.value)}
                />
              </Field>
              <Field label="Institution" required error={fieldErrors.institution}>
                <input
                  className={"field-input" + invalid("institution")}
                  placeholder="University of Texas"
                  value={edu0.institution}
                  onChange={(e) => {
                    updateEdu(0, "institution", e.target.value);
                    clearErr("institution");
                  }}
                />
              </Field>
              <Field label="Graduation Year">
                <MonthYearPicker
                  yearOnly
                  value={edu0.year}
                  onChange={(v) => updateEdu(0, "year", v)}
                />
              </Field>
            </div>
          )}

          {/* STEP 4 — Skills & Extras */}
          {step === 3 && (
            <div className="space-y-5">
              <Field label="Skills (comma separated)" required error={fieldErrors.skills}>
                <input
                  className={"field-input" + invalid("skills")}
                  placeholder="Figma, User Research, Prototyping, Design Systems"
                  value={form.extras.skills}
                  onChange={(e) => {
                    updateSection("extras", { skills: e.target.value });
                    clearErr("skills");
                  }}
                />
              </Field>
              <Field label="Languages" optional>
                <input
                  className="field-input"
                  placeholder="English (Native), Spanish (Fluent)"
                  value={form.extras.languages}
                  onChange={(e) => updateSection("extras", { languages: e.target.value })}
                />
              </Field>
              <Field label="Certifications" optional>
                <input
                  className="field-input"
                  placeholder="Google UX Certificate, Scrum Master"
                  value={form.extras.certifications}
                  onChange={(e) => updateSection("extras", { certifications: e.target.value })}
                />
              </Field>
              <Field label="Summary / Bio" optional>
                <textarea
                  rows={4}
                  className="field-input resize-none"
                  placeholder="Leave blank and theshaqsco will write a professional summary for you."
                  value={form.extras.summary}
                  onChange={(e) => updateSection("extras", { summary: e.target.value })}
                />
              </Field>
            </div>
          )}

          {/* STEP 5 — Job Target */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Job role applying for" required error={fieldErrors.role}>
                  <input
                    className={"field-input" + invalid("role")}
                    placeholder="Senior Product Designer"
                    value={form.target.role}
                    onChange={(e) => {
                      updateSection("target", { role: e.target.value });
                      clearErr("role");
                    }}
                  />
                </Field>
                <Field label="Industry" required error={fieldErrors.industry}>
                  <input
                    className={"field-input" + invalid("industry")}
                    placeholder="SaaS / Technology"
                    value={form.target.industry}
                    onChange={(e) => {
                      updateSection("target", { industry: e.target.value });
                      clearErr("industry");
                    }}
                  />
                </Field>
                <Field label="Tone">
                  <select
                    className="field-input"
                    value={form.target.tone}
                    onChange={(e) => updateSection("target", { tone: e.target.value })}
                  >
                    <option>Professional</option>
                    <option>Creative</option>
                    <option>Executive</option>
                    <option>Entry Level</option>
                  </select>
                </Field>
              </div>

              {/* Accent color + custom + opacity */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="field-label !mb-0">Accent color</span>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary">
                    <span
                      className="h-4 w-4 rounded-full border border-border"
                      style={{ background: form.target.accent }}
                    />
                    Custom
                    <input
                      type="color"
                      value={form.target.accent}
                      onChange={(e) => updateSection("target", { accent: e.target.value })}
                      className="h-0 w-0 opacity-0"
                    />
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {ACCENT_COLORS.map((c) => {
                    const active =
                      form.target.accent?.toLowerCase() === c.value.toLowerCase();
                    return (
                      <button
                        key={c.value}
                        type="button"
                        title={c.name}
                        onClick={() => updateSection("target", { accent: c.value })}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                          active ? "ring-2 ring-offset-2" : "hover:scale-110"
                        }`}
                        style={{ background: c.value, "--tw-ring-color": c.value }}
                      >
                        {active && <CheckIcon className="h-4 w-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 flex h-4 items-center justify-between">
                      <span className="text-xs font-medium text-muted">Accent intensity</span>
                      <span className="text-xs font-medium text-dark">
                        {Math.round((form.target.accentOpacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <div className="flex h-9 items-center">
                      <input
                        type="range"
                        min="0.4"
                        max="1"
                        step="0.05"
                        value={form.target.accentOpacity ?? 1}
                        onChange={(e) =>
                          updateSection("target", { accentOpacity: Number(e.target.value) })
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex h-4 items-center">
                      <span className="text-xs font-medium text-muted">Font</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {FONT_OPTIONS.map((f) => {
                        const active = (form.target.font || "Default") === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => updateSection("target", { font: f })}
                            className={`flex h-9 items-center justify-center rounded-lg border text-[11px] font-medium transition ${
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
                <p className="mt-2 text-xs text-muted">
                  Color applies to all templates except Minimal &amp; Classic (kept black
                  &amp; white).
                </p>
              </div>

              {/* Template choice — visual gallery */}
              <div>
                <span className="field-label">Template</span>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {TEMPLATE_LIST.map((tpl) => {
                    const active = form.target.template === tpl.name;
                    return (
                      <button
                        key={tpl.name}
                        type="button"
                        onClick={() => updateSection("target", { template: tpl.name })}
                        className={`group overflow-hidden rounded-xl border-2 text-left transition ${
                          active
                            ? "border-primary shadow-card"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {/* visual preview — a live mini render of the template */}
                        <div className="relative border-b border-border bg-surface p-3">
                          <div className="overflow-hidden rounded-md border border-border shadow-sm">
                            <TemplateThumb name={tpl.name} accent={form.target.accent} />
                          </div>
                          <div className="absolute left-4 top-4 flex gap-1">
                            {tpl.ats && (
                              <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                ATS
                              </span>
                            )}
                            {tpl.pro ? (
                              <span className="rounded bg-dark px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                PRO
                              </span>
                            ) : (
                              <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-success shadow-sm ring-1 ring-success/30">
                                FREE
                              </span>
                            )}
                          </div>
                        </div>
                        {/* label + why it fits */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-dark">{tpl.name}</span>
                            <div className="flex items-center gap-1.5">
                              {tpl.photo && (
                                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
                                  Photo
                                </span>
                              )}
                              {active && <CheckIcon className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted">
                            {tpl.suitable}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <button
              onClick={back}
              disabled={step === 0}
              className="btn-ghost disabled:invisible"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="btn-primary">
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={generate} className="btn-primary">
                Generate My Resume
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
