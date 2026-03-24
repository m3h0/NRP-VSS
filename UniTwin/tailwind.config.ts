import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      "primary": "#4f46e5", // Indigo 600 - More vibrant/premium
      "primary-dark": "#4338ca", // Indigo 700
      "background-light": "#f8fafc", // Slate 50
      "background-dark": "#0f172a", // Slate 900
      "surface-light": "#ffffff",
      "surface-dark": "#1e293b", // Slate 800
      "border-light": "#e2e8f0", // Slate 200
      "border-dark": "#334155", // Slate 700
      "text-primary": "#0f172a", // Slate 900
      "text-secondary": "#475569", // Slate 600 - Darker than 500 for readability
      "text-tertiary": "#94a3b8", // Slate 400
      fontFamily: {
        "display": ["var(--font-lexend)", "sans-serif"],
        "body": ["var(--font-noto-sans)", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
