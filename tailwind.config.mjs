/** @type {import('tailwindcss').Config} */
function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${varName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${varName})`;
  };
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        md: {
          surface: withOpacity('--md-surface'),
          'surface-dim': withOpacity('--md-surface-dim'),
          'surface-bright': withOpacity('--md-surface-bright'),
          'surface-container-lowest': withOpacity('--md-surface-container-lowest'),
          'surface-container-low': withOpacity('--md-surface-container-low'),
          'surface-container': withOpacity('--md-surface-container'),
          'surface-container-high': withOpacity('--md-surface-container-high'),
          'surface-container-highest': withOpacity('--md-surface-container-highest'),
          'on-surface': withOpacity('--md-on-surface'),
          'on-surface-variant': withOpacity('--md-on-surface-variant'),
          outline: withOpacity('--md-outline'),
          'outline-variant': withOpacity('--md-outline-variant'),

          primary: withOpacity('--md-primary'),
          'on-primary': withOpacity('--md-on-primary'),
          'primary-container': withOpacity('--md-primary-container'),
          'on-primary-container': withOpacity('--md-on-primary-container'),

          secondary: withOpacity('--md-secondary'),
          'on-secondary': withOpacity('--md-on-secondary'),
          'secondary-container': withOpacity('--md-secondary-container'),
          'on-secondary-container': withOpacity('--md-on-secondary-container'),

          tertiary: withOpacity('--md-tertiary'),
          'on-tertiary': withOpacity('--md-on-tertiary'),
          'tertiary-container': withOpacity('--md-tertiary-container'),
          'on-tertiary-container': withOpacity('--md-on-tertiary-container'),

          error: withOpacity('--md-error'),
          'error-container': withOpacity('--md-error-container'),
          'on-error': withOpacity('--md-on-error'),
          'on-error-container': withOpacity('--md-on-error-container'),

          'inverse-surface': withOpacity('--md-inverse-surface'),
          'inverse-on-surface': withOpacity('--md-inverse-on-surface'),
          'inverse-primary': withOpacity('--md-inverse-primary'),
        },
      },
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        DEFAULT: 'transparent',
      }),
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