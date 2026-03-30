/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agtic: {
          offwhite: 'rgb(var(--agtic-offwhite) / <alpha-value>)',
          cream: 'rgb(var(--agtic-cream) / <alpha-value>)',
          parchment: 'rgb(var(--agtic-parchment) / <alpha-value>)',
          stone: 'rgb(var(--agtic-stone) / <alpha-value>)',
          warm: 'rgb(var(--agtic-warm) / <alpha-value>)',
          taupe: 'rgb(var(--agtic-taupe) / <alpha-value>)',
          charcoal: 'rgb(var(--agtic-charcoal) / <alpha-value>)',
          black: 'rgb(var(--agtic-black) / <alpha-value>)',
          gold: 'rgb(var(--agtic-gold) / <alpha-value>)',
          darkgold: 'rgb(var(--agtic-darkgold) / <alpha-value>)',
          'red-light': 'rgb(var(--agtic-red-light) / <alpha-value>)',
          red: 'rgb(var(--agtic-red) / <alpha-value>)',
        }
      },
      fontFamily: {
        google: ['"Google Sans"', '"Noto Sans Thai"', 'sans-serif'],
        display: ['"Poiret One"', '"Noto Sans Thai"', 'serif'],
        script: ['"MonteCarlo"', 'cursive'],
        body: ['"Noto Sans Thai"', 'Inter', 'sans-serif'],
        sans: ['"Noto Sans Thai"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
