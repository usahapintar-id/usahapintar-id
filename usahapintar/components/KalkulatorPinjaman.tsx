"use client";

import { useMemo, useState } from "react";
import TombolUnduh from "./TombolUnduh";

function rupiah(n: number) {
  if (!isFinite(n) || isNaN(n)) return "Rp 0";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function KalkulatorPinjaman() {
  const [pokok, setPokok] = useState<number>(20000000);
  const [bunga, setBunga] = useState<number>(6);
  const [tenor, setTenor] = useState<number>(24);

  const totalBunga = pokok * (bunga / 100) * (tenor / 12);
  const totalBayar = pokok + totalBunga;
  const cicilanPerBulan = tenor > 0 ? totalBayar / tenor : 0;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Simulasi Pinjaman
        </span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
          Kalkulator Simulasi Pinjaman / KUR
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Perkirakan cicilan bulanan dan total bunga sebelum mengajukan
          pinjaman modal usaha.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Input side */}
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">
              Jumlah pinjaman
            </label>
            <input
              type="number"
              min={0}
              value={pokok}
              onChange={(e) => setPokok(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <label className="mt-6 flex items-center justify-between font-body text-sm font-semibold text-ink">
              <span>Suku bunga per tahun</span>
              <span className="font-mono text-forest">{bunga}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={bunga}
              onChange={(e) => setBunga(Number(e.target.value))}
              className="mt-2 w-full accent-forest"
            />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">
              Tenor (lama pinjaman, dalam bulan)
            </label>
            <input
              type="number"
              min={1}
              value={tenor}
              onChange={(e) =>
                setTenor(Math.max(1, Number(e.target.value) || 1))
              }
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <p className="mt-6 font-body text-xs leading-relaxed text-muted">
              Perhitungan ini menggunakan metode bunga flat (rata), metode
              yang umum dipakai program KUR. Bank/lembaga keuangan tertentu
              bisa menggunakan metode berbeda (bunga efektif/anuitas), jadi
              angka ini adalah perkiraan, bukan angka pasti yang mengikat.
            </p>
          </div>

          {/* Result side */}
          <div>
            <div id="ringkasan-pinjaman" className="h-fit rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3">
              <span className="font-display text-sm italic text-ink">
                Ringkasan
              </span>
            </div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1">
                <span className="text-muted">Pokok pinjaman</span>
                <span>{rupiah(pokok)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Total bunga</span>
                <span>{rupiah(totalBunga)}</span>
              </div>
              <div className="flex justify-between py-1 font-semibold">
                <span>Total yang dibayar</span>
                <span>{rupiah(totalBayar)}</span>
              </div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Cicilan per bulan
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-forest">
                {rupiah(cicilanPerBulan)}
              </p>
              <p className="mt-1 font-body text-xs text-muted">
                selama {tenor} bulan
              </p>
            </div>
            </div>
            <TombolUnduh elementId="ringkasan-pinjaman" namaFile="Ringkasan-Pinjaman-CuanKit" />
          </div>
        </div>
      </div>
    </section>
  );
}
