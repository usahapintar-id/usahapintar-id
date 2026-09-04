import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { databaseUsaha } from "@/lib/databaseUsaha";

export const metadata: Metadata = {
  title: "Template Usaha — CuanKit",
  description:
    "Pilih template usaha, lihat simulasi modal dan laba, lalu ubah angkanya di Kalkulator HPP CuanKit.",
};

function rupiah(value: number) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

export default function TemplateUsahaPage() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Mulai dari template
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl">
            Pilih usaha, lalu uji angkanya sebelum mulai.
          </h1>
          <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-muted">
            Gunakan angka estimasi sebagai titik awal. Lihat potensi modal,
            HPP, harga jual, laba, dan BEP di Simulasi Usaha, lalu sesuaikan
            semuanya dengan kondisi Anda di Kalkulator HPP.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {databaseUsaha.map((usaha) => (
              <article
                key={usaha.id}
                className="flex flex-col rounded-md border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#1E2A1F]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {usaha.kategori}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                      {usaha.nama}
                    </h2>
                  </div>
                  <span className="rounded-full bg-forest/10 px-2 py-1 font-mono text-[10px] text-forest">
                    {usaha.tingkatKesulitan}
                  </span>
                </div>

                <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                  {usaha.deskripsi}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-ink/10 py-3 font-mono text-xs">
                  <div>
                    <dt className="text-muted">Modal awal</dt>
                    <dd className="mt-1 font-semibold text-ink">{rupiah(usaha.modalAwal)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Laba / unit</dt>
                    <dd className="mt-1 font-semibold text-forest">{rupiah(usaha.hargaJual - usaha.hpp)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">HPP</dt>
                    <dd className="mt-1 font-semibold text-ink">{rupiah(usaha.hpp)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Harga jual</dt>
                    <dd className="mt-1 font-semibold text-ink">{rupiah(usaha.hargaJual)}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link
                    href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`}
                    className="rounded-sm bg-forest px-3 py-2 font-body text-xs font-semibold text-paper hover:bg-forest-dark"
                  >
                    Simulasikan
                  </Link>
                  <Link
                    href={`/?usaha=${encodeURIComponent(usaha.id)}#kalkulator`}
                    className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest"
                  >
                    Buka HPP
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 border-t border-dashed border-ink/20 pt-6">
            <p className="font-body text-sm text-muted">
              Belum menemukan usaha yang cocok? Mulai dari pertanyaan yang
              lebih personal di Analisis Usaha.
            </p>
            <Link
              href="/analisis-usaha"
              className="mt-3 inline-block font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4"
            >
              Cari usaha yang cocok untuk saya →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}