import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004B93", // Pepsi Blue
          light: "#1a5da9",
          dark: "#003366",
        },
      },
      fontFamily: {
        poetsen: ["var(--font-poetsen)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;
