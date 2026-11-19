import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-4 pb-20 pt-6 sm:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-forest px-6 py-14 text-center shadow-stamp-forest sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brass/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brass-soft/90">
            Mulai dengan Angka yang Jelas
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
            Jangan mulai usaha hanya berdasarkan feeling.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-white/80 sm:text-base">
            Hitung modalnya dulu, pahami HPP dan titik impasnya, baru ambil keputusan dengan percaya diri.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/analisis-usaha"
              className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 font-body text-sm font-semibold text-ink shadow-sm transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
            >
              <span>Cari Usaha yang Cocok</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kalkulator-hpp#kalkulator"
              className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-body text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20 active:scale-[0.98]"
            >
              Hitung HPP Usaha Saya
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
