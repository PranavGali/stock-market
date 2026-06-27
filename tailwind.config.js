/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'hsl(226,100%,97%)',
          100: 'hsl(226,100%,93%)',
          200: 'hsl(226,96%,84%)',
          300: 'hsl(226,90%,71%)',
          400: 'hsl(226,82%,59%)',
          500: 'hsl(226,76%,50%)',
          600: 'hsl(226,72%,42%)',
          700: 'hsl(226,68%,34%)',
          800: 'hsl(226,62%,26%)',
          900: 'hsl(226,58%,18%)',
          950: 'hsl(226,62%,11%)',
        },
        dark: {
          50:  'hsl(222,14%,92%)',
          100: 'hsl(222,14%,80%)',
          200: 'hsl(222,14%,68%)',
          300: 'hsl(222,14%,52%)',
          400: 'hsl(222,16%,36%)',
          500: 'hsl(222,18%,24%)',
          600: 'hsl(222,20%,18%)',
          700: 'hsl(222,22%,14%)',
          800: 'hsl(222,24%,10%)',
          900: 'hsl(222,26%,7%)',
          950: 'hsl(222,28%,5%)',
        },
        success: {
          400: 'hsl(142,76%,55%)',
          500: 'hsl(142,72%,45%)',
          600: 'hsl(142,68%,36%)',
        },
        danger: {
          400: 'hsl(0,84%,64%)',
          500: 'hsl(0,80%,54%)',
          600: 'hsl(0,76%,44%)',
        },
        warning: {
          400: 'hsl(38,92%,56%)',
          500: 'hsl(38,88%,46%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, hsl(226,76%,50%) 0%, hsl(262,76%,55%) 100%)',
        'gradient-success': 'linear-gradient(135deg, hsl(142,72%,45%) 0%, hsl(170,72%,42%) 100%)',
        'gradient-danger': 'linear-gradient(135deg, hsl(0,80%,54%) 0%, hsl(25,80%,54%) 100%)',
        'gradient-dark': 'linear-gradient(135deg, hsl(222,26%,7%) 0%, hsl(222,22%,12%) 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 24px rgba(99,120,255,0.25)',
        'glow-success': '0 0 20px rgba(34,197,94,0.2)',
        'glow-danger': '0 0 20px rgba(239,68,68,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
