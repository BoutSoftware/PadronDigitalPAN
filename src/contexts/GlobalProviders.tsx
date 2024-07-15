"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./ThemeProvider";
import { useRouter } from "next/navigation";

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider className={"flex flex-col min-h-screen bg-background text-foreground"} navigate={router.push}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}