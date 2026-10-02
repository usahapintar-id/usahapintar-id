import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
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
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/analisis-usaha" className="rounded-md border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">01 · Mulai dari sini</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Belum tahu mau usaha apa?</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">Temukan usaha yang sesuai dengan modal dan kondisi kamu.</p>
              <span className="mt-5 inline-block font-body text-sm font-semibold text-forest">Cari Usaha →</span>
            </Link>
            <Link href="/simulasi?usaha=es-teh-jumbo" className="rounded-md border-2 border-ink bg-forest p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">02 · Uji angkanya</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-paper">Sudah punya ide usaha?</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-paper/80">Simulasikan modal, harga jual, laba, dan BEP.</p>
              <span className="mt-5 inline-block font-body text-sm font-semibold text-brass">Simulasikan →</span>
            </Link>
            <Link href="/kalkulator-hpp#kalkulator" className="rounded-md border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">03 · Rapikan hitungan</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Sudah menjalankan usaha?</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">Hitung HPP dan evaluasi harga jual usahamu.</p>
              <span className="mt-5 inline-block font-body text-sm font-semibold text-forest">Hitung HPP →</span>
            </Link>
          </div>
          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brass">Template usaha</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Contoh Usaha yang Bisa Kamu Analisis</h2>
            </div>
            <Link href="/template-usaha" className="hidden font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4 sm:block">Lihat semua template →</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredUsaha.map((usaha) => (
              <Link key={usaha.id} href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`} className="rounded-sm border border-ink/15 bg-paper p-4 transition hover:border-forest">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{usaha.kategori}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{usaha.nama}</h3>
                <p className="mt-3 font-body text-xs leading-relaxed text-muted">Lihat estimasi modal, laba, dan titik impas usaha.</p>
                <span className="mt-3 inline-block font-body text-xs font-semibold text-forest">Buka simulasi →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">Yang bisa kamu dapatkan</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink">Jangan cuma cari ide. Hitung apakah usahanya masuk akal.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Cari Usaha", "Temukan ide usaha berdasarkan kondisi dan modal yang kamu miliki."],
              ["02", "Hitung Modal & HPP", "Ketahui kebutuhan modal dan biaya produksi sebelum menentukan harga."],
              ["03", "Hitung Keuntungan", "Simulasikan margin dan perkiraan keuntungan."],
              ["04", "Ketahui BEP", "Ketahui berapa banyak penjualan yang dibutuhkan untuk menutup biaya tetap dan balik modal."],
            ].map(([number, title, description]) => (
              <article key={title} className="border-t-2 border-forest pt-4">
                <span className="font-mono text-sm font-semibold text-brass">{number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Problem />
      <section className="border-y border-ink/10 bg-paperDark/40 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass">Contohnya seperti ini</span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Angka yang bisa kamu pakai untuk mengambil keputusan.</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted">Mulai dari template, lalu sesuaikan dengan biaya dan target usahamu sendiri.</p>
          </div>
          <div className="rounded-md border-2 border-ink bg-paper p-5 shadow-[5px_5px_0_0_#1E2A1F] sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/15 pb-4">
              <div><p className="font-mono text-[10px] uppercase tracking-widest text-brass">Contoh simulasi</p><h3 className="mt-1 font-display text-2xl font-semibold text-ink">ES TEH JUMBO</h3></div>
              <span className="font-mono text-xs text-muted">estimasi awal</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-5 font-mono text-xs sm:grid-cols-3">
              {(contohEsTeh ? [["Modal awal", rupiah(contohEsTeh.usaha.modalAwal)], ["Harga jual", rupiah(contohEsTeh.usaha.hargaJual)], ["HPP", rupiah(contohEsTeh.usaha.hpp)], ["Laba/cup", rupiah(contohEsTeh.labaPerUnit)], ["Biaya tetap", `${rupiah(contohEsTeh.usaha.biayaTetapBulanan)}/bulan`], ["Target penjualan", `${contohEsTeh.usaha.penjualanHarian} cup/hari`], ["Perkiraan laba bersih", `${rupiah(contohEsTeh.labaBersihBulanan)}/bulan`], ["BEP", `${contohEsTeh.bepUnitBulanan} cup/bulan`]] : []).map(([label, value]) => <div key={label}><dt className="text-muted">{label}</dt><dd className="mt-1 font-semibold text-forest">{value}</dd></div>)}
            </dl>
            <p className="mt-5 border-t border-dashed border-ink/15 pt-4 font-body text-xs italic text-muted">Contoh simulasi — hasil aktual bergantung pada data usaha.</p>
          </div>
        </div>
      </section>
      <HowItWorks />
      <Features />
      <section className="border-y border-ink/10 bg-paperDark/60 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass">Kenapa harus dihitung dulu?</span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Angka membantu kamu mulai dengan lebih sadar.</h2>
          </div>
          <ul className="grid gap-3 font-body text-sm text-ink sm:grid-cols-2">
            {[
              "Mengurangi risiko salah menghitung modal",
              "Membantu menentukan harga jual",
              "Mengetahui target penjualan",
              "Mengetahui titik balik modal",
              "Membantu membandingkan beberapa ide usaha",
            ].map((item) => <li key={item} className="flex gap-3 border-b border-ink/10 pb-3"><span className="font-semibold text-forest">✓</span><span>{item}</span></li>)}
          </ul>
        </div>
      </section>
      <Testimonials />
      <LatestArticles />
      <CTASection />
      <Footer />
    </main>
  );
}
