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
          primary: "#3F72AF",
          secondary: "#112D4E",
          accent: "#F7418F"
        } as Partial<ThemeColors & { accent: string }>,
      },
      light: {
        colors: {
          primary: "#3F72AF",
          secondary: "#112D4E",
          accent: "#F7418F"
        } as Partial<ThemeColors & { accent: string }>,
      }
    }
  })],
};
export default config;
