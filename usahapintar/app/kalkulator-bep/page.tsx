import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KalkulatorBEP from "@/components/KalkulatorBEP";
import RekomendasiAlat from "@/components/RekomendasiAlat";

export const metadata: Metadata = {
  title: "Kalkulator BEP (Break Even Point) — CuanKit",
  description:
    "Hitung berapa unit yang harus terjual supaya usaha Anda balik modal.",
};

export default function Page() {
  return (
    <main>
      <Header />
      <KalkulatorBEP />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <RekomendasiAlat jenisUsahaId="umum" />
      </div>
      <Footer />
    </main>
  );
}
