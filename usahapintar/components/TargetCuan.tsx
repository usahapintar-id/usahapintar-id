"use client";

import { useEffect, useState } from "react";
import { bacaRingkasanHPP } from "@/lib/simulasi";

function rupiah(value: number) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

export default function TargetCuan() {
  const [targetHarian, setTargetHarian] = useState(200000);
  const [hargaJual, setHargaJual] = useState(15000);
  const [hpp, setHpp] = useState(9000);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ringkasan = bacaRingkasanHPP();
    if (params.get("hpp") || ringkasan) setHpp(Number(params.get("hpp")) || ringkasan?.hpp || 0);
    if (params.get("harga") || ringkasan) setHargaJual(Number(params.get("harga")) || ringkasan?.hargaJual || 0);
  }, []);
  const labaPerUnit = hargaJual - hpp;
  const unitHarian = labaPerUnit > 0 ? Math.ceil(targetHarian / labaPerUnit) : 0;
  const unitMingguan = unitHarian * 7;
  const unitBulanan = unitHarian * 30;
  const omzetHarian = unitHarian * hargaJual;
  const omzetBulanan = omzetHarian * 30;
  const estimasiLaba = unitBulanan * labaPerUnit;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Target cuan</span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">Berapa produk perlu terjual untuk mencapai target?</h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">Masukkan target laba dan angka dari HPP Anda. Hasilnya adalah sasaran penjualan harian yang mudah dipantau.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">Target keuntungan per hari</label>
            <input type="number" min={0} value={targetHarian} onChange={(e) => setTargetHarian(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
            <label className="mt-6 block font-body text-sm font-semibold text-ink">Harga jual per unit</label>
            <input type="number" min={0} value={hargaJual} onChange={(e) => setHargaJual(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
            <label className="mt-6 block font-body text-sm font-semibold text-ink">HPP per unit</label>
            <input type="number" min={0} value={hpp} onChange={(e) => setHpp(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
          </div>
          <div className="rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3"><span className="font-display text-sm italic text-ink">Target harian</span></div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1"><span className="text-muted">Target laba harian</span><span>{rupiah(targetHarian)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Laba per unit</span><span>{rupiah(labaPerUnit)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Jual per hari</span><span>{labaPerUnit > 0 ? unitHarian : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Target per minggu</span><span>{labaPerUnit > 0 ? unitMingguan : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Target per bulan</span><span>{labaPerUnit > 0 ? unitBulanan : "-"} unit</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Omzet harian</span><span>{rupiah(omzetHarian)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Omzet bulanan</span><span>{rupiah(omzetBulanan)}</span></div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5"><p className="font-mono text-[11px] uppercase tracking-widest text-muted">Kesimpulan target</p><p className="mt-1 font-display text-xl font-semibold text-forest">{labaPerUnit > 0 ? `Sekitar ${unitHarian} produk per hari` : "Harga belum menghasilkan keuntungan"}</p><p className="mt-1 font-body text-xs text-muted">Dengan laba {rupiah(labaPerUnit)} per produk, target {rupiah(targetHarian)} per hari membutuhkan ritme penjualan yang konsisten.</p><p className="mt-2 font-body text-xs text-muted">Estimasi laba bulanan: {labaPerUnit > 0 ? rupiah(estimasiLaba) : "-"}</p></div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2"><a href="/simulasi" className="rounded-sm border border-forest px-3 py-2 font-body text-xs font-semibold text-forest hover:bg-forest/10">Simulasikan Usaha →</a><a href="/analisis-usaha" className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Analisis Usaha Saya →</a></div>
      </div>
    </section>
  );
}
