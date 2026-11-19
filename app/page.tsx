import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calculator, Check, Compass, LineChart } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriTools from "@/components/KategoriTools";
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

      {/* Jalur Cepat Sesuai Tahap Usaha */}
      <section className="border-y border-ink/[0.08] bg-paperDark/50 px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">Mulai Sesuai Kebutuhan</p>
          <h2 className="mt-2.5 max-w-2xl font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
            Kamu sekarang ada di tahap mana?
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Link
              href="/analisis-usaha"
              className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-7 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-muted">
                    01 · Pemula
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-soft text-forest">
                    <Compass className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink transition-colors group-hover:text-forest">
                  Belum tahu mau usaha apa?
                </h3>
                <p className="mt-2.5 font-body text-sm leading-relaxed text-muted">
                  Temukan usaha yang cocok dengan modal, waktu, dan kemampuanmu lewat 7 pertanyaan ringkas.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-body text-sm font-semibold text-forest">
                <span>Cari Ide Usaha</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/simulasi" className="group relative flex flex-col justify-between rounded-2xl bg-forest p-7 text-white shadow-stamp-forest transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-light">
              <p className="font-mono text-xs font-medium text-white/75">02 · Uji angkanya</p>
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-white">
                    Sudah punya ide usaha?
                  </h3>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-brass-soft">
                    <LineChart className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2.5 font-body text-sm leading-relaxed text-white/80">
                  Simulasikan modal awal, harga jual, laba bersih, dan titik balik modal sebelum mulai jualan.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-body text-sm font-semibold text-brass-soft">
                <span>Simulasikan Sekarang</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/kalkulator-hpp#kalkulator"
              className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-7 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-muted">
                    03 · Usaha Berjalan
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-soft text-forest">
                    <Calculator className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink transition-colors group-hover:text-forest">
                  Sudah menjalankan usaha?
                </h3>
                <p className="mt-2.5 font-body text-sm leading-relaxed text-muted">
                  Hitung HPP bahan baku, tenaga kerja, dan overhead agar harga jual usahamu benar-benar untung.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-body text-sm font-semibold text-forest">
                <span>Hitung HPP Usaha</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Template Populer */}
          <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-ink/10 pt-10">
            <div>
              <p className="section-kicker">Template Usaha Siap Uji</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Contoh Usaha yang Bisa Langsung Dianalisis
              </h2>
            </div>
            <Link
              href="/template-usaha"
              className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-forest transition hover:text-forest-light"
            >
              <span>Lihat semua template</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredUsaha.map((usaha) => (
              <Link
                key={usaha.id}
                href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`}
                className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
              >
                <div>
                  <p className="font-mono text-[11px] font-medium text-muted">
                    {usaha.kategori} · {usaha.tingkatKesulitan}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-forest">
                    {usaha.nama}
                  </h3>
                  <p className="mt-1.5 font-body text-xs leading-relaxed text-muted line-clamp-2">
                    Estimasi modal, biaya tetap, margin laba, dan titik impas bulanan.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink/[0.07] pt-3">
                  <span className="font-mono text-xs font-semibold text-ink tabular-nums">
                    {rupiah(usaha.modalAwal)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-forest">
                    <span>Simulasi</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Alat UMKM (Interactive Tabs) */}
      <KategoriTools />

      <Problem />

      {/* Contoh Laporan Simulasi Nyata */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="section-kicker">Laporan Angka Jelas</p>
            <h2 className="mt-2.5 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Angka yang langsung bisa dipakai mengambil keputusan.
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted sm:text-base">
              Mulai dari template konservatif, lalu sesuaikan biaya bahan baku, sewa, dan target penjualan dengan kondisi daerahmu sendiri.
            </p>
            <ul className="mt-6 space-y-2.5 font-body text-sm text-ink">
              {[
                "Mengurangi risiko salah menghitung modal awal",
                "Menentukan harga jual dengan margin aman",
                "Mengetahui target penjualan harian dan titik balik modal",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
              <div>
                <p className="font-mono text-[11px] font-medium text-muted">
                  Ringkasan Simulasi · Estimasi Awal
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                  Es Teh Jumbo
                </h3>
              </div>
              <Link
                href="/simulasi?usaha=es-teh-jumbo"
                className="inline-flex items-center gap-1 font-body text-xs font-semibold text-forest transition hover:text-forest-light"
              >
                <span>Ubah angka</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {(contohEsTeh
                ? [
                    ["Modal awal", rupiah(contohEsTeh.usaha.modalAwal)],
                    ["Harga jual", rupiah(contohEsTeh.usaha.hargaJual)],
                    ["HPP / cup", rupiah(contohEsTeh.usaha.hpp)],
                    ["Laba / cup", rupiah(contohEsTeh.labaPerUnit)],
                    ["Biaya tetap", `${rupiah(contohEsTeh.usaha.biayaTetapBulanan)}/bln`],
                    ["Target jual", `${contohEsTeh.usaha.penjualanHarian} cup/hari`],
                    ["Laba bersih", `${rupiah(contohEsTeh.labaBersihBulanan)}/bln`],
                    ["BEP impas", `${contohEsTeh.bepUnitBulanan} cup/bln`],
                  ]
                : []
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-ink/[0.07] bg-paper p-3"
                >
                  <dt className="font-body text-[11px] text-muted">{label}</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-ink tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-body text-xs text-muted">
              Contoh simulasi awal — hasil aktual bergantung pada biaya bahan dan penjualan harian usahamu.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Features />
      <LatestArticles />
      <CTASection />
      <Footer />
    </main>
  );
}
