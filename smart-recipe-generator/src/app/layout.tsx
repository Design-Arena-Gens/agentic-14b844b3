import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Smart Recipe Generator",
  description:
    "Discover personalized recipes tailored to your ingredients, dietary preferences, and cooking style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${manrope.className} min-h-screen`}>{children}</body>
    </html>
  );
}
