/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
  "./src/**/*.module.css",
];
export const theme = {
  extend: {
    colors:{
      darkgoldenrod:"#b8860b",
      goldenrodhover:"#a47c00",
    }
  },
};
export const plugins = [];
