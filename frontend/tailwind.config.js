/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            light: '#60A5FA',
            DEFAULT: '#2563EB',
            dark: '#1E40AF',
          },
          purple: {
            light: '#C084FC',
            DEFAULT: '#7C3AED',
            dark: '#6D28D9',
          },
          dark: {
            light: '#374151',
            DEFAULT: '#111827',
            dark: '#030712',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.15)',
      }
    },
  },
  plugins: [],
}
