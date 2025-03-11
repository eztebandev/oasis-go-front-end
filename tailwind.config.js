/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E51B23", // Color rojo personalizado
        primaryLight: "#F87175", // Rojo más claro para fondos o hover
        primaryDark: "#B5161C", // Rojo más oscuro para contrastes
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        'bounce-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(25%)' },
        }
      },
      animation: {
        'bounce-x': 'bounce-x 1s infinite',
      }
    },
  },
  plugins: [],
}

