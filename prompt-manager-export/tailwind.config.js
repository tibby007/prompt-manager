// Tailwind CSS configuration
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // AI Marvels color scheme
        primary: {
          DEFAULT: '#0F3460', // Navy blue
          light: '#1A4980',
          dark: '#092545',
        },
        secondary: {
          DEFAULT: '#16A5A5', // Teal
          light: '#1CBEBE',
          dark: '#108787',
        },
        accent: {
          DEFAULT: '#E6B325', // Gold
          light: '#F7C94A',
          dark: '#C99A1D',
        },
        background: {
          DEFAULT: '#F8F9FA',
          dark: '#E9ECEF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
