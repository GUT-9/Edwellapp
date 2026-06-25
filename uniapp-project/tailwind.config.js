/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.{html,js,ts,jsx,tsx,vue}",
    "./components/**/*.{html,js,ts,jsx,tsx,vue}",
    "./App.vue"
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
