/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#1E1E1E",
        background: "#F7F7F3",
        foreground: "#E6E9E4",
        hover: "#76F0B9",
        active: "#e94caf",
      },
    },
  },
  plugins: [],
};
