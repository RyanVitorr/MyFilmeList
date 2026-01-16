/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": "#E9505A",
        "primary-red-dark": "#B32233",
        "accent-blue-light": "rgb(234 243 251)",
        "accent-blue": "#C9E6FF",
        "accent-blue-opacity":" rgb(201 230 255 / 82%)",
        "dark-purple": "#331B35",
        "light-purple": "#3d1e49",
        "opacity-purple": "rgb(61 30 73 / 64%)",
        "dark": "rgb(8 4 8)"
      }},
  },
  plugins: [],
}