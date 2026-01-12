import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0b0f1a",
        panel: "#111827",
        accent: "#6366f1"
      }
    }
  },
  plugins: []
};

export default config;
