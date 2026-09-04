import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulasiUsaha from "@/components/SimulasiUsaha";

export const metadata: Metadata = {
  title: "Simulasi Usaha — CuanKit",
  description: "Coba berbagai perubahan biaya, harga, dan penjualan sebelum mengambil keputusan usaha.",
};

export default function Page() {
  return <main><Header /><SimulasiUsaha /><Footer /></main>;
}
