import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import HPPCalculator from "@/components/HPPCalculator";
import Footer from "@/components/Footer";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/kalkulator-hpp" },
  title: "Kalkulator HPP",
  description:
    "Hitung biaya produksi, HPP per unit, dan harga jual yang masuk akal untuk usaha Anda.",
});

export default function KalkulatorHPPPage() {
  return (
    <main>
      <Header />
      <section className="border-b border-ink/10 bg-paperDark/40 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Alat Bisnis
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-ink sm:text-5xl">
            Hitung HPP dan harga jual dengan angka Anda sendiri.
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-muted">
            Masukkan bahan baku, tenaga kerja, overhead, jumlah produksi, dan margin. Hasilnya tersimpan otomatis di perangkat ini.
          </p>
        </div>
      </section>
      <HPPCalculator />
      <Footer />
    </main>
  );
}
