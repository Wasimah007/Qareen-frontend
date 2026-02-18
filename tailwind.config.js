/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Qareen brand palette
        emerald: {
          950: '#022c1e',
          900: '#064e35',
          800: '#0a7a52',
          700: '#0d9e6a',
          600: '#2db876',
          500: '#3ec97a',
          400: '#6dd99a',
          300: '#9ee8ba',
        },
        gold: {
          950: '#3a2506',
          900: '#6b440b',
          800: '#8b5a0e',
          700: '#b07214',
          600: '#c9871a',
          500: '#d4a853',
          400: '#e0bf7a',
          300: '#edd49f',
          200: '#f5e7c7',
        },
        qareen: {
          bg: '#0a1f14',
          surface: '#0f2d1c',
          card: '#142d1e',
          border: '#1e4a2e',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        arabic: ['var(--font-noto-arabic)', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s infinite',
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
