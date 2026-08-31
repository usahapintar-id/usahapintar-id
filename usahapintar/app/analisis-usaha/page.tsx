import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalisisUsahaKuesioner from "@/components/AnalisisUsahaKuesioner";

export const metadata: Metadata = {
  title: "Analisis Ide Usaha — CuanKit",
  description:
    "Jawab beberapa pertanyaan singkat, dapatkan rekomendasi ide usaha yang cocok dengan modal, waktu, keterampilan, dan sumber daya Anda.",
};

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
            3 Usaha Paling Realistis untuk Anda Mulai
          </h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted">
            Berdasarkan modal, waktu, kemampuan, aset, minat, dan tujuan
            Anda, CuanKit menampilkan rekomendasi usaha yang paling realistis
            untuk dimulai, lengkap dengan alasan, tantangan, estimasi modal,
            potensi pengembangan, dan langkah pertama yang masuk akal.
          </p>

          <AnalisisUsahaKuesioner />
        </div>
      </section>
      <Footer />
    </main>
  );
}
