"use client";

import { useEffect, useState } from "react";
import { bacaRingkasanHPP } from "@/lib/simulasi";
import TombolUnduh from "./TombolUnduh";

function rupiah(n: number) {
  if (!isFinite(n) || isNaN(n)) return "Rp 0";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function KalkulatorBEP() {
  const [biayaTetap, setBiayaTetap] = useState<number>(2000000);
  const [hargaJual, setHargaJual] = useState<number>(9000);
  const [biayaVariabel, setBiayaVariabel] = useState<number>(6000);
  const [penjualanHarian, setPenjualanHarian] = useState<number>(20);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ringkasan = bacaRingkasanHPP();
    const hpp = Number(params.get("hpp")) || ringkasan?.hpp;
    const harga = Number(params.get("harga")) || ringkasan?.hargaJual;
    if (hpp !== undefined) setBiayaVariabel(hpp);
    if (harga !== undefined) setHargaJual(harga);
    if (ringkasan?.biayaProduksi) setBiayaTetap(ringkasan.biayaProduksi);
  }, []);

  const marginKontribusi = hargaJual - biayaVariabel;
  const bepUnit =
    marginKontribusi > 0 ? biayaTetap / marginKontribusi : 0;
  const bepRupiah = bepUnit * hargaJual;
  const hariMenujuBep = bepUnit > 0 && penjualanHarian > 0 ? Math.ceil(bepUnit / penjualanHarian) : 0;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Titik Impas
        </span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
          Kalkulator BEP (Break Even Point)
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Cari tahu berapa unit yang harus terjual supaya usaha Anda balik
          modal, sebelum mulai untung.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Input side */}
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">
              Biaya tetap (per bulan)
            </label>
            <p className="mt-1 font-body text-xs text-muted">
              Sewa tempat, gaji tetap, cicilan alat — biaya yang tetap keluar
              meski tidak ada penjualan.
            </p>
            <input
              type="number"
              min={0}
              value={biayaTetap}
              onChange={(e) => setBiayaTetap(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />
            <label className="mt-6 block font-body text-sm font-semibold text-ink">
              Estimasi penjualan per hari
            </label>
            <input
              type="number"
              min={0}
              value={penjualanHarian}
              onChange={(e) => setPenjualanHarian(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">
              Harga jual per unit
            </label>
            <input
              type="number"
              min={0}
              value={hargaJual}
              onChange={(e) => setHargaJual(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">
              Biaya variabel per unit
            </label>
            <p className="mt-1 font-body text-xs text-muted">
              Biasanya sama dengan HPP per unit dari Kalkulator HPP —
              bahan baku, tenaga kerja langsung, dst.
            </p>
            <input
              type="number"
              min={0}
              value={biayaVariabel}
              onChange={(e) => setBiayaVariabel(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
            />
          </div>

          {/* Result side */}
          <div>
            <div id="ringkasan-bep" className="h-fit rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3">
              <span className="font-display text-sm italic text-ink">
                Ringkasan
              </span>
            </div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1">
                <span className="text-muted">Margin kontribusi/unit</span>
                <span>{rupiah(marginKontribusi)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Biaya tetap</span>
                <span>{rupiah(biayaTetap)}</span>
              </div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Titik impas (balik modal)
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-forest">
                {marginKontribusi > 0 ? Math.ceil(bepUnit) : "—"} unit
              </p>
              {marginKontribusi > 0 ? (
                <p className="mt-1 font-body text-xs text-muted">
                  setara omzet {rupiah(bepRupiah)} per bulan
                  {penjualanHarian > 0 && `, sekitar ${hariMenujuBep} hari pada ${penjualanHarian} unit/hari`}
                </p>
              ) : (
                <p className="mt-1 font-body text-xs text-ledger">
                  Harga jual harus lebih besar dari biaya variabel supaya
                  bisa balik modal.
                </p>
              )}
            </div>
            </div>
            <TombolUnduh elementId="ringkasan-bep" namaFile="Ringkasan-BEP-CuanKit" />
            <div className="mt-3 flex flex-wrap gap-2 print:hidden">
              <a href="/target-cuan" className="rounded-sm border border-forest px-3 py-2 font-body text-xs font-semibold text-forest hover:bg-forest/10">Tentukan Target Cuan →</a>
              <a href="/simulasi" className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Simulasikan Usaha →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
