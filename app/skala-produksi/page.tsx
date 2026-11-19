import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KalkulatorSkalaProduksi from "@/components/KalkulatorSkalaProduksi";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/skala-produksi" },
  title: "Kalkulator Skala Produksi & Takaran Resep",
  description:
    "Hitung otomatis kebutuhan bahan baku dan estimasi biaya produksi saat menaikkan atau menurunkan target jumlah produksi usaha kuliner dan UMKM.",
});

export default function SkalaProduksiPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Produksi &amp; Resep</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Kalkulator Skala Produksi
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Masukkan komposisi resep dasar dan jumlah hasil awalnya, lalu atur target produksi baru untuk menghitung takaran bahan dan estimasi biaya secara otomatis.
            </p>
          </div>

          <div className="mt-8">
            <KalkulatorSkalaProduksi />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
