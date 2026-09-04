"use client";

import { useEffect, useState } from "react";
import { bacaRingkasanHPP } from "@/lib/simulasi";

type Usaha = { nama: string; namaUsaha?: string; hpp: number; hargaJual: number; targetPenjualan: number; targetLaba: number; bep: number; modalAwal?: number };
const STORAGE_KEY = "cuankit_usaha_saya";
function rupiah(value: number) { return "Rp " + Math.round(value).toLocaleString("id-ID"); }

export default function UsahaSaya() {
  const [usaha, setUsaha] = useState<Usaha[]>([]);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [nama, setNama] = useState("");
  const [hpp, setHpp] = useState(9000);
  const [hargaJual, setHargaJual] = useState(15000);
  const [targetPenjualan, setTargetPenjualan] = useState(20);
  const [targetLaba, setTargetLaba] = useState(3000000);
  const [modalAwal, setModalAwal] = useState(2000000);

  useEffect(() => {
    try { setUsaha(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); } catch { setUsaha([]); }
    const ringkasan = bacaRingkasanHPP();
    if (ringkasan) {
      setNama(ringkasan.nama);
      setHpp(Math.round(ringkasan.hpp));
      setHargaJual(Math.round(ringkasan.hargaJual));
    }
  }, []);
  function simpan() {
    if (!nama.trim()) return;
    const berikutnya = [...usaha, { nama: nama.trim(), namaUsaha: namaUsaha.trim() || "Usaha saya", hpp, hargaJual, targetPenjualan, targetLaba, modalAwal, bep: hargaJual > hpp ? Math.ceil(modalAwal / (hargaJual - hpp)) : 0 }];
    setUsaha(berikutnya); localStorage.setItem(STORAGE_KEY, JSON.stringify(berikutnya)); setNama("");
  }
  function hapus(index: number) { const berikutnya = usaha.filter((_, i) => i !== index); setUsaha(berikutnya); localStorage.setItem(STORAGE_KEY, JSON.stringify(berikutnya)); }
  return <section className="px-6 py-16"><div className="mx-auto max-w-6xl"><span className="font-mono text-xs uppercase tracking-widest text-brass">Usaha saya</span><h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">Simpan angka penting usaha Anda</h1><p className="mt-3 max-w-xl font-body text-sm text-muted">Data tersimpan hanya di perangkat ini, tanpa login. Tambahkan produk untuk memantau HPP, laba, dan target penjualan.</p>
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]"><div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]"><label className="block font-body text-sm font-semibold text-ink">Nama usaha</label><input value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} placeholder="Contoh: Kedai Berkah" className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest" /><label className="mt-5 block font-body text-sm font-semibold text-ink">Nama produk</label><input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Ayam Geprek" className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest" />{[["Modal awal", modalAwal, setModalAwal],["HPP per unit", hpp, setHpp],["Harga jual per unit", hargaJual, setHargaJual],["Target penjualan / hari", targetPenjualan, setTargetPenjualan],["Target laba bulanan", targetLaba, setTargetLaba]].map(([label, value, setter]) => <div key={label as string}><label className="mt-5 block font-body text-sm font-semibold text-ink">{label as string}</label><input type="number" min={0} value={value as number} onChange={(e) => (setter as (value: number) => void)(Number(e.target.value) || 0)} className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest" /></div>)}<button onClick={simpan} className="mt-6 rounded-sm bg-forest px-4 py-2.5 font-body text-sm font-semibold text-paper hover:bg-forest-dark">Simpan usaha</button></div>
      <div className="space-y-4">{usaha.length === 0 ? <div className="rounded-md border-2 border-dashed border-ink/20 p-8 text-center font-body text-sm text-muted">Belum ada usaha tersimpan.</div> : usaha.map((item, index) => <div key={`${item.nama}-${index}`} className="rounded-md border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#1E2A1F]"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-muted">{item.namaUsaha || "Usaha saya"}</p><h2 className="font-display text-xl font-semibold text-ink">{item.nama}</h2></div><button onClick={() => hapus(index)} className="font-mono text-xs text-ledger underline">Hapus</button></div><div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-muted sm:grid-cols-3"><span>Modal awal<br /><b className="text-ink">{rupiah(item.modalAwal ?? 0)}</b></span><span>HPP<br /><b className="text-ink">{rupiah(item.hpp)}</b></span><span>Harga jual<br /><b className="text-ink">{rupiah(item.hargaJual)}</b></span><span>Laba / unit<br /><b className="text-forest">{rupiah(item.hargaJual - item.hpp)}</b></span><span>Target jual<br /><b className="text-ink">{item.targetPenjualan} unit/hari</b></span><span>Target laba<br /><b className="text-ink">{rupiah(item.targetLaba)}</b></span><span>BEP<br /><b className="text-ink">{item.bep > 0 ? `${item.bep} unit` : "-"}</b></span></div></div>)}</div></div></div></section>;
}
