/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        text: '#EDEDED',
        border: '#333333',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
}
