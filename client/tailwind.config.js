/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,html}",
      "./src/components/**/*.{jsx,js}",
      "./src/pages/**/*.{jsx,js}"
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Outfit', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        },
        colors: {
          primary: '#10b981',
          secondary: '#3b82f6',
          hospital: {
            primary: '#10b981', // Modern Teal/Aqua
            secondary: '#3b82f6', // Professional Blue
            accent: '#064e3b',
            dark: '#0f172a',
            background: '#ffffff',
            mint: '#ecfdf5',
          }
        },
        boxShadow: {
            '3xl': '0 30px 60px -15px rgba(0, 80, 80, 0.08)',
            '4xl': '0 40px 100px -20px rgba(0, 0, 0, 0.15)',
        },
        animation: {
          'float': 'float 8s ease-in-out infinite alternate',
          'pulse-slow': 'pulse 3s infinite',
        },
        keyframes: {
          float: {
            '0%': { transform: 'translateY(0) scale(1)' },
            '100%': { transform: 'translateY(-20px) scale(1.05)' },
          }
        }
      },
    },
    plugins: [],
}
