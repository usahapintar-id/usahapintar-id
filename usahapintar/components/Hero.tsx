export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        {/* Left: copy */}
        <div>
          <span className="inline-block rounded-full border border-brass/40 bg-brass/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brass">
            Dari ide usaha sampai angka yang masuk akal
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Bingung mau usaha apa?{" "}
            <span className="italic text-forest">Mulai dari yang cocok.</span>
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
            CuanKit membantu mencari usaha yang cocok, melihat simulasi modal,
            menghitung HPP dan harga jual, mengecek BEP, lalu menyusun target
            keuntungan berdasarkan angka Anda sendiri.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/analisis-usaha"
              className="rounded-sm bg-forest px-6 py-3 font-body text-sm font-semibold text-paper shadow-sm transition hover:bg-forest-dark"
            >
              Cari Usaha yang Cocok
            </a>
            <a
              href="/template-usaha"
              className="font-body text-sm font-semibold text-ink underline decoration-brass decoration-2 underline-offset-4 transition hover:text-forest"
            >
              Lihat Template Usaha
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-6">
            <div>
              <dt className="font-mono text-2xl font-semibold text-forest">
                500+
              </dt>
              <dd className="mt-1 font-body text-xs text-muted">
                UMKM sudah pakai
              </dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-semibold text-forest">
                Rp0
              </dt>
              <dd className="mt-1 font-body text-xs text-muted">
                Biaya kalkulator
              </dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-semibold text-forest">
                &lt;5 mnt
              </dt>
              <dd className="mt-1 font-body text-xs text-muted">
                Hasil harga jual
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: ledger card, the signature visual */}
        <div className="relative">
          <div className="absolute -inset-3 -rotate-1 rounded-md border-2 border-ink/10" />
          <div className="relative rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
              <span className="font-display text-sm italic text-ink">
                Buku Kas — Kue Lapis Ibu Sari
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                per 20 pcs
              </span>
            </div>

            <div className="bg-ledger-lines px-5 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1">
                <span className="text-muted">Bahan baku</span>
                <span>Rp 80.000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Tenaga kerja</span>
                <span>Rp 30.000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Overhead</span>
                <span>Rp 10.000</span>
              </div>
              <div className="flex justify-between py-1 font-semibold">
                <span>HPP / pcs</span>
                <span>Rp 6.000</span>
              </div>
            </div>

            <div className="relative flex items-center justify-between border-t-2 border-ink px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Harga jual disarankan
                </p>
                <p className="font-display text-2xl font-semibold text-forest">
                  Rp 9.000
                </p>
              </div>
              <div className="stamp flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-ledger font-display text-[11px] font-bold uppercase leading-tight text-ledger">
                <span className="text-center">
                  Untung
                  <br />
                  50%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
