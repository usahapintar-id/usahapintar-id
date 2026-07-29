import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F1F4EC",
        paperDark: "#E6EBDD",
        ink: "#1E2A1F",
        forest: {
          DEFAULT: "#2F5233",
          light: "#3D6B43",
          dark: "#213B25",
        },
        ledger: "#C8443A",
        brass: "#B8860B",
        muted: "#5B6358",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 35px, rgba(200,68,58,0.18) 35px, rgba(200,68,58,0.18) 36px)",
      },
    },
  },
  plugins: [],
};
export default config;
