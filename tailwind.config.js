/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,svelte}"],
  theme: {
    extend: {
      screens: {
        "max-2xl": { max: "1535px" },

        "max-xl": { max: "1279px" },

        "max-lg": { max: "1024px" },

        "max-md": { max: "767px" },

        "max-sm": { max: "639px" },
      },
      FontFamily: {
        sans: ["DMSans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
