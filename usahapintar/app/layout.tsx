import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Kalkulator HPP UMKM Gratis — CuanKit",
  description:
    "Kalkulator HPP UMKM gratis dari CuanKit. Hitung HPP, harga jual, margin keuntungan, biaya tenaga kerja, dan overhead usaha Anda dalam hitungan menit — tanpa daftar, tanpa biaya.",
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
        <Analytics />
      </body>
    </html>
  );
}
