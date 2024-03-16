import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProviders from "@/contexts/GlobalProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Padron Digital | PAN",
  description: "Aplicación integral para las actividades diarias del Partido Acción Nacional",
  icons: "/logoPan.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {/* <Script src="./noFlash.js" /> */}
        {/* <script src="./noFlash.js" async /> */}
      </head>
      <body className={inter.className}>
        <GlobalProviders>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
