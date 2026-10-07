import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimulasiUsaha from "@/components/SimulasiUsaha";
import { buatStateAwalSimulasi } from "@/lib/simulasiAwal";

export const metadata: Metadata = denganOG({
  title: "Simulasi Usaha",
  description: "Coba berbagai perubahan biaya, harga, dan penjualan sebelum mengambil keputusan usaha.",
  alternates: { canonical: "/simulasi" },
});

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const awal = buatStateAwalSimulasi(searchParams);
  // key memaksa komponen dibuat ulang jika pengguna pindah ke usaha lain
  // lewat navigasi client-side, sehingga state awal selalu sesuai URL.
  const key = [awal.usahaId, awal.hpp, awal.harga, awal.modalAwal, awal.biayaTetap].join("|");
  return (
    <main>
      <Header />
      <SimulasiUsaha key={key} awal={awal} />
      <Footer />
    </main>
  );
}
