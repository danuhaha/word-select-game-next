import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        lettertext: "var(--lettertext)",
        maincolor: "var(--maincolor)",
        maincolormuted: "var(--maincolormuted)",
        streak: "var(--streak)",
        button: {
          clickable: 'var(--button-clickable)',
          unclickable: 'var(--button-unclickable)',
        },
        cell: {
          selected: 'var(--cell-selected)',
          deselected: 'var(--cell-deselected)',
          'skeleton-1': 'var(--skeleton-1)',
          'skeleton-2': 'var(--skeleton-2)',
          'skeleton-3': 'var(--skeleton-3)',
        },
        celltext: {
          selected: 'var(--celltext-selected)',
          deselected: 'var(--celltext-deselected)',
        },
        calendar: {
          'background-started': 'var(--calendar-background-started)',
          border: 'var(--calendar-border)',
        },
      },
      screens: {
        "xs": "440px",
        "xxs": "380px",
        "xxxs": "340px",
        "3xl": "1800px",
      },
      fontSize: {
        "xxs": "10px",
        "xxxs": "8px",
        "l": "19px",
      },
      animation: {
        "horizontal-shake": "horizontal-shake 0.2s ease-in-out infinite",
      },
      keyframes: {
        "horizontal-shake": {
          "0%, 50%, 100%": {
            transform: "translateX(0)",
          },
          "25%": {
            transform: "translateX(-5px)",
          },
          "75%": {
            transform: "translateX(5px)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
