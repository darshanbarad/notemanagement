/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Dark Mode enable kiya
  theme: {
    extend: {
      colors: {
        primary: "#1E293B", // Custom color add kiya
      },
    },
  },
  plugins: [],
};
