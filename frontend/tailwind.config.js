/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B2B',
          dark: '#E55A1F',
          light: '#FF8C5A',
        },
        accent: {
          DEFAULT: '#00D4AA',
          light: '#33DFBE',
        },
        surface: {
          DEFAULT: '#0F0F1A',
          light: '#1A1A2E',
          lighter: '#242442',
          border: '#2A2A45',
          'border-light': '#363655',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0B8',
          muted: '#6B6B80',
        },
        success: '#00D4AA',
        warning: '#FFB800',
        error: '#FF4444',
        info: '#4488FF',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'bet': '8px',
      },
    },
  },
  plugins: [],
};