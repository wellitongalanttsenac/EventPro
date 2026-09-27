import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventPro - Gestão de Workshops e Palestras",
  description: "Plataforma inteligente para organização e credenciamento de eventos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#150606] text-[#F5EDEC]`}>
        {children}
      </body>
    </html>
  );
}
