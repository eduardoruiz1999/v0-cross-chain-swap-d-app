import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        diamante: {
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
          purple: {
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          }
        }
      },
      animation: {
        'diamante-pulse': 'pulse-cyan 2s infinite',
        'diamante-shimmer': 'shimmer 2s infinite',
      }
    }
  }
}
export default config
