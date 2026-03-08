/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#E4E7EB',
          dark: '#303030'
        },
        background: {
          DEFAULT: '#F3F2F7',
          dark: '#272727'
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1C1C1E'
        },
        icon: {
          DEFAULT: '#687076',
          dark: '#9BA1A6'
        },
        tint: {
          DEFAULT: '#438E49',
          dark: '#21cb5a'
        }
      }
    }
  },
  presets: [require('nativewind/preset')],
  plugins: []
}
