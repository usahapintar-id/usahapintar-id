import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ManajemenStok from "@/components/ManajemenStok";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/stok" },
  title: "Manajemen Stok Barang UMKM",
  description:
    "Catat stok barang masuk dan keluar, pantau stok tersedia, harga modal dan jual, peringatan stok menipis, serta riwayat mutasi stok usaha Anda.",
});

export default function StokPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Operasional &amp; Gudang</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Manajemen Stok Barang
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Pantau sisa barang dagangan dan bahan baku, catat barang masuk atau keluar dengan cepat, dan dapatkan peringatan sebelum stok habis.
            </p>
          </div>

          <div className="mt-8">
            <ManajemenStok />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
