import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.cuankit.id"),
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
    url: "https://www.cuankit.id",
    siteName: "CuanKit",
    locale: "id_ID",
    type: "website",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="id"><body className="font-body paper-texture">{children}<Analytics /></body></html>);
}
