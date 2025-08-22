module.exports = {
  darkMode: 'class', // follow system preference
  content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./src/pages/**/*.{js,jsx,ts,tsx}", // optional redundancy
  "./src/pages/**/*.{js,jsx,ts,tsx}", // optional redundancy
  "./src/pages/DashbordPages/*.{js,jsx,ts,tsx}", // optional redundancy
  "./src/pages/userpages/*.{js,jsx,ts,tsx}", // optional redundancy
  "./public/index.html",
],

  theme: {
    extend: {},
  },
  plugins: [],
};
