"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bacaRingkasanHPP } from "@/lib/simulasi";
import { formatRupiah as rupiah, hitungTargetLaba } from "@/lib/hitung";

const inputClass =
  "mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest";

export default function TargetCuan() {
  const [targetBulanan, setTargetBulanan] = useState(3000000);
  const [biayaTetap, setBiayaTetap] = useState(0);
  const [hargaJual, setHargaJual] = useState(15000);
  const [hpp, setHpp] = useState(9000);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ringkasan = bacaRingkasanHPP();
    // HPP tanpa overhead (hppVariabel); data lama yang belum punya field itu memakai hpp biasa.
    const hppAwal = Number(params.get("hpp")) || (ringkasan ? ringkasan.hppVariabel ?? ringkasan.hpp : undefined);
    const hargaAwal = Number(params.get("harga")) || ringkasan?.hargaJual;
    const biayaTetapParam = Number(params.get("biayaTetap"));
    if (hppAwal !== undefined) setHpp(Math.round(hppAwal));
    if (hargaAwal !== undefined) setHargaJual(Math.round(hargaAwal));
    if (biayaTetapParam > 0) setBiayaTetap(biayaTetapParam);
  }, []);

  // Semua angka dari satu fungsi (lib/hitung.ts) supaya konsisten dengan BEP dan Simulasi.
  const h = hitungTargetLaba(targetBulanan, biayaTetap, hargaJual, hpp);
  const targetHarian = targetBulanan / 30;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Target cuan</span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">Berapa produk perlu terjual untuk mencapai target?</h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">Masukkan target laba dan angka dari HPP Anda. Hasilnya adalah sasaran penjualan harian yang mudah dipantau.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">Target laba bersih per bulan</label>
            <p className="mt-1 font-body text-xs text-muted">Uang yang ingin kamu bawa pulang setelah biaya tetap dibayar.</p>
            <input type="number" min={0} value={targetBulanan} onChange={(e) => setTargetBulanan(Number(e.target.value) || 0)} className={inputClass} />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">Biaya tetap per bulan (opsional)</label>
            <p className="mt-1 font-body text-xs text-muted">Sewa, gaji tetap, listrik, cicilan alat. Kosongkan jika belum ada.</p>
            <input type="number" min={0} value={biayaTetap === 0 ? "" : biayaTetap} placeholder="0" onChange={(e) => setBiayaTetap(Number(e.target.value) || 0)} className={inputClass} />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">Harga jual per unit</label>
            <input type="number" min={0} value={hargaJual} onChange={(e) => setHargaJual(Number(e.target.value) || 0)} className={inputClass} />

            <label className="mt-6 block font-body text-sm font-semibold text-ink">HPP per unit</label>
            <p className="mt-1 font-body text-xs text-muted">Biaya yang naik-turun mengikuti jumlah produk (bahan, tenaga kerja langsung). Sewa, listrik, dan gas masuk ke Biaya tetap.</p>
            <input type="number" min={0} value={hpp} onChange={(e) => setHpp(Number(e.target.value) || 0)} className={inputClass} />
          </div>
          <div className="rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3"><span className="font-display text-sm italic text-ink">Target harian</span></div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1"><span className="text-muted">Target laba bersih bulanan</span><span>{rupiah(targetBulanan)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Target laba bersih harian</span><span>{rupiah(targetHarian)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Biaya tetap bulanan</span><span>{rupiah(biayaTetap)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Laba per unit</span><span>{rupiah(h.labaPerUnit)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Jual per hari (dibulatkan ke atas)</span><span>{h.bisaHitung ? h.unitHarian : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Target per minggu</span><span>{h.bisaHitung ? h.unitMingguan : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Target per bulan</span><span>{h.bisaHitung ? h.unitBulanan : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Omzet harian (rata-rata)</span><span>{rupiah(h.omzetHarian)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Omzet bulanan</span><span>{rupiah(h.omzetBulanan)}</span></div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Kesimpulan target</p>
              <p className="mt-1 font-display text-xl font-semibold text-forest">{h.bisaHitung ? `Sekitar ${h.unitHarian} produk per hari` : "Harga belum menghasilkan keuntungan"}</p>
              <p className="mt-1 font-body text-xs text-muted">Dengan laba {rupiah(h.labaPerUnit)} per produk, target laba bersih {rupiah(targetBulanan)} per bulan{biayaTetap > 0 ? ` ditambah biaya tetap ${rupiah(biayaTetap)}` : ""} membutuhkan sekitar {h.unitBulanan} produk per bulan.</p>
              <p className="mt-2 font-body text-xs text-muted">Estimasi laba bersih bulanan: {h.bisaHitung ? rupiah(h.labaBersihEstimasi) : "-"}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2"><Link href="/simulasi" className="rounded-sm border border-forest px-3 py-2 font-body text-xs font-semibold text-forest hover:bg-forest/10">Simulasikan Usaha →</Link><Link href="/analisis-usaha" className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Analisis Usaha Saya →</Link></div>
      </div>
    </section>
  );
}
