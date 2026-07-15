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
      },
    },
  },
  plugins: [],
};
