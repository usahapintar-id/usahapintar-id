"use client";

import { useState } from "react";
import TombolUnduh from "./TombolUnduh";
import { formatRupiah as rupiah, angkaNonNegatif } from "@/lib/hitung";

export default function KalkulatorGaji() {
  const [gajiPokok, setGajiPokok] = useState<number>(2500000);
  const [jamLembur, setJamLembur] = useState<number>(0);
  const [tarifLembur, setTarifLembur] = useState<number>(20000);
  const [potongan, setPotongan] = useState<number>(0);

  const totalLembur = jamLembur * tarifLembur;
  const gajiKotor = gajiPokok + totalLembur;
  const potonganMelebihi = potongan > gajiKotor;
  const gajiBersih = Math.max(0, gajiKotor - potongan);

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
            <label htmlFor="gaji-1" className="block font-body text-sm font-semibold text-ink">
              Gaji pokok (per bulan)
            </label>
            <input id="gaji-1"
              type="number"
              min={0}
              value={gajiPokok}
              onChange={(e) => setGajiPokok(angkaNonNegatif(e.target.value))}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="gaji-2" className="block font-body text-sm font-semibold text-ink">
                  Jam lembur
                </label>
                <input id="gaji-2"
                  type="number"
                  min={0}
                  value={jamLembur}
                  onChange={(e) =>
                    setJamLembur(angkaNonNegatif(e.target.value))
                  }
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
                />
              </div>
              <div>
                <label htmlFor="gaji-3" className="block font-body text-sm font-semibold text-ink">
                  Tarif lembur/jam
                </label>
                <input id="gaji-3"
                  type="number"
                  min={0}
                  value={tarifLembur}
                  onChange={(e) =>
                    setTarifLembur(angkaNonNegatif(e.target.value))
                  }
                  className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
                />
              </div>
            </div>

            <label htmlFor="gaji-4" className="mt-6 block font-body text-sm font-semibold text-ink">
              Potongan (BPJS, kasbon, dll)
            </label>
            <input id="gaji-4"
              type="number"
              min={0}
              value={potongan}
              onChange={(e) => setPotongan(angkaNonNegatif(e.target.value))}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />
          </div>

          {/* Result side */}
          <div>
            <div id="ringkasan-gaji" className="h-fit rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
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
              {potonganMelebihi && (
                <p className="mt-2 font-body text-xs text-ledger" role="note">
                  Potongan lebih besar dari gaji kotor. Periksa lagi angka potongannya.
                </p>
              )}
            </div>
            </div>
            <TombolUnduh elementId="ringkasan-gaji" namaFile="Ringkasan-Gaji-CuanKit" />
          </div>
        </div>
      </div>
    </section>
  );
}
