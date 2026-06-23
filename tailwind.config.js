/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(49, 130, 206, 0.24)',
        gold: '0 24px 90px rgba(234, 179, 8, 0.2)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(255, 255, 255, 0.16)' },
          '50%': { boxShadow: '0 0 62px rgba(245, 196, 83, 0.28)' },
        },
      },
    },
  },
  plugins: [],
};
