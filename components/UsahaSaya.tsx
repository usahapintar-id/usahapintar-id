"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bacaRingkasanHPP } from "@/lib/simulasi";
import { simpanJSON } from "@/lib/storage";
import { formatRupiah as rupiah } from "@/lib/hitung";
import {
  USAHA_SAYA_KEY,
  bacaUsahaSaya,
  buatEntriUsaha,
  hrefBEP,
  hrefHPP,
  hrefSimulasi,
  hrefTarget,
  simpanUsahaSaya,
  type UsahaTersimpan,
} from "@/lib/usahaSaya";

const inputClass =
  "mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest";
const textClass =
  "mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest";
const linkAksi =
  "rounded-sm border border-ink/20 px-3 py-1.5 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest";

export default function UsahaSaya() {
  const [usaha, setUsaha] = useState<UsahaTersimpan[]>([]);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [nama, setNama] = useState("");
  const [modalAwal, setModalAwal] = useState(2000000);
  const [biayaTetap, setBiayaTetap] = useState(0);
  const [hpp, setHpp] = useState(9000);
  const [hargaJual, setHargaJual] = useState(15000);
  const [targetPenjualan, setTargetPenjualan] = useState(20);
  const [targetLaba, setTargetLaba] = useState(3000000);
  const [status, setStatus] = useState<{ ok: boolean; pesan: string } | null>(null);

  useEffect(() => {
    setUsaha(bacaUsahaSaya());
    const ringkasan = bacaRingkasanHPP();
    if (ringkasan) {
      setNama(ringkasan.nama);
      // HPP tanpa overhead; data lama yang belum punya field itu memakai hpp biasa.
      setHpp(Math.round(ringkasan.hppVariabel ?? ringkasan.hpp));
      setHargaJual(Math.round(ringkasan.hargaJual));
    }
  }, []);

  function simpan() {
    if (!nama.trim()) {
      setStatus({ ok: false, pesan: "Isi nama produk dulu supaya usaha bisa disimpan." });
      return;
    }
    const hasil = simpanUsahaSaya(
      buatEntriUsaha({
        nama: nama.trim(),
        namaUsaha: namaUsaha.trim() || "Usaha saya",
        hpp,
        harga: hargaJual,
        penjualan: targetPenjualan,
        modalAwal,
        biayaTetap,
        targetLaba,
      })
    );
    setUsaha(bacaUsahaSaya());
    if (hasil === "gagal") {
      setStatus({ ok: false, pesan: "Gagal menyimpan. Browser kamu mungkin memblokir penyimpanan lokal." });
      return;
    }
    setStatus({
      ok: true,
      pesan: hasil === "baru" ? "Usaha tersimpan." : "Produk dengan nama ini sudah ada, datanya diperbarui.",
    });
    setNama("");
    setNamaUsaha("");
  }

  function hapus(index: number) {
    const berikutnya = usaha.filter((_, i) => i !== index);
    setUsaha(berikutnya);
    simpanJSON(USAHA_SAYA_KEY, berikutnya);
  }

  const kolom: { label: string; bantuan?: string; value: number; set: (n: number) => void }[] = [
    { label: "Modal awal", value: modalAwal, set: setModalAwal },
    {
      label: "Biaya tetap per bulan",
      bantuan: "Sewa, gaji tetap, listrik, gas, cicilan alat. Kosongkan jika belum ada.",
      value: biayaTetap,
      set: setBiayaTetap,
    },
    {
      label: "HPP per unit",
      bantuan: "Bahan dan tenaga kerja per produk. Overhead bulanan masuk ke Biaya tetap, jangan dihitung dua kali.",
      value: hpp,
      set: setHpp,
    },
    { label: "Harga jual per unit", value: hargaJual, set: setHargaJual },
    { label: "Target penjualan / hari", value: targetPenjualan, set: setTargetPenjualan },
    { label: "Target laba bulanan", value: targetLaba, set: setTargetLaba },
  ];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Usaha saya</span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">Simpan angka penting usaha Anda</h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Data tersimpan hanya di perangkat ini, tanpa login. Simpan hasil dari Simulasi, BEP, atau Target Cuan lewat tombol Simpan di halaman itu, atau isi manual di sini.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <label htmlFor="usaha-1" className="block font-body text-sm font-semibold text-ink">Nama usaha</label>
            <input id="usaha-1" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} placeholder="Contoh: Kedai Berkah" className={textClass} />
            <label htmlFor="usaha-2" className="mt-5 block font-body text-sm font-semibold text-ink">Nama produk</label>
            <input id="usaha-2" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Ayam Geprek" className={textClass} />
            {kolom.map((k, i) => (
              <div key={k.label}>
                <label htmlFor={`usaha-kolom-${i}`} className="mt-5 block font-body text-sm font-semibold text-ink">{k.label}</label>
                {k.bantuan && <p className="mt-1 font-body text-xs text-muted">{k.bantuan}</p>}
                <input
                  id={`usaha-kolom-${i}`}
                  type="number"
                  min={0}
                  value={k.value === 0 ? "" : k.value}
                  placeholder="0"
                  onChange={(e) => k.set(Math.max(0, Number(e.target.value) || 0))}
                  className={inputClass}
                />
              </div>
            ))}
            <button onClick={simpan} className="mt-6 rounded-sm bg-forest px-4 py-2.5 font-body text-sm font-semibold text-paper hover:bg-forest-dark">
              Simpan usaha
            </button>
            {status && (
              <p role="status" className={`mt-3 font-body text-sm ${status.ok ? "text-forest" : "text-ledger"}`}>
                {status.pesan}
              </p>
            )}
          </div>
          <div className="space-y-4">
            {usaha.length === 0 ? (
              <div className="rounded-md border-2 border-dashed border-ink/20 p-8 text-center font-body text-sm text-muted">
                <p>Belum ada usaha tersimpan.</p>
                <p className="mt-2">
                  Mulai dari{" "}
                  <Link href="/analisis-usaha" className="font-semibold text-forest underline">
                    Analisis Usaha
                  </Link>{" "}
                  atau{" "}
                  <Link href="/template-usaha" className="font-semibold text-forest underline">
                    Template Usaha
                  </Link>
                  , lalu simpan hasilnya dari Simulasi, BEP, atau Target Cuan.
                </p>
              </div>
            ) : (
              usaha.map((item, index) => {
                const angka = {
                  nama: item.nama,
                  hpp: item.hpp,
                  harga: item.hargaJual,
                  biayaTetap: item.biayaTetap,
                  modalAwal: item.modalAwal,
                  penjualan: item.targetPenjualan,
                };
                return (
                  <div key={`${item.nama}-${index}`} className="rounded-md border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_0_#1E2A1F]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{item.namaUsaha || "Usaha saya"}</p>
                        <h2 className="font-display text-xl font-semibold text-ink">{item.nama}</h2>
                      </div>
                      <button onClick={() => hapus(index)} className="font-mono text-xs text-ledger underline">
                        Hapus
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-muted sm:grid-cols-3">
                      <span>
                        Modal awal
                        <br />
                        <b className="text-ink">{rupiah(item.modalAwal ?? 0)}</b>
                      </span>
                      <span>
                        HPP
                        <br />
                        <b className="text-ink">{rupiah(item.hpp)}</b>
                      </span>
                      <span>
                        Harga jual
                        <br />
                        <b className="text-ink">{rupiah(item.hargaJual)}</b>
                      </span>
                      <span>
                        Laba / unit
                        <br />
                        <b className="text-forest">{rupiah(item.hargaJual - item.hpp)}</b>
                      </span>
                      {item.biayaTetap !== undefined && item.biayaTetap > 0 && (
                        <span>
                          Biaya tetap
                          <br />
                          <b className="text-ink">{rupiah(item.biayaTetap)}</b>
                        </span>
                      )}
                      <span>
                        Target jual
                        <br />
                        <b className="text-ink">{item.targetPenjualan} unit/hari</b>
                      </span>
                      <span>
                        Target laba
                        <br />
                        <b className="text-ink">{rupiah(item.targetLaba)}</b>
                      </span>
                      <span>
                        Balik modal
                        <br />
                        <b className="text-ink">{item.bep > 0 ? `${item.bep} unit terjual` : "-"}</b>
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={hrefSimulasi(angka, "usaha-saya", item.jenis)} className={linkAksi}>
                        Buka di Simulasi →
                      </Link>
                      <Link href={hrefHPP(item)} className={linkAksi}>
                        Hitung HPP →
                      </Link>
                      <Link href={hrefBEP(angka)} className={linkAksi}>
                        Cek BEP →
                      </Link>
                      <Link href={hrefTarget(angka)} className={linkAksi}>
                        Target Cuan →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
            {usaha.length > 0 && (
              <p className="font-body text-xs text-muted">
                Mau menambah usaha lain?{" "}
                <Link href="/analisis-usaha" className="font-semibold text-forest underline">
                  Cari ide usaha
                </Link>{" "}
                atau{" "}
                <Link href="/template-usaha" className="font-semibold text-forest underline">
                  lihat template
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
