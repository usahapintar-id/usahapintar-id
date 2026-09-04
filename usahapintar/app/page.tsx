import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import HPPCalculator from "@/components/HPPCalculator";
import Testimonials from "@/components/Testimonials";
import LatestArticles from "@/components/LatestArticles";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { databaseUsaha } from "@/lib/databaseUsaha";

function rupiah(value: number) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="border-y border-ink/10 bg-paperDark/40 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Mulai sesuai kebutuhan
          </span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink">
            Pilih langkah pertama Anda.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link href="/analisis-usaha" className="rounded-md border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">Belum punya usaha?</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Cari usaha yang cocok</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">Jawab pertanyaan tentang modal, waktu, keterampilan, pengalaman, dan target laba untuk mendapat rekomendasi.</p>
              <span className="mt-5 inline-block font-body text-sm font-semibold text-forest">Mulai Analisis Usaha →</span>
            </Link>
            <Link href="/template-usaha" className="rounded-md border-2 border-ink bg-forest p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5">
              <p className="font-mono text-xs uppercase tracking-widest text-brass">Sudah punya gambaran?</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-paper">Gunakan template usaha</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-paper/80">Pilih contoh usaha, lihat Simulasi Usaha, lalu ubah semua angka di Kalkulator HPP.</p>
              <span className="mt-5 inline-block font-body text-sm font-semibold text-brass">Lihat Template Usaha →</span>
            </Link>
          </div>
          <div className="mt-12 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brass">Template populer</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Mulai dari angka contoh yang dekat.</h2>
            </div>
            <Link href="/template-usaha" className="hidden font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4 sm:block">Lihat semua template →</Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {databaseUsaha.slice(0, 4).map((usaha) => (
              <Link key={usaha.id} href={`/simulasi?usaha=${encodeURIComponent(usaha.id)}`} className="rounded-sm border border-ink/15 bg-paper p-4 transition hover:border-forest">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{usaha.kategori}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{usaha.nama}</h3>
                <p className="mt-3 font-mono text-xs text-muted">HPP {rupiah(usaha.hpp)} · Jual {rupiah(usaha.hargaJual)}</p>
                <span className="mt-3 inline-block font-body text-xs font-semibold text-forest">Buka simulasi →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Problem />
      <HowItWorks />
      <HPPCalculator />
      <Features />
      <Testimonials />
      <LatestArticles />
      <CTASection />
      <Footer />
    </main>
  );
}
