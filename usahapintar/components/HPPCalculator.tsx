"use client";

import { useMemo, useState } from "react";
import { jenisUsahaList, type JenisUsaha } from "@/lib/presets";
import RekomendasiAlat from "./RekomendasiAlat";

type Bahan = {
  id: string;
  nama: string;
  jumlah: number;
  harga: number;
};

function rupiah(n: number) {
  if (!isFinite(n) || isNaN(n)) return "Rp 0";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function bahanFromPreset(preset: JenisUsaha): Bahan[] {
  return preset.contohBahan.map((c) => ({ id: newId(), ...c }));
}

export default function HPPCalculator() {
  const [jenisUsahaId, setJenisUsahaId] = useState<string>("kuliner");
  const jenisUsaha =
    jenisUsahaList.find((j) => j.id === jenisUsahaId) ?? jenisUsahaList[0];

  const [bahan, setBahan] = useState<Bahan[]>(() =>
    bahanFromPreset(jenisUsaha)
  );
  const [tenagaKerja, setTenagaKerja] = useState<number>(jenisUsaha.tenagaKerja);
  const [overhead, setOverhead] = useState<number>(jenisUsaha.overhead);
  const [jumlahProduksi, setJumlahProduksi] = useState<number>(
    jenisUsaha.jumlahProduksi
  );
  const [margin, setMargin] = useState<number>(40);

  function pilihJenisUsaha(id: string) {
    const preset = jenisUsahaList.find((j) => j.id === id);
    if (!preset) return;
    setJenisUsahaId(id);
    setBahan(bahanFromPreset(preset));
    setTenagaKerja(preset.tenagaKerja);
    setOverhead(preset.overhead);
    setJumlahProduksi(preset.jumlahProduksi);
  }

  const totalBahan = useMemo(
    () => bahan.reduce((sum, b) => sum + b.jumlah * b.harga, 0),
    [bahan]
  );

  const totalModal = totalBahan + tenagaKerja + overhead;
  const hppPerUnit = jumlahProduksi > 0 ? totalModal / jumlahProduksi : 0;
  const hargaJual = hppPerUnit * (1 + margin / 100);
  const hargaJualDibulatkan = Math.ceil(hargaJual / 100) * 100;
  const untungPerUnit = hargaJualDibulatkan - hppPerUnit;
  const totalUntung = untungPerUnit * jumlahProduksi;

  function updateBahan(id: string, field: keyof Bahan, value: string) {
    setBahan((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              [field]: field === "nama" ? value : Number(value) || 0,
            }
          : b
      )
    );
  }

  function tambahBahan() {
    setBahan((prev) => [...prev, { id: newId(), nama: "", jumlah: 1, harga: 0 }]);
  }

  function hapusBahan(id: string) {
    setBahan((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <section id="kalkulator" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Kalkulator HPP
        </span>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink">
          Hitung biaya produksi dan harga jual, langsung di sini.
        </h2>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Isi komponen biaya di bawah. Total dan harga jual yang disarankan
          diperbarui otomatis di kolom kanan.
        </p>

        {/* Jenis usaha selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {jenisUsahaList.map((j) => (
            <button
              key={j.id}
              onClick={() => pilihJenisUsaha(j.id)}
              className={`rounded-full border px-4 py-1.5 font-body text-sm font-medium transition ${
                jenisUsahaId === j.id
                  ? "border-forest bg-forest text-paper"
                  : "border-ink/20 text-ink/70 hover:border-forest hover:text-forest"
              }`}
            >
              {j.label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-body text-xs text-muted">
          Pilih jenis usaha untuk contoh komponen biaya yang lebih sesuai.
          Semua angka tetap bisa diubah bebas.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Input side */}
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <h3 className="font-display text-base font-semibold text-ink">
              1. {jenisUsaha.bahanLabel}
            </h3>

            <div className="mt-4 space-y-3">
              <div className="hidden grid-cols-[1fr_80px_120px_32px] gap-2 px-1 font-mono text-[11px] uppercase tracking-wide text-muted sm:grid">
                <span>Nama bahan</span>
                <span>Jumlah</span>
                <span>Harga satuan</span>
                <span></span>
              </div>

              {bahan.map((b) => (
                <div
                  key={b.id}
                  className="grid grid-cols-2 gap-2 border-b border-ink/10 pb-3 sm:grid-cols-[1fr_80px_120px_32px] sm:items-center sm:border-none sm:pb-0"
                >
                  <input
                    type="text"
                    value={b.nama}
                    onChange={(e) => updateBahan(b.id, "nama", e.target.value)}
                    placeholder="Nama bahan"
                    className="col-span-2 rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-body text-sm text-ink outline-none focus:border-forest sm:col-span-1"
                  />
                  <input
                    type="number"
            onFocus={(e) => e.target.select()}
                    min={0}
                    value={b.jumlah === 0 ? "" : b.jumlah}
                    onChange={(e) => updateBahan(b.id, "jumlah", e.target.value)}
                    aria-label="Jumlah"
                    className="rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-forest"
                  />
                  <input
                    type="number"
            onFocus={(e) => e.target.select()}
                    min={0}
                    value={b.harga === 0 ? "" : b.harga}
                    onChange={(e) => updateBahan(b.id, "harga", e.target.value)}
                    aria-label="Harga satuan"
                    className="rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-forest"
                  />
                  <button
                    onClick={() => hapusBahan(b.id)}
                    aria-label={`Hapus ${b.nama || "bahan"}`}
                    className="justify-self-end rounded-sm border border-ledger/40 px-2 py-1.5 font-mono text-xs text-ledger transition hover:bg-ledger/10 sm:justify-self-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={tambahBahan}
              className="mt-4 rounded-sm border border-forest px-3 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest/10"
            >
              + Tambah bahan
            </button>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  2. Biaya lain
                </h3>
                <label className="mt-3 block font-body text-xs text-muted">
                  Tenaga kerja (per produksi)
                </label>
                <input
                  type="number"
            onFocus={(e) => e.target.select()}
                  min={0}
                  value={tenagaKerja === 0 ? "" : tenagaKerja}
                  onChange={(e) => setTenagaKerja(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-forest"
                />
                <label className="mt-3 block font-body text-xs text-muted">
                  {jenisUsaha.overheadLabel}
                </label>
                <input
                  type="number"
            onFocus={(e) => e.target.select()}
                  min={0}
                  value={overhead === 0 ? "" : overhead}
                  onChange={(e) => setOverhead(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-forest"
                />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-ink">
                  3. Produksi &amp; margin
                </h3>
                <label className="mt-3 block font-body text-xs text-muted">
                  Jumlah unit dihasilkan ({jenisUsaha.satuanUnit})
                </label>
                <input
                  type="number"
            onFocus={(e) => e.target.select()}
                  min={1}
                  value={jumlahProduksi}
                  onChange={(e) =>
                    setJumlahProduksi(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="mt-1 w-full rounded-sm border border-ink/20 bg-paper px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-forest"
                />
                <label className="mt-3 flex items-center justify-between font-body text-xs text-muted">
                  <span>Margin keuntungan</span>
                  <span className="font-mono text-forest">{margin}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="mt-2 w-full accent-forest"
                />
              </div>
            </div>
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
                <span className="text-muted">Total bahan baku</span>
                <span>{rupiah(totalBahan)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Tenaga kerja</span>
                <span>{rupiah(tenagaKerja)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Overhead</span>
                <span>{rupiah(overhead)}</span>
              </div>
              <div className="flex justify-between py-1 font-semibold">
                <span>Total modal produksi</span>
                <span>{rupiah(totalModal)}</span>
              </div>
              <div className="flex justify-between py-1 font-semibold text-forest">
                <span>HPP per {jenisUsaha.satuanUnit}</span>
                <span>{rupiah(hppPerUnit)}</span>
              </div>
            </div>

            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Harga jual disarankan
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-forest">
                {rupiah(hargaJualDibulatkan)}
              </p>
              <p className="mt-1 font-body text-xs text-muted">
                per {jenisUsaha.satuanUnit}, sudah termasuk margin {margin}%
              </p>

              <div className="mt-4 flex justify-between border-t border-dashed border-ink/20 pt-4 font-mono text-sm">
                <span className="text-muted">Untung per {jenisUsaha.satuanUnit}</span>
                <span className="text-ledger">{rupiah(untungPerUnit)}</span>
              </div>
              <div className="mt-1 flex justify-between font-mono text-sm">
                <span className="text-muted">
                  Total untung ({jumlahProduksi} {jenisUsaha.satuanUnit})
                </span>
                <span className="text-ledger">{rupiah(totalUntung)}</span>
              </div>
            </div>
          </div>
        </div>

        <RekomendasiAlat jenisUsahaId={jenisUsahaId} />
      </div>
    </section>
  );
}
