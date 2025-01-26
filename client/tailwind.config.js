/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        instagram: ['Great Vibes', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        'oleo-script': ['Oleo Script', 'serif'],
      },
      colors: {},
    }
  },
  plugins: [require("tailwindcss-animate")],
}