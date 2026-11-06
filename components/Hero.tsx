import Link from "next/link";
import { ringkasanTemplate } from "@/lib/databaseUsaha";
import { formatRupiah } from "@/lib/hitung";

export default function Hero() {
  const contoh = ringkasanTemplate("es-teh-jumbo");
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-16 pt-12 md:pb-24 md:pt-18">
      {/* Subtle ambient decorative gradient */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 opacity-70">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-brass/10 blur-3xl" />
        <div className="absolute right-1/4 top-20 h-64 w-64 rounded-full bg-forest/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-brass/50 bg-paperDark/70 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-brass shadow-[2px_2px_0_0_#B8860B]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
            Alat bantu usaha untuk pemula
          </div>

          <h1 className="mt-6 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl text-balance">
            Mau mulai usaha tapi bingung pilih yang mana?
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
            Cari usaha yang cocok dengan modal, kemampuan, dan target keuntunganmu.
            CuanKit membantu menghitung modal, HPP, keuntungan, dan BEP sebelum kamu mulai.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/analisis-usaha"
              className="group inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-forest px-6 py-3.5 font-body text-sm font-bold text-paper shadow-stamp-md transition-all hover:-translate-y-1 hover:bg-forest-light hover:shadow-stamp-lg active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>🔎 Cari Usaha yang Cocok</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="/simulasi"
              className="inline-flex items-center rounded-sm border-2 border-ink bg-paper px-5 py-3 font-body text-sm font-semibold text-ink shadow-stamp transition-all hover:-translate-y-0.5 hover:bg-paperDark hover:shadow-stamp-md active:translate-x-0.5 active:translate-y-0.5"
            >
              Sudah Punya Ide Usaha? &rarr;
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t-2 border-ink/10 pt-6 font-mono text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="font-bold text-forest">✓</span>
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-forest">✓</span>
              <span>Tanpa Daftar Akun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-forest">✓</span>
              <span>Data Tersimpan di HP/Laptop</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive preview ledger card */}
        <div className="relative md:pl-4">
          <div className="relative rounded-lg border-2 border-ink bg-paper p-6 shadow-stamp-lg transition-all hover:-translate-y-1 sm:p-8">
            {/* Vintage stamp watermark badge */}
            <div className="absolute -right-3 -top-3 rounded border-2 border-brass bg-paperDark px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brass shadow-[2px_2px_0_0_#B8860B] stamp">
              Simulasi Riil
            </div>

            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brass font-semibold">
                  Contoh simulasi
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  Es Teh Jumbo
                </h2>
              </div>
              <span className="rounded bg-forest/10 px-2.5 py-1 font-mono text-xs font-semibold text-forest">
                F&amp;B Dingin
              </span>
            </div>

            <p className="mt-3 font-body text-xs text-muted">
              Angka awal dari template CuanKit, bisa kamu ubah. Laba sudah dikurangi biaya tetap bulanan.
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-4 rounded-md border border-ink/15 bg-paperDark/40 p-4 font-mono text-xs">
              {[
                ["Modal awal", contoh ? formatRupiah(contoh.usaha.modalAwal) : "-"],
                ["Harga jual", contoh ? formatRupiah(contoh.usaha.hargaJual) : "-"],
                ["Perkiraan laba bersih", contoh ? `${formatRupiah(contoh.labaBersihBulanan)}/bln` : "-"],
                ["BEP balik modal", contoh ? `${contoh.bepUnitBulanan} cup/bln` : "-"],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-ink/10 pb-2 last:border-b-0">
                  <dt className="text-[11px] text-muted">{label}</dt>
                  <dd className="mt-1 font-mono text-sm font-bold text-forest tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center justify-between">
              <Link
                href="/simulasi?usaha=es-teh-jumbo"
                className="group inline-flex items-center gap-1.5 font-body text-sm font-bold text-forest transition hover:text-forest-dark"
              >
                <span className="underline decoration-brass decoration-2 underline-offset-4">Buka contoh simulasi ini</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
              <span className="font-mono text-[10px] text-muted">Bisa Diedit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
