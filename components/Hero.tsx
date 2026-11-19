import Link from "next/link";
import { ArrowRight, Calculator, Check, TrendingUp } from "lucide-react";
import { ringkasanTemplate } from "@/lib/databaseUsaha";
import { formatRupiah } from "@/lib/hitung";

export default function Hero() {
  const contoh = ringkasanTemplate("es-teh-jumbo");
  const hargaJual = contoh?.usaha.hargaJual ?? 5000;
  const hpp = contoh?.usaha.hpp ?? 2000;
  const labaPerUnit = contoh?.labaPerUnit ?? 3000;
  const porsiHpp = hargaJual > 0 ? Math.round((hpp / hargaJual) * 100) : 40;
  const porsiLaba = 100 - porsiHpp;

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16"
    >
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left: clear value proposition */}
        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brass">
            CuanKit — Tools Cerdas, Usaha Makin Cuan
          </p>

          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] text-balance">
            Kelola hitungan usaha kecil lebih rapi, tanpa menebak-nebak.
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
            Dari mencari ide usaha yang cocok dengan modalmu, menghitung HPP dan harga jual, sampai membaca target laba harian — semua praktis dari HP atau laptop.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="/analisis-usaha"
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3.5 font-body text-sm font-semibold text-white shadow-stamp-forest transition-all duration-150 hover:bg-forest-light active:scale-[0.98]"
            >
              <span>Cari Usaha yang Cocok</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/simulasi"
              className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-surface px-5 py-3.5 font-body text-sm font-semibold text-ink shadow-sm transition-all duration-150 hover:border-forest/40 hover:bg-forest-soft/50 active:scale-[0.98]"
            >
              Sudah Punya Ide Usaha?
            </Link>
            <Link
              href="/kalkulator-hpp#kalkulator"
              className="inline-flex items-center gap-1.5 px-2 py-2 font-body text-sm font-semibold text-forest underline decoration-brass/60 decoration-2 underline-offset-4 transition hover:text-forest-light"
            >
              <Calculator className="h-4 w-4" />
              <span>Hitung HPP</span>
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-ink/10 pt-6 font-body text-xs font-medium text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2.5} />
              Gratis langsung pakai
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2.5} />
              Tanpa wajib daftar akun
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2.5} />
              Nyaman di layar smartphone
            </span>
          </div>
        </div>

        {/* Right: Clean Modern Fintech Simulation Preview Card */}
        <div className="flex flex-col justify-center">
          <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <p className="font-mono text-[11px] font-medium text-muted">
                  Contoh Simulasi · Kuliner &amp; Minuman
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                  Es Teh Jumbo
                </h2>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-soft text-forest">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-ink/[0.07] bg-paper p-3.5">
                <p className="font-body text-xs text-muted">Modal awal</p>
                <p className="mt-1 font-mono text-base font-semibold text-ink tabular-nums">
                  {contoh ? formatRupiah(contoh.usaha.modalAwal) : "-"}
                </p>
              </div>
              <div className="rounded-xl border border-ink/[0.07] bg-paper p-3.5">
                <p className="font-body text-xs text-muted">Harga jual / cup</p>
                <p className="mt-1 font-mono text-base font-semibold text-ink tabular-nums">
                  {contoh ? formatRupiah(hargaJual) : "-"}
                </p>
              </div>
              <div className="rounded-xl border border-forest/15 bg-forest-soft/60 p-3.5">
                <p className="font-body text-xs text-forest-dark/80">Perkiraan laba bersih</p>
                <p className="mt-1 font-mono text-base font-semibold text-forest tabular-nums">
                  {contoh ? `${formatRupiah(contoh.labaBersihBulanan)}/bln` : "-"}
                </p>
              </div>
              <div className="rounded-xl border border-ink/[0.07] bg-paper p-3.5">
                <p className="font-body text-xs text-muted">Titik impas (BEP)</p>
                <p className="mt-1 font-mono text-base font-semibold text-ink tabular-nums">
                  {contoh ? `${contoh.bepUnitBulanan} cup/bln` : "-"}
                </p>
              </div>
            </div>

            {/* Clean ratio visualization */}
            <div className="mt-5 rounded-xl border border-ink/[0.07] bg-paper p-4">
              <div className="flex items-center justify-between font-body text-xs">
                <span className="font-medium text-ink">Komposisi per 1 cup terjual</span>
                <span className="font-mono font-semibold text-forest tabular-nums">
                  Laba kotor {formatRupiah(labaPerUnit)} ({porsiLaba}%)
                </span>
              </div>
              <div className="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full bg-paperDark">
                <div
                  className="bg-brass transition-all"
                  style={{ width: `${porsiHpp}%` }}
                  title={`Modal HPP ${porsiHpp}%`}
                />
                <div
                  className="bg-forest transition-all"
                  style={{ width: `${porsiLaba}%` }}
                  title={`Margin Laba ${porsiLaba}%`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted tabular-nums">
                <span>HPP bahan &amp; kemasan: {formatRupiah(hpp)}</span>
                <span>Untung kotor: {porsiLaba}%</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-1">
              <span className="font-body text-xs text-muted">
                Angka dapat diubah sesuai harga daerahmu
              </span>
              <Link
                href="/simulasi?usaha=es-teh-jumbo"
                className="inline-flex items-center gap-1 whitespace-nowrap font-body text-xs font-semibold text-forest transition hover:text-forest-light"
              >
                <span>Uji simulasi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
