import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KalkulatorPinjaman from "@/components/KalkulatorPinjaman";
import RekomendasiAlat from "@/components/RekomendasiAlat";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/kalkulator-pinjaman" },
  title: "Kalkulator Simulasi Pinjaman / KUR",
  description:
    "Hitung cicilan bulanan dan total bunga pinjaman modal usaha sebelum mengajukan KUR.",
});

export default function Page() {
  return (
    <main>
      <Header />
      <KalkulatorPinjaman />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <RekomendasiAlat jenisUsahaId="umum" />
      </div>
      <Footer />
    </main>
  );
}
