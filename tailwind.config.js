/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#06080b',
        card: '#0c0f14',
        border: '#1a2235',
        accent: '#b8f53a',
        warning: '#ff7b2c',
        danger: '#ff3b3b',
        success: '#2dd4bf',
        info: '#38b6ff',
        purple: '#a78bfa',
        text: '#f0f4f8',
        muted: '#6b7a99',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-orange': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'check-bounce': 'checkBounce 0.3s ease-out',
        'ring-fill': 'ringFill 1s ease-out',
      },
      keyframes: {
        checkBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
