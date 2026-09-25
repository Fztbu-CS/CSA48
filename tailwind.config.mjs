/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        md: {
          surface: 'var(--md-surface)',
          'surface-dim': 'var(--md-surface-dim)',
          'surface-bright': 'var(--md-surface-bright)',
          'surface-container-lowest': 'var(--md-surface-container-lowest)',
          'surface-container-low': 'var(--md-surface-container-low)',
          'surface-container': 'var(--md-surface-container)',
          'surface-container-high': 'var(--md-surface-container-high)',
          'surface-container-highest': 'var(--md-surface-container-highest)',
          'on-surface': 'var(--md-on-surface)',
          'on-surface-variant': 'var(--md-on-surface-variant)',
          outline: 'var(--md-outline)',
          'outline-variant': 'var(--md-outline-variant)',

          primary: 'var(--md-primary)',
          'on-primary': 'var(--md-on-primary)',
          'primary-container': 'var(--md-primary-container)',
          'on-primary-container': 'var(--md-on-primary-container)',

          secondary: 'var(--md-secondary)',
          'on-secondary': 'var(--md-on-secondary)',
          'secondary-container': 'var(--md-secondary-container)',
          'on-secondary-container': 'var(--md-on-secondary-container)',

          tertiary: 'var(--md-tertiary)',
          'on-tertiary': 'var(--md-on-tertiary)',
          'tertiary-container': 'var(--md-tertiary-container)',
          'on-tertiary-container': 'var(--md-on-tertiary-container)',

          error: 'var(--md-error)',
          'error-container': 'var(--md-error-container)',
          'on-error': 'var(--md-on-error)',
          'on-error-container': 'var(--md-on-error-container)',

          'inverse-surface': 'var(--md-inverse-surface)',
          'inverse-on-surface': 'var(--md-inverse-on-surface)',
          'inverse-primary': 'var(--md-inverse-primary)',
        },
      },
      borderRadius: {
        'md-none': '0px',
        'md-xs': '4px',
        'md-sm': '8px',
        'md-md': '12px',
        'md-lg': '16px',
        'md-xl': '24px',
        'md-2xl': '28px',
        'md-3xl': '32px',
        'md-full': '9999px',
      },
      boxShadow: {
        'md-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)',
        'md-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)',
        'md-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
        'md-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.2)',
        'md-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: [
          '"Google Sans"',
          'Roboto',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};