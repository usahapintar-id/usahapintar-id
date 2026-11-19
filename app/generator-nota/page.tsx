import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeneratorNota from "@/components/GeneratorNota";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/generator-nota" },
  title: "Generator Nota & Invoice UMKM",
  description:
    "Buat nota penjualan toko lengkap dengan logo usaha, hitung total dan diskon otomatis, unduh PDF, dan kirim langsung ke WhatsApp pelanggan.",
});

export default function GeneratorNotaPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Operasional Penjualan</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Generator Nota &amp; Invoice Toko
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Buat nota rapi lengkap dengan identitas dan logo toko, hitung total tagihan dan kembalian otomatis, unduh PDF, lalu bagikan langsung lewat WhatsApp.
            </p>
          </div>

          <div className="mt-8">
            <GeneratorNota />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
