import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58CC02',
          50: '#E8F9D8',
          100: '#D7F4C1',
          200: '#B6EA92',
          300: '#95E063',
          400: '#74D634',
          500: '#58CC02',
          600: '#48A602',
          700: '#377F01',
          800: '#275901',
          900: '#163300',
          950: '#0D2000'
        },
        secondary: {
          DEFAULT: '#FF9600',
          50: '#FFE8CC',
          100: '#FFE0B8',
          200: '#FFD091',
          300: '#FFC069',
          400: '#FFB042',
          500: '#FF9600',
          600: '#D17C00',
          700: '#A36200',
          800: '#754700',
          900: '#472D00',
          950: '#331F00'
        },
        accent: {
          DEFAULT: '#CE82FF',
          50: '#F4E8FF',
          100: '#ECD7FF',
          200: '#DCB5FF',
          300: '#CC94FF',
          400: '#DD88FF',
          500: '#CE82FF',
          600: '#B961FF',
          700: '#A440FF',
          800: '#8F1FFF',
          900: '#7300E6',
          950: '#5A00B3'
        },
        danger: '#FF4B4B',
        success: '#00CD9C',
        duolingo: {
          green: '#58CC02',
          orange: '#FF9600',
          purple: '#CE82FF',
          blue: '#00B8FF',
          red: '#FF4B4B',
          teal: '#00CD9C',
          background: '#F7F7FF',
          card: '#FFFFFF',
          text: '#4B4B4B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'duolingo': '0 4px 12px rgba(88, 204, 2, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-soft': 'bounce 0.6s ease-in-out',
        'pulse-slow': 'pulse 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'confetti': 'confetti 0.8s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(88, 204, 2, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(88, 204, 2, 0.8)' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
export default config 