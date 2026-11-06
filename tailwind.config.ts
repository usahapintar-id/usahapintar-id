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
        display: ['"Fraunces"', "Playfair Display", "Georgia", "serif"],
        body: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        stamp: "3px 3px 0 0 #1E2A1F",
        "stamp-md": "5px 5px 0 0 #1E2A1F",
        "stamp-lg": "8px 8px 0 0 #1E2A1F",
        "stamp-brass": "4px 4px 0 0 #B8860B",
        "stamp-forest": "5px 5px 0 0 #213B25",
        soft: "0 10px 30px -10px rgba(30,42,31,0.08)",
        card: "0 4px 20px -2px rgba(30,42,31,0.06), 0 2px 6px -1px rgba(30,42,31,0.04)",
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
