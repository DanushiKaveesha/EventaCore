/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#F59E0B',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F97316',
        info: '#3B82F6',
        light: '#F9FAFB',
        dark: '#111827',
        grayborder: '#E5E7EB',
      },
    },
  },
  plugins: [],
}