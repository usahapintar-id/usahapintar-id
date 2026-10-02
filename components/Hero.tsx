import Link from "next/link";
import { ringkasanTemplate } from "@/lib/databaseUsaha";
import { formatRupiah } from "@/lib/hitung";

export default function Hero() {
  const contoh = ringkasanTemplate("es-teh-jumbo");
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div>
          <span className="inline-block rounded-full border border-brass/40 bg-brass/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brass">
            Alat bantu usaha untuk pemula
          </span>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.06] text-ink sm:text-6xl">
            Mau mulai usaha tapi bingung pilih yang mana?
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-muted sm:text-lg">
            Cari usaha yang cocok dengan modal, kemampuan, dan target keuntunganmu.
            CuanKit membantu menghitung modal, HPP, keuntungan, dan BEP sebelum kamu mulai.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/analisis-usaha"
              className="rounded-sm bg-forest px-6 py-3 font-body text-sm font-semibold text-paper shadow-[0_8px_18px_rgba(47,82,51,0.18)] transition hover:bg-forest-dark"
            >
              <span aria-hidden="true">🔎 </span>Cari Usaha yang Cocok
            </Link>
            <Link
              href="/template-usaha"
              className="font-body text-sm font-semibold text-ink underline decoration-brass decoration-2 underline-offset-4 transition hover:text-forest"
            >
              Sudah Punya Ide Usaha?
            </Link>
          </div>

        </div>

        <div className="relative md:pl-8">
          <div className="rounded-md border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_#1E2A1F] sm:p-7">
            <p className="font-mono text-xs uppercase tracking-widest text-brass">
              Contoh simulasi
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              Es Teh Jumbo
            </h2>
            <p className="mt-1 font-body text-xs text-muted">Angka awal dari template CuanKit, bisa kamu ubah. Laba sudah dikurangi biaya tetap.</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-ink/10 py-5 font-mono text-xs">
              {[
                ["Modal awal", contoh ? formatRupiah(contoh.usaha.modalAwal) : "-"],
                ["Harga jual", contoh ? formatRupiah(contoh.usaha.hargaJual) : "-"],
                ["Perkiraan laba bersih", contoh ? `${formatRupiah(contoh.labaBersihBulanan)}/bulan` : "-"],
                ["BEP", contoh ? `${contoh.bepUnitBulanan} cup/bulan` : "-"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="mt-1 font-semibold text-forest">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/simulasi?usaha=es-teh-jumbo" className="font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4">
              Lihat contoh simulasi →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
