"use client";

import { useState } from "react";

function rupiah(n: number) {
  if (!isFinite(n) || isNaN(n)) return "Rp 0";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function KalkulatorGaji() {
  const [gajiPokok, setGajiPokok] = useState<number>(2500000);
  const [jamLembur, setJamLembur] = useState<number>(0);
  const [tarifLembur, setTarifLembur] = useState<number>(20000);
  const [potongan, setPotongan] = useState<number>(0);

  const totalLembur = jamLembur * tarifLembur;
  const gajiKotor = gajiPokok + totalLembur;
  const gajiBersih = gajiKotor - potongan;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Penggajian
        </span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
          Kalkulator Gaji Karyawan
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Hitung gaji bersih karyawan dengan cara yang konsisten — cocok
          untuk usaha kecil dengan 1-2 karyawan.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Input side */}
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">
              Gaji pokok (per bulan)
            </label>
            <input
              type="number"
            onFocus={(e) => e.target.select()}
              min={0}
              value={gajiPokok === 0 ? "" : gajiPokok}
              onChange={(e) => setGajiPokok(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-body text-sm font-semibold text-ink">
                  Jam lembur
                </label>
                <input
                  type="number"
            onFocus={(e) => e.target.select()}
                  min={0}
                  value={jamLembur === 0 ? "" : jamLembur}
                  onChange={(e) =>
                    setJamLembur(Number(e.target.value) || 0)
                  }
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-semibold text-ink">
                  Tarif lembur/jam
                </label>
                <input
                  type="number"
            onFocus={(e) => e.target.select()}
                  min={0}
                  value={tarifLembur === 0 ? "" : tarifLembur}
                  onChange={(e) =>
                    setTarifLembur(Number(e.target.value) || 0)
                  }
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
                />
              </div>
            </div>

            <label className="mt-6 block font-body text-sm font-semibold text-ink">
              Potongan (BPJS, kasbon, dll)
            </label>
            <input
              type="number"
            onFocus={(e) => e.target.select()}
              min={0}
              value={potongan === 0 ? "" : potongan}
              onChange={(e) => setPotongan(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />
          </div>

          {/* Result side */}
          <div className="h-fit rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3">
              <span className="font-display text-sm italic text-ink">
                Ringkasan
              </span>
            </div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1">
                <span className="text-muted">Gaji pokok</span>
                <span>{rupiah(gajiPokok)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Total lembur</span>
                <span>{rupiah(totalLembur)}</span>
              </div>
              <div className="flex justify-between py-1 font-semibold">
                <span>Gaji kotor</span>
                <span>{rupiah(gajiKotor)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Potongan</span>
                <span className="text-ledger">- {rupiah(potongan)}</span>
              </div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Gaji bersih diterima
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-forest">
                {rupiah(gajiBersih)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
