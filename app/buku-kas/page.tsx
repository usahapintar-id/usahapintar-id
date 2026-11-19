import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BukuKasHarian from "@/components/BukuKasHarian";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/buku-kas" },
  title: "Buku Kas Harian UMKM",
  description:
    "Catat pemasukan dan pengeluaran usaha setiap hari, pantau saldo otomatis, lihat laporan harian hingga bulanan, dan ekspor laporan keuangan UMKM.",
});

export default function BukuKasPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Keuangan Harian</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Buku Kas Harian Usaha
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Catat uang masuk dan uang keluar dengan cepat dari smartphone, hitung saldo otomatis, lalu pantau grafik arus kas harian, mingguan, dan bulanan.
            </p>
          </div>

          <div className="mt-8">
            <BukuKasHarian />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
