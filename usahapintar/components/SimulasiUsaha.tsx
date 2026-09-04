"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsahaById } from "@/lib/databaseUsaha";
import { getIdeById } from "@/lib/ideUsaha";

function rupiah(value: number) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

type Scenario = {
  label: string;
  hpp: number;
  harga: number;
  units: number;
};

export default function SimulasiUsaha() {
  const [usahaId, setUsahaId] = useState<string | null>(null);
  const [kategoriId, setKategoriId] = useState("kuliner");
  const [namaUsaha, setNamaUsaha] = useState("Simulasi usaha");
  const [modalAwal, setModalAwal] = useState(0);
  const [biayaTetap, setBiayaTetap] = useState(0);
  const [hpp, setHpp] = useState(8000);
  const [harga, setHarga] = useState(15000);
  const [scenario, setScenario] = useState("bahan20");
  const [penjualan, setPenjualan] = useState(20);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const usahaIdParam = params.get("usaha");
    const usaha = getUsahaById(usahaIdParam);

    if (usaha) {
      setUsahaId(usaha.id);
      setKategoriId("kuliner");
      setNamaUsaha(usaha.nama);
      setModalAwal(usaha.modalAwal);
      setBiayaTetap(usaha.biayaTetap);
      setHpp(usaha.hpp);
      setHarga(usaha.hargaJual);
      setPenjualan(usaha.penjualanHarian);
      return;
    }

    const ide = getIdeById(usahaIdParam);
    if (ide) {
      const hppEstimasi = Math.max(1000, Math.round(ide.modalMin / 20 / 100) * 100);
      setUsahaId(ide.id);
      setKategoriId(ide.jenisUsahaKalkulator);
      setNamaUsaha(ide.nama);
      setModalAwal(ide.modalMin);
      setBiayaTetap(0);
      setHpp(hppEstimasi);
      setHarga(Math.ceil((hppEstimasi * 1.5) / 100) * 100);
      setPenjualan(10);
      return;
    }

    setHpp(Number(params.get("hpp")) || 8000);
    setHarga(Number(params.get("harga")) || 15000);
    setKategoriId(params.get("jenis") || "kuliner");
  }, []);

  const laba = harga - hpp;

  const scenarios: Record<string, Scenario> = {
    bahan10: { label: "Harga bahan naik 10%", hpp: hpp * 1.1, harga, units: penjualan },
    bahan20: { label: "Harga bahan naik 20%", hpp: hpp * 1.2, harga, units: penjualan },
    hargaTurun: { label: "Harga jual diturunkan 10%", hpp, harga: harga * 0.9, units: penjualan },
    hargaNaik: { label: "Harga jual dinaikkan 10%", hpp, harga: harga * 1.1, units: penjualan },
    jualTurun: { label: "Penjualan turun 20%", hpp, harga, units: Math.round(penjualan * 0.8) },
    jualNaik: { label: "Penjualan naik 20%", hpp, harga, units: Math.round(penjualan * 1.2) },
  };
  const hasil = scenarios[scenario];
  const labaSkenario = hasil.harga - hasil.hpp;
  const margin = hasil.harga > 0 ? (labaSkenario / hasil.harga) * 100 : 0;
  const labaHarian = labaSkenario * hasil.units;
  const hargaAgarUntungTetap = Math.ceil((hasil.hpp + laba) / 100) * 100;
  const bepUnit = laba > 0 && biayaTetap > 0 ? Math.ceil(biayaTetap / laba) : 0;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Simulasi usaha</span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">Simulasi {namaUsaha}</h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">Uji beberapa kemungkinan sebelum mengambil keputusan harga atau target penjualan.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ["Modal awal", modalAwal],
            ["HPP per produk", hpp],
            ["Harga jual", harga],
            ["Laba per produk", laba],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-sm border border-ink/15 bg-paper px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label as string}</p>
              <p className="mt-1 font-display text-lg font-semibold text-forest">{rupiah(value as number)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-sm border border-brass/40 bg-brass/10 px-4 py-3 font-body text-sm text-ink">
          <strong>Estimasi awal:</strong> {bepUnit > 0 ? `BEP sekitar ${bepUnit} produk dan target ${penjualan} produk/hari menghasilkan potensi laba ${rupiah(laba * penjualan)} per hari.` : "Harga jual perlu lebih tinggi dari HPP untuk menghitung BEP."}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label className="block font-body text-sm font-semibold text-ink">HPP per produk</label>
            <input type="number" min={0} value={hpp} onChange={(e) => setHpp(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
            <label className="mt-5 block font-body text-sm font-semibold text-ink">Harga jual per produk</label>
            <input type="number" min={0} value={harga} onChange={(e) => setHarga(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
            <label className="mt-5 block font-body text-sm font-semibold text-ink">Penjualan saat ini per hari</label>
            <input type="number" min={0} value={penjualan} onChange={(e) => setPenjualan(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" />
            <label className="mt-6 block font-body text-sm font-semibold text-ink" htmlFor="scenario">Pilih kondisi yang ingin dicoba</label>
            <select id="scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest">
              {Object.entries(scenarios).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
          </div>
          <div className="rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3"><span className="font-display text-sm italic text-ink">Hasil simulasi</span></div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1"><span className="text-muted">Modal awal</span><span>{rupiah(modalAwal)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">HPP</span><span>{rupiah(hpp)} → {rupiah(hasil.hpp)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Harga jual</span><span>{rupiah(harga)} → {rupiah(hasil.harga)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Untung per produk</span><span>{rupiah(laba)} → {rupiah(labaSkenario)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">BEP estimasi</span><span>{bepUnit > 0 ? `${bepUnit} produk` : "-"}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Margin</span><span>{harga > 0 ? ((laba / harga) * 100).toFixed(1) : 0}% → {margin.toFixed(1)}%</span></div>
              <div className="flex justify-between border-t border-ink/10 py-2 font-semibold"><span>Perkiraan cuan harian</span><span>{rupiah(labaHarian)}</span></div>
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-brass">Saran keputusan</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">{scenario.startsWith("bahan") && labaSkenario < laba ? `Jika kenaikan bahan ini terjadi, naikkan harga jual menjadi sekitar ${rupiah(hargaAgarUntungTetap)} agar keuntungan per produk tetap mendekati kondisi awal.` : scenario === "jualTurun" ? "Saat penjualan turun, prioritaskan produk dengan margin terbaik dan cek kembali target harian." : "Perubahan ini masih bisa dipantau. Bandingkan cuan harian dengan target Anda sebelum menetapkannya."}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={usahaId ? (kategoriId === "kuliner" ? `/?usaha=${encodeURIComponent(usahaId)}#kalkulator` : `/?jenis=${encodeURIComponent(kategoriId)}#kalkulator`) : "/#kalkulator"} className="rounded-sm bg-forest px-3 py-2 font-body text-xs font-semibold text-paper hover:bg-forest-dark">Hitung HPP Saya →</Link>
          <Link href={`/kalkulator-bep?hpp=${Math.round(hpp)}&harga=${Math.round(harga)}&biayaTetap=${Math.round(biayaTetap)}`} className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Lihat BEP →</Link>
          <Link href={`/target-cuan?hpp=${Math.round(hpp)}&harga=${Math.round(harga)}`} className="rounded-sm border border-forest px-3 py-2 font-body text-xs font-semibold text-forest hover:bg-forest/10">Hitung Target Cuan →</Link>
          <Link href="/analisis-usaha" className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Analisis Usaha Saya →</Link>
        </div>
      </div>
    </section>
  );
}
