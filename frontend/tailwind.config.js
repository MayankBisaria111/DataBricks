/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8fafc",
        ink: "#0f172a",
        brand: "#4f46e5",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.06)",
      },
    },
  },
  plugins: [],
};
