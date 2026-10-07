import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KalkulatorBEP from "@/components/KalkulatorBEP";
import RekomendasiAlat from "@/components/RekomendasiAlat";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/kalkulator-bep" },
  title: "Kalkulator BEP (Break Even Point)",
  description:
    "Hitung berapa unit yang harus terjual setiap bulan supaya biaya tetap usaha Anda tertutup.",
});

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
