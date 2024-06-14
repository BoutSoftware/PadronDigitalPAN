import { ThemeColors, nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.hide-children > *': {
          display: 'none',
        },
      })
    }),

    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              50: "#e6f3ff",
              100: "#c0d7f1",
              200: "#98bce5",
              300: "#71a1db",
              400: "#4b86d1",
              500: "#336db7",
              600: "#27558f",
              700: "#1b3c67",
              800: "#0e243f",
              900: "#020c19",
              DEFAULT: "#112D4E",
              foreground: "#F8F8F8",
            },
            secondary: {
              DEFAULT: "#1b3c67",
              foreground: "#F8F8F8",
            },
            accent: "#F7418F"
          } as Partial<ThemeColors & { accent: string }>,
        },
        light: {
          colors: {
            primary: {
              50: "#e6f3ff",
              100: "#c0d7f1",
              200: "#98bce5",
              300: "#71a1db",
              400: "#4b86d1",
              500: "#336db7",
              600: "#27558f",
              700: "#1b3c67",
              800: "#0e243f",
              900: "#020c19",
              DEFAULT: "#112D4E",
              foreground: "#F8F8F8",
            },
            secondary: {
              DEFAULT: "#1b3c67",
              foreground: "#F8F8F8",
            },
            accent: "#F7418F"
          } as Partial<ThemeColors & { accent: string }>,
        }
      }
    })
  ],
};
export default config;