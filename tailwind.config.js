/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF4FF",
          100: "#DCE6FE",
          400: "#5B87F5",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        dark: "#0F172A",
        surface: "#F8FAFC",
        card: "#FFFFFF",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "18px",
        xl3: "20px",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        floating: "0 12px 40px -8px rgba(37, 99, 235, 0.25)",
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.1)",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
        "grad-mesh": "radial-gradient(at 0% 0%, rgba(37,99,235,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(34,197,94,0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245,158,11,0.08) 0px, transparent 50%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "scan": "scan 2.2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4,0,0.6,1) infinite",
        blob: "blob 12s ease-in-out infinite",
        "blob-slow": "blob 16s ease-in-out infinite",
        "blob-slower": "blob 20s ease-in-out infinite",
        "float-up": "float-up linear infinite",
        "frame-pulse": "frame-pulse 2.4s ease-in-out infinite",
        laser: "laser 2.2s ease-in-out infinite alternate",
        "corner-glow": "corner-glow 1.8s ease-in-out infinite",
        ripple: "ripple 1s ease-out",
        "confetti-fall": "confetti-fall 1.6s ease-in forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "avatar-glow": "avatar-glow 2.4s ease-in-out infinite",
        "pill-pop": "pill-pop 0.3s ease-out",
        "progress-bar": "progress-bar 1.2s ease-in-out infinite",
        "float-icon": "float-icon 2.5s ease-in-out infinite",
        "spin-slow": "spin 1.4s linear infinite",
        "dot-1": "dot-1 1.4s ease-in-out infinite",
        "dot-2": "dot-2 1.4s ease-in-out infinite",
        "dot-3": "dot-3 1.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        scan: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "80%, 100%": { transform: "scale(1.4)", opacity: "0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-110vh)", opacity: "0" },
        },
        "frame-pulse": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.15)" },
        },
        laser: { "0%": { top: "0%" }, "100%": { top: "100%" } },
        "corner-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0.3)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-20px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(320px) rotate(360deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "avatar-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "pill-pop": {
          "0%": { transform: "scale(0.85)" },
          "100%": { transform: "scale(1)" },
        },
        "progress-bar": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        "float-icon": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "dot-1": {
          "0%, 100%": { opacity: "0.2" },
          "33%": { opacity: "1" },
        },
        "dot-2": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        "dot-3": {
          "0%, 100%": { opacity: "0.2" },
          "66%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
