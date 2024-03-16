"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./ThemeProvider";

export default function GlobalProviders({ children }: { children: React.ReactNode }) {

  return (
    <NextUIProvider className={"flex flex-col min-h-screen bg-background text-foreground"}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}