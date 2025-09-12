module.exports = {
  darkMode: "media", // now it follows system dark/light
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
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
}
,
  },
  plugins: [],
};