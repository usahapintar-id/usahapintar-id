import Link from "next/link";
export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border-2 border-ink bg-forest px-8 py-16 text-center shadow-stamp-lg">
        {/* Subtle decorative background watermarks */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-brass/20 blur-2xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brass/50 bg-black/20 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-brass shadow-sm">
            Mulai Tanpa Ragu
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-paper sm:text-5xl text-balance">
            Jangan mulai usaha hanya berdasarkan feeling.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-paper/85 leading-relaxed">
            Hitung dulu. Pahami angkanya. Baru ambil keputusan dengan percaya diri.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/analisis-usaha"
              className="group inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-brass px-8 py-3.5 font-body text-sm font-bold text-ink shadow-stamp transition-all hover:-translate-y-1 hover:brightness-105 hover:shadow-stamp-md active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Cari Usaha yang Cocok</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="/kalkulator-hpp#kalkulator"
              className="inline-flex items-center rounded-sm border-2 border-paper/40 bg-white/10 px-8 py-3.5 font-body text-sm font-bold text-paper backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20 active:translate-x-0.5 active:translate-y-0.5"
            >
              Hitung Usaha Saya &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
