import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8F5",
        paperDark: "#ECEFE6",
        surface: "#FFFFFF",
        ink: "#1A261B",
        forest: {
          DEFAULT: "#234B2E",
          light: "#2F623D",
          dark: "#183520",
          soft: "#EBF3EC",
        },
        ledger: "#C8443A",
        brass: {
          DEFAULT: "#B8860B",
          soft: "#FDF8EB",
        },
        muted: "#586357",
      },
      fontFamily: {
        display: ['"Fraunces"', "Playfair Display", "Georgia", "serif"],
        body: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        stamp: "0 1px 3px rgba(26,38,27,0.05), 0 6px 18px -8px rgba(26,38,27,0.08)",
        "stamp-md": "0 2px 6px rgba(26,38,27,0.05), 0 12px 28px -12px rgba(26,38,27,0.12)",
        "stamp-lg": "0 4px 10px rgba(26,38,27,0.06), 0 20px 40px -15px rgba(26,38,27,0.14)",
        "stamp-brass": "0 6px 20px -6px rgba(184,134,11,0.22)",
        "stamp-forest": "0 10px 26px -8px rgba(35,75,46,0.28)",
        soft: "0 10px 30px -10px rgba(26,38,27,0.07)",
        card: "0 1px 2px rgba(26,38,27,0.04), 0 8px 24px -10px rgba(26,38,27,0.08)",
        "card-hover": "0 4px 12px rgba(26,38,27,0.06), 0 16px 32px -12px rgba(35,75,46,0.14)",
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
