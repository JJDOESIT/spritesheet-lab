/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cerulean': '#1c7293', 
        'thistle': '#e5d0e3', 
        'black': '#050200', 
        'grey': '#090909',
        'nyanza': '#d5ecd4'
      },
    },
  },
  plugins: [],
};
