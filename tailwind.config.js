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
    },
  },
  plugins: [],
}

