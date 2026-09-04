export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-md border-2 border-ink bg-forest px-8 py-14 text-center shadow-[6px_6px_0_0_#1E2A1F]">
        <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">
          Siap menguji rencana usahamu?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm text-paper/80">
          Mulai dari usaha yang cocok atau gunakan template. CuanKit membantu
          mengubah ide menjadi angka yang bisa diuji.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/analisis-usaha"
            className="inline-block rounded-sm bg-brass px-7 py-3 font-body text-sm font-semibold text-ink transition hover:brightness-95"
          >
            Cari Usaha yang Cocok
          </a>
          <a
            href="/template-usaha"
            className="inline-block rounded-sm border border-paper/50 px-7 py-3 font-body text-sm font-semibold text-paper transition hover:bg-paper/10"
          >
            Lihat Template Usaha
          </a>
        </div>
      </div>
    </section>
  );
}
