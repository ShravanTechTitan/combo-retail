module.exports = {
  darkMode: "media", 
  content: [
    "./index.html",
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    safelist: [
      'sm:flex',
      'sm:hidden',
      'md:grid-cols-3',
      'lg:grid-cols-5'
    ],
  },
  plugins: [],
};
