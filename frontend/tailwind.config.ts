import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#e0ecff',
          500: '#2563eb',
          600: '#1d4ed8',
          900: '#0f172a'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
