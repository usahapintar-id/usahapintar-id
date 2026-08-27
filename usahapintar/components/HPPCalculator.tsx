"use client";

import React, { useState, useEffect } from "react";
// Import html2pdf secara dinamis untuk menghindari error SSR di Next.js
import dynamic from "next/dynamic";

interface Bahan {
  nama: string;
  jumlah: number | "";
  harga: number | "";
}

export default function HPPCalculator() {
  // 1. State dengan inisialisasi dari localStorage (jika ada)
  const [bahanBaku, setBahanBaku] = useState<Bahan[]>([
    { nama: "", jumlah: "", harga: "" },
  ]);
  const [tenagaKerja, setTenagaKerja] = useState<number | "">(0);
  const [overhead, setOverhead] = useState<number | "">(0);
  const [jumlahUnit, setJumlahUnit] = useState<number | "">(1);
  const [margin, setMargin] = useState<number>(40);

  // Muat data dari localStorage saat komponen pertama kali dibuka
  useEffect(() => {
    const savedData = localStorage.getItem("cuankit_hpp_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.bahanBaku) setBahanBaku(parsed.bahanBaku);
        if (parsed.tenagaKerja !== undefined) setTenagaKerja(parsed.tenagaKerja);
        if (parsed.overhead !== undefined) setOverhead(parsed.overhead);
        if (parsed.jumlahUnit !== undefined) setJumlahUnit(parsed.jumlahUnit);
        if (parsed.margin !== undefined) setMargin(parsed.margin);
      } catch (e) {
        console.error("Gagal memuat data lokal", e);
      }
    }
  }, []);

  // Simpan otomatis ke localStorage setiap ada perubahan state
  useEffect(() => {
    const dataToSave = {
      bahanBaku,
      tenagaKerja,
      overhead,
      jumlahUnit,
      margin,
    };
    localStorage.setItem("cuankit_hpp_data", JSON.stringify(dataToSave));
  }, [bahanBaku, tenagaKerja, overhead, jumlahUnit, margin]);

  // Fungsi tambah/hapus baris bahan baku
  const tambahBahan = () => {
    setBahanBaku([...bahanBaku, { nama: "", jumlah: "", harga: "" }]);
  };

  const hapusBahan = (index: number) => {
    const list = [...bahanBaku];
    list.splice(index, 1);
    setBahanBaku(list);
  };

  const updateBahan = (index: number, field: keyof Bahan, value: any) => {
    const list = [...bahanBaku];
    list[index][field] = value;
    setBahanBaku(list);
  };

  // Perhitungan HPP
  const totalBahanBaku = bahanBaku.reduce((acc, curr) => {
    const jml = Number(curr.jumlah) || 0;
    const hrg = Number(curr.harga) || 0;
    return acc + jml * hrg;
  }, 0);

  const tKerja = Number(tenagaKerja) || 0;
  const tOverhead = Number(overhead) || 0;
  const tUnit = Number(jumlahUnit) || 1;

  const totalModal = totalBahanBaku + tKerja + tOverhead;
  const hppPerUnit = tUnit > 0 ? totalModal / tUnit : 0;
  const hargaJualSaran = hppPerUnit / (1 - margin / 100);
  const untungPerUnit = hargaJualSaran - hppPerUnit;
  const totalUntung = untungPerUnit * tUnit;

  // 2. Fungsi Unduh / Ekspor ke PDF
  const handleDownloadPDF = () => {
    const element = document.getElementById("area-ringkasan-hpp");
    if (!element) return;

    // Panggil library html2pdf secara dinamis
    import("html2pdf.js").then((html2pdf) => {
      const options = {
        margin: 10,
        filename: "Rincian-HPP-CuanKit.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf.default().from(element).set(options).save();
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Kalkulator HPP UMKM CuanKit
      </h2>

      {/* Bagian Input Bahan Baku */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-700">1. Bahan Baku</h3>
        {bahanBaku.map((bahan, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Nama bahan (contoh: Tepung)"
              value={bahan.nama}
              onChange={(e) => updateBahan(index, "nama", e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={bahan.jumlah}
              onChange={(e) => updateBahan(index, "jumlah", e.target.value)}
              className="border p-2 rounded w-24"
            />
            <input
              type="number"
              placeholder="Harga Satuan"
              value={bahan.harga}
              onChange={(e) => updateBahan(index, "harga", e.target.value)}
              className="border p-2 rounded w-32"
            />
            {bahanBaku.length > 1 && (
              <button
                onClick={() => hapusBahan(index)}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          onClick={tambahBahan}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + Tambah Bahan
        </button>
      </div>

      {/* Bagian Biaya Lain & Produksi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-700">
            Biaya Tenaga Kerja (per produksi)
          </label>
          <input
            type="number"
            value={tenagaKerja}
            onChange={(e) => setTenagaKerja(e.target.value === "" ? "" : Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-700">
            Biaya Overhead (Listrik, Gas, Kemasan)
          </label>
          <input
            type="number"
            value={overhead}
            onChange={(e) => setOverhead(e.target.value === "" ? "" : Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-700">
            Jumlah Unit Dihasilkan (Porsi/Pcs)
          </label>
          <input
            type="number"
            value={jumlahUnit}
            onChange={(e) => setJumlahUnit(e.target.value === "" ? "" : Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-700">
            Margin Keuntungan (%) : {margin}%
          </label>
          <input
            type="range"
            min="5"
            max="90"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Area Ringkasan Hasil (Bagian yang akan diekspor ke PDF) */}
      <div
        id="area-ringkasan-hpp"
        className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-3"
      >
        <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
          Ringkasan Hasil Perhitungan HPP
        </h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Bahan Baku:</span>
          <span className="font-medium">Rp {totalBahanBaku.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Modal Produksi:</span>
          <span className="font-medium">Rp {totalModal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-800 border-t pt-2">
          <span>HPP per Unit:</span>
          <span className="text-blue-600">
            Rp {Math.round(hppPerUnit).toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold text-green-700 bg-green-50 p-3 rounded-lg">
          <span>Harga Jual Disarankan:</span>
          <span>Rp {Math.round(hargaJualSaran).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Estimasi Total Untung ({tUnit} unit):</span>
          <span className="font-semibold text-gray-800">
            Rp {Math.round(totalUntung).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Tombol Unduh PDF */}
      <button
        onClick={handleDownloadPDF}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow"
      >
        Unduh Hasil (PDF)
      </button>
    </div>
  );
}