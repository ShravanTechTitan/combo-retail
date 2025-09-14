module.exports = {
  darkMode: "media", // ⚡ use "class" since you toggle dark via localStorage in App.jsx
  content: [
    "./index.html",
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        borderSpin: {
          "0%": { "stroke-dashoffset": "1000" },
          "100%": { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        borderSpin: "borderSpin 1.5s linear forwards",
      },
    },
  },
  plugins: [],
};
