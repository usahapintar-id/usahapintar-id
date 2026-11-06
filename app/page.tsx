import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import LatestArticles from "@/components/LatestArticles";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { databaseUsaha, ringkasanTemplate } from "@/lib/databaseUsaha";
import { formatRupiah as rupiah } from "@/lib/hitung";

const contohEsTeh = ringkasanTemplate("es-teh-jumbo");

const featuredUsaha = ["es-teh-jumbo", "jasa-desain", "konveksi-rumahan", "reseller-fashion"]
  .map((id) => databaseUsaha.find((usaha) => usaha.id === id))
  .filter((usaha): usaha is (typeof databaseUsaha)[number] => Boolean(usaha));

export const metadata: Metadata = {
  title: { absolute: "CuanKit — Cari dan Hitung Usaha yang Cocok" },
  description:
    "Cari ide usaha berdasarkan modal dan kondisi kamu. Hitung modal, HPP, harga jual, keuntungan, dan BEP sebelum memulai usaha.",
  keywords: [
    "ide usaha",
    "analisis usaha",
    "simulasi usaha",
    "kalkulator usaha",
    "usaha untuk pemula",
    "UMKM",
  ],
  alternates: { canonical: "https://www.cuankit.id" },
  openGraph: {
    title: "CuanKit — Cari dan Hitung Usaha yang Cocok",
    description:
      "Cari ide usaha, hitung modal dan HPP, lalu uji keuntungan dan BEP sebelum memulai.",
    url: "https://www.cuankit.id",
    siteName: "CuanKit",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CuanKit | Temukan usaha yang cocok dan hitung angkanya",
    description:
      "Temukan ide usaha, lihat simulasinya, dan susun target keuntungan dengan CuanKit.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CuanKit",
  url: "https://www.cuankit.id",
  description:
    "Alat bantu untuk menemukan usaha yang cocok dan menyusun keputusan usaha berdasarkan angka.",
  inLanguage: "id-ID",
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CuanKit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.cuankit.id",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Header />
      <Hero />
      <section className="border-y border-ink/10 bg-paperDark/40 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Mulai sesuai kebutuhan
          </span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink">
            Kamu sekarang ada di tahap mana?
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              href="/analisis-usaha"
              className="group flex flex-col justify-between rounded-lg border-2 border-ink bg-paper p-7 shadow-stamp-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-stamp-lg"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 rounded border border-ink/20 bg-paperDark/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brass">
                  01 · Mulai dari sini
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-ink group-hover:text-forest transition-colors">
                  Belum tahu mau usaha apa?
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                  Temukan usaha yang sesuai dengan modal, keahlian, dan kondisi kamu lewat 7 pertanyaan ringkas.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-body text-sm font-bold text-forest">
                <span>Cari Usaha</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>

            <Link
              href="/simulasi"
              className="group relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-ink bg-forest p-7 text-paper shadow-stamp-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-stamp-lg"
            >
              <div className="absolute -right-4 -top-4 font-mono text-6xl font-black text-white/5 pointer-events-none">
                02
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded border border-paper/30 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brass">
                  02 · Uji angkanya
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-paper">
                  Sudah punya ide usaha?
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-paper/85">
                  Simulasikan modal, harga jual, laba, dan titik impas BEP sebelum mengeluarkan modal riil.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-body text-sm font-bold text-brass">
                <span>Simulasikan Sekarang</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>

            <Link
              href="/kalkulator-hpp#kalkulator"
              className="group flex flex-col justify-between rounded-lg border-2 border-ink bg-paper p-7 shadow-stamp-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-stamp-lg"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 rounded border border-ink/20 bg-paperDark/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brass">
                  03 · Rapikan hitungan
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-ink group-hover:text-forest transition-colors">
                  Sudah menjalankan usaha?
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                  Hitung HPP bahan baku dan tenaga kerja, lalu evaluasi apakah harga jual usahamu sudah memberi untung sehat.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-body text-sm font-bold text-forest">
                <span>Hitung HPP</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          </div>

          <div className="mt-14 flex items-end justify-between gap-4 border-t-2 border-ink/10 pt-10">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brass">Template usaha terpopuler</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Contoh Usaha yang Bisa Kamu Analisis</h2>
            </div>
            <Link href="/template-usaha" className="hidden font-body text-sm font-bold text-forest underline decoration-brass decoration-2 underline-offset-4 hover:text-forest-dark sm:block">
              Lihat semua template &rarr;
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredUsaha.map((usaha) => (
              <Link
                key={usaha.id}
                href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`}
                className="group flex flex-col justify-between rounded-md border-2 border-ink/20 bg-paper p-5 shadow-stamp transition-all duration-150 hover:-translate-y-1 hover:border-ink hover:shadow-stamp-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">{usaha.kategori}</span>
                    <span className="rounded bg-paperDark px-1.5 py-0.5 font-mono text-[9px] text-ink/70">{usaha.tingkatKesulitan}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">{usaha.nama}</h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-muted line-clamp-2">Lihat estimasi modal awal, HPP, laba, dan titik impas usaha.</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                  <span className="font-mono text-xs font-bold text-forest">{rupiah(usaha.modalAwal)}</span>
                  <span className="font-body text-xs font-bold text-forest group-hover:translate-x-0.5 transition-transform">Simulasi &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass">
            Manfaat Nyata
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-ink sm:text-4xl text-balance">
            Jangan cuma cari ide. Hitung apakah usahanya masuk akal.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Cari Usaha", "Temukan ide usaha berdasarkan kondisi, keahlian, dan modal yang kamu miliki."],
              ["02", "Hitung Modal & HPP", "Ketahui kebutuhan modal dan biaya produksi sebelum menentukan harga."],
              ["03", "Hitung Keuntungan", "Simulasikan margin keuntungan dan perkiraan laba bersih bulanan."],
              ["04", "Ketahui BEP", "Ketahui berapa banyak penjualan yang dibutuhkan untuk menutup biaya tetap dan balik modal."],
            ].map(([number, title, description]) => (
              <article key={title} className="rounded-md border-2 border-ink/15 bg-paper p-6 shadow-[3px_3px_0_0_#1E2A1F] transition-all hover:border-ink hover:shadow-stamp-md">
                <span className="inline-block font-mono text-sm font-bold text-brass border-b-2 border-brass/40 pb-1">{number}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Problem />

      <section className="border-y border-ink/10 bg-paperDark/40 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-semibold">Contohnya seperti ini</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl text-balance">Angka yang bisa kamu pakai untuk mengambil keputusan.</h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted">Mulai dari template terverifikasi, lalu sesuaikan dengan biaya dan target usahamu sendiri tanpa batasan.</p>
          </div>
          <div className="rounded-lg border-2 border-ink bg-paper p-6 shadow-stamp-lg transition-all sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink/15 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brass font-bold">Laporan Simulasi</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-ink">ES TEH JUMBO</h3>
              </div>
              <span className="rounded bg-paperDark px-2 py-0.5 font-mono text-xs font-semibold text-muted">Estimasi Awal</span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
              {(contohEsTeh ? [
                ["Modal awal", rupiah(contohEsTeh.usaha.modalAwal)],
                ["Harga jual", rupiah(contohEsTeh.usaha.hargaJual)],
                ["HPP", rupiah(contohEsTeh.usaha.hpp)],
                ["Laba/cup", rupiah(contohEsTeh.labaPerUnit)],
                ["Biaya tetap", `${rupiah(contohEsTeh.usaha.biayaTetapBulanan)}/bln`],
                ["Target jualan", `${contohEsTeh.usaha.penjualanHarian} cup/hari`],
                ["Laba bersih", `${rupiah(contohEsTeh.labaBersihBulanan)}/bln`],
                ["BEP Impas", `${contohEsTeh.bepUnitBulanan} cup/bln`]
              ] : []).map(([label, value]) => (
                <div key={label} className="rounded border border-ink/10 bg-paperDark/40 p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">{label}</dt>
                  <dd className="mt-1 text-sm font-bold text-forest tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-dashed border-ink/20 pt-4 font-body text-xs italic text-muted">Contoh simulasi — hasil aktual dapat disesuaikan dengan harga bahan baku lokal.</p>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Features />

      <section className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-semibold">Kenapa harus dihitung dulu?</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl text-balance">Angka membantu kamu mulai dengan lebih sadar.</h2>
          </div>
          <ul className="grid gap-3.5 font-body text-sm text-ink sm:grid-cols-2">
            {[
              "Mengurangi risiko salah menghitung modal",
              "Membantu menentukan harga jual yang profitable",
              "Mengetahui target penjualan harian yang realistis",
              "Mengetahui titik balik modal (Break Even Point)",
              "Membantu membandingkan beberapa ide usaha secara objektif",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-md border border-ink/10 bg-paper p-3.5 shadow-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-paper">✓</span>
                <span className="font-medium text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <LatestArticles />
      <CTASection />
      <Footer />
    </main>
  );
}
