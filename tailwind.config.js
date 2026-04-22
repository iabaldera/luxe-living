/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxe: {
          black: "#0A0A0A",
          ink: "#141414",
          bone: "#F8F5F0",
          cream: "#EFE9DD",
          gold: "#C9A96E",
          "gold-soft": "#D9BE89",
          "gold-deep": "#A8874E",
          muted: "#6B6B6B",
          line: "#E6DFD1",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "Outfit", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        luxe: "0.12em",
      },
      boxShadow: {
        gold: "0 8px 24px -12px rgba(201, 169, 110, 0.45)",
        soft: "0 2px 20px -8px rgba(10, 10, 10, 0.12)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        content: "800px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSoft: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 300ms ease both",
        "slide-up": "slideUp 300ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "bounce-soft": "bounceSoft 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
