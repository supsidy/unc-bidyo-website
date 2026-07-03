/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bidyo: {
          crimson: "#8c0d22",
          crimsonDeep: "#5c0a18",
          crimsonBlack: "#1a0306",
          charcoal: "#161414",
          charcoalLight: "#231f1f",
        },
      },
      fontFamily: {
        display: ["'Archivo Black'", "Helvetica", "Arial", "sans-serif"],
        sans: ["'Inter'", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
