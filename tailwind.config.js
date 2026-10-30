/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Tokens do StatsFy Revamp (design/html). O app é só dark.
      colors: {
        ink: "#090a0c", // fundo da página
        surface: {
          DEFAULT: "#14171c", // cards, selects
          raised: "#1b1f27", // placeholders, trilhos do loading
        },
        track: "#2a2f3a", // fundo das barras de progresso
        line: {
          DEFAULT: "rgba(255,255,255,.06)", // borda de card
          strong: "rgba(255,255,255,.08)", // header, divisores
        },
        purple: {
          DEFAULT: "#5D3FD3",
          light: "#8b74ff", // eyebrows, links, deltas positivos
          pale: "#b5a6ff", // hover de link
        },
        coral: "#ff8f6b", // deltas negativos
      },
      fontFamily: {
        sans: ["Gabarito", ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      // o design usa .35/.45/.55 o tempo todo; o Tailwind 3.3 não tem
      opacity: {
        35: ".35",
        45: ".45",
        55: ".55",
      },
      borderRadius: {
        card: "18px",
        tile: "14px",
      },
      maxWidth: {
        page: "1160px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "orbit-reverse": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
        // barra indeterminada: atravessa o trilho da esquerda pra direita
        "loading-bar": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(240%)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.25 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        orbit: "orbit 60s linear infinite",
        "orbit-reverse": "orbit-reverse 44s linear infinite",
        "loading-bar": "loading-bar 1.6s linear infinite",
        blink: "blink 1.2s infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.16,1,.3,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
