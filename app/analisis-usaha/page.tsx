import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalisisUsahaKuesioner from "@/components/AnalisisUsahaKuesioner";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/analisis-usaha" },
  title: "Analisis Ide Usaha",
  description:
    "Jawab beberapa pertanyaan singkat, dapatkan rekomendasi ide usaha yang cocok dengan modal, waktu, keterampilan, dan sumber daya Anda.",
});

export default function Page() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Analisis Ide Usaha
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Cari Ide Usaha yang Cocok untuk Anda
          </h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted">
            Jawab 7 pertanyaan singkat tentang modal, waktu, kemampuan, aset,
            minat, dan target Anda. CuanKit lalu menampilkan 3 usaha paling
            realistis beserta alasan, estimasi modal, dan langkah pertamanya.
          </p>

          <AnalisisUsahaKuesioner />
        </div>
      </section>
      <Footer />
    </main>
  );
}
