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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        muted: 'var(--muted)',
        'jdm-purple': 'var(--jdm-purple)',
        'jdm-pink': 'var(--jdm-pink)',
        'jdm-cyan': 'var(--jdm-cyan)',
        'jdm-orange': 'var(--jdm-orange)',
        'jdm-yellow': 'var(--jdm-yellow)',
        'jdm-red': 'var(--jdm-red)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}
