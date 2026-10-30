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
      colors: {
        ink: "#090a0c",
        surface: {
          DEFAULT: "#14171c",
          raised: "#1b1f27",
        },
        track: "#2a2f3a",
        line: {
          DEFAULT: "rgba(255,255,255,.06)",
          strong: "rgba(255,255,255,.08)",
        },
        purple: {
          DEFAULT: "#5D3FD3",
          light: "#8b74ff",
          pale: "#b5a6ff",
        },
        coral: "#ff8f6b",
      },
      fontFamily: {
        sans: ["Gabarito", ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
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
