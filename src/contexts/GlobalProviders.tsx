"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="flex flex-col min-h-screen bg-background text-foreground">
      {children}
    </NextUIProvider>
  );
}