/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors:{ 
        'primary': '#FFFFFF', 
        'secondary': '#C01532', 
        'dirty-white': '#F8F9FA',
        'details-red': '#F7634D',
        'details-blue': '#399BE2',
        'details-light-blue':'#a6d5fa',
        'unitn-grey': '#565656',
        'dark-grey': '#1D2125',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      addUtilities({
        '.text-glow': {
          textShadow: '0 0 20px rgba(255, 255, 255, 0.7)',
        },
      });
    }
  ],
}

