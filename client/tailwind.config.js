/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        primary: "#2563EB",
        primaryDark: "#1D4ED8",
        secondary: "#3B82F6",
        accent: "#22C55E",
        amber: "#22C55E",
        dark: "#0F2A4A",
        ink: "#0F2A4A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#22C55E",
        surface: "#F6F8FB",
        cream: "#F6F8FB",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        logo: ["Futura", '"Century Gothic"', '"Trebuchet MS"', "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15, 42, 74, 0.05), 0 8px 24px rgba(15, 42, 74, 0.06)",
        card: "0 2px 8px rgba(15, 42, 74, 0.05), 0 16px 40px rgba(15, 42, 74, 0.10)",
        float: "0 24px 60px rgba(37, 99, 235, 0.22)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(6deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(6%, -8%) scale(1.15)" },
          "66%": { transform: "translate(-6%, 6%) scale(0.9)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.8)" },
        },
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "60%, 100%": { transform: "translateX(220%)" },
        },
        "word-in": {
          "0%": { opacity: "0", transform: "translateY(60%) rotate(2deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "spin-slow": "spin 26s linear infinite",
        marquee: "marquee 32s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        "aurora-slow": "aurora 26s ease-in-out infinite",
        twinkle: "twinkle 2.6s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        shine: "shine 5s ease-in-out infinite",
        "word-in": "word-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "pop-in": "pop-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        bob: "bob 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
