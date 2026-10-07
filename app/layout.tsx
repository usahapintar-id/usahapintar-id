import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import PasangAplikasi from "@/components/PasangAplikasi";

export const viewport: Viewport = {
  themeColor: "#F1F4EC",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cuankit.id"),
  icons: { icon: "/favicon.png" },
  appleWebApp: { capable: true, title: "CuanKit", statusBarStyle: "default" },
  title: {
    default: "CuanKit | Dari ide usaha sampai angka yang masuk akal",
    template: "%s | CuanKit",
  },
  description:
    "CuanKit membantu mencari usaha yang cocok, menghitung modal, HPP, harga jual, BEP, dan target keuntungan.",
  openGraph: {
    title: "CuanKit | Dari ide usaha sampai angka yang masuk akal",
    description:
      "Pilih usaha, uji simulasinya, hitung HPP, dan susun target cuan tanpa menebak-nebak.",
    siteName: "CuanKit",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Manifest dan ikon layar utama memakai alamat relatif (bukan lewat metadataBase) supaya tetap
  // satu origin, baik situs dibuka dari cuankit.id maupun www.cuankit.id.
  return (<html lang="id"><head><link rel="manifest" href="/manifest.webmanifest" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" /></head><body className="font-body paper-texture">{children}<PasangAplikasi /><Analytics /></body></html>);
}
