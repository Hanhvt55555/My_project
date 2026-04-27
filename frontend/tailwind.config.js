/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'green-deep': '#1A3D2B',
        'green-mid': '#2C6B4A',
        'parchment': '#F5F0E8',
        'parchment-dark': '#EAE3D2',
        'amber': '#E8844A',
        'amber-light': '#F5A96B',
        'ink': '#1C1C1C',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
