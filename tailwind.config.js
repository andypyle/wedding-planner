/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5F8D4E',
        secondary: '#A4BE7B',
        accent: '#E5B8A0',
        background: '#F5EFE6',
        surface: '#FAF7F0',
        muted: {
          blue: '#6D8B96',
          green: '#5F8D4E',
          orange: '#E5B8A0',
          brown: '#9E7676',
          gray: '#9E9E9E',
        },
        earth: {
          100: '#FAF7F0',
          200: '#F5EFE6',
          300: '#E5DCC5',
          400: '#C8B688',
          500: '#9E7676',
          600: '#7D6E83',
          700: '#65647C',
          800: '#594545',
          900: '#3F3B37',
        },
      },
    },
  },
  plugins: [],
}
