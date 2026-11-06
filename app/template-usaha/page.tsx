import Link from "next/link";
import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { databaseUsaha } from "@/lib/databaseUsaha";
import { formatRupiah as rupiah } from "@/lib/hitung";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/template-usaha" },
  title: "Template Usaha",
  description:
    "Pilih template usaha, lihat simulasi modal dan laba, lalu ubah angkanya di Kalkulator HPP CuanKit.",
});

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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {databaseUsaha.map((usaha) => (
              <article
                key={usaha.id}
                className="group flex flex-col justify-between rounded-lg border-2 border-ink bg-paper p-6 shadow-stamp-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-stamp-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                        {usaha.kategori}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-bold text-ink group-hover:text-forest transition-colors">
                        {usaha.nama}
                      </h2>
                    </div>
                    <span className="rounded border border-forest/30 bg-forest/10 px-2 py-0.5 font-mono text-[10px] font-bold text-forest">
                      {usaha.tingkatKesulitan}
                    </span>
                  </div>

                  <p className="mt-3 font-body text-sm leading-relaxed text-muted line-clamp-3">
                    {usaha.deskripsi}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-3 rounded border border-ink/10 bg-paperDark/40 p-3.5 font-mono text-xs">
                    <div>
                      <dt className="text-[10px] uppercase text-muted">Modal awal</dt>
                      <dd className="mt-0.5 font-bold text-ink tabular-nums">{rupiah(usaha.modalAwal)}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase text-muted">Laba / unit</dt>
                      <dd className="mt-0.5 font-bold text-forest tabular-nums">{rupiah(usaha.hargaJual - usaha.hpp)}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase text-muted">HPP</dt>
                      <dd className="mt-0.5 font-bold text-ink tabular-nums">{rupiah(usaha.hpp)}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase text-muted">Harga jual</dt>
                      <dd className="mt-0.5 font-bold text-ink tabular-nums">{rupiah(usaha.hargaJual)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-ink/10 pt-4">
                  <Link
                    href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`}
                    className="inline-flex items-center rounded-sm border-2 border-ink bg-forest px-4 py-2 font-body text-xs font-bold text-paper shadow-stamp transition-all hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-stamp-md active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Simulasikan &rarr;
                  </Link>
                  <Link
                    href={`/kalkulator-hpp?usaha=${encodeURIComponent(usaha.id)}#kalkulator`}
                    className="inline-flex items-center rounded-sm border-2 border-ink/30 bg-paper px-4 py-2 font-body text-xs font-bold text-ink transition-all hover:border-ink hover:bg-paperDark active:translate-x-0.5 active:translate-y-0.5"
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