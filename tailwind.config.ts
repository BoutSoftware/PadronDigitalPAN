import { ThemeColors, nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

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
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#3F72AF",
            foreground: "#F8F8F8",
          },
          secondary: {
            DEFAULT: "#112D4E",
            foreground: "#F8F8F8",
          },
          accent: "#F7418F"
        } as Partial<ThemeColors & { accent: string }>,
      },
      light: {
        colors: {
          primary: {
            DEFAULT: "#3F72AF",
            foreground: "#F8F8F8",
          },
          secondary: {
            DEFAULT: "#112D4E",
            foreground: "#F8F8F8",
          },
          accent: "#F7418F"
        } as Partial<ThemeColors & { accent: string }>,
      }
    }
  })],
};
export default config;
