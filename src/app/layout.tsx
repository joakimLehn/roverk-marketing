import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import { Nav } from "@/app/nav";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ukeoversikt — Roverk",
  description: "Godkjenningspanel for ukens innlegg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="no"
      className={`${archivo.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="mx-auto w-full max-w-[1100px] px-6">
          <Nav />
        </div>
        {children}
      </body>
    </html>
  );
}
