import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CuanKit — Tools Cerdas, Usaha Makin Cuan",
  description:
    "CuanKit membantu UMKM Indonesia menghitung HPP, menentukan harga jual, dan mengelola usaha lebih cerdas — dari kalkulator hingga tools bisnis lainnya.",
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body paper-texture`}
      >
        {children}
      </body>
    </html>
  );
}
