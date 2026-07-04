import { createContext, useContext, useEffect, useState } from "react";

const ResumeContext = createContext(null);

export const emptyForm = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    photo: "",
  },
  experience: [
    { company: "", title: "", startDate: "", endDate: "", responsibilities: "" },
  ],
  education: [{ degree: "", institution: "", year: "", field: "" }],
  extras: {
    skills: "",
    languages: "",
    certifications: "",
    summary: "",
  },
  target: {
    role: "",
    industry: "",
    tone: "Professional",
    template: "Modern",
    accent: "#2563EB",
    accentOpacity: 1,
    font: "Default",
  },
};

const STORAGE_KEY = "resumix:data";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { form: emptyForm, resume: null };
}

export function ResumeProvider({ children }) {
  const initial = loadInitial();
  const [form, setForm] = useState(initial.form || emptyForm);
  const [resume, setResume] = useState(initial.resume || null);

  // Persist so a refresh / shared link keeps the resume around.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, resume }));
    } catch {
      /* ignore quota errors */
    }
  }, [form, resume]);

  const updateSection = (section, values) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], ...values } }));
  };

  const setExperience = (experience) =>
    setForm((prev) => ({ ...prev, experience }));
  const setEducation = (education) =>
    setForm((prev) => ({ ...prev, education }));

  const resetAll = () => {
    setForm(emptyForm);
    setResume(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        form,
        setForm,
        updateSection,
        setExperience,
        setEducation,
        resume,
        setResume,
        resetAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
