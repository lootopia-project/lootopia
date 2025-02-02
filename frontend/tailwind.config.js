/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"], // Mets à jour les chemins pour inclure tous tes fichiers de composants
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
