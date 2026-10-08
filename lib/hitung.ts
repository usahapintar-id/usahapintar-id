// Fungsi hitung murni (tanpa React) agar mudah dites dan dipakai ulang di
// Simulasi, Kalkulator BEP, homepage, dan Usaha Saya.
//
// Definisi yang dipakai di seluruh situs:
// - Laba per unit        = harga jual - HPP
// - BEP bulanan (unit)   = biaya tetap per bulan / laba per unit
//                          (jumlah terjual per bulan agar biaya tetap tertutup)
// - Balik modal (unit)   = modal awal / laba per unit
// - Balik modal (bulan)  = modal awal / laba bersih per bulan

export type MasukanRingkasan = {
  modalAwal: number;
  biayaTetap: number; // per bulan
  hpp: number;
  harga: number;
  penjualanHarian: number;
  hariPerBulan?: number;
};

export type Ringkasan = {
  labaPerUnit: number;
  marginPersen: number;
  labaKotorBulanan: number;
  labaBersihBulanan: number;
  bepUnitBulanan: number; // 0 jika tidak bisa dihitung
  balikModalUnit: number; // 0 jika tidak bisa dihitung
  balikModalBulan: number; // 0 jika tidak bisa dihitung
};

export function hitungRingkasan(m: MasukanRingkasan): Ringkasan {
  const hari = m.hariPerBulan ?? 30;
  const labaPerUnit = m.harga - m.hpp;
  const labaKotorBulanan = labaPerUnit * m.penjualanHarian * hari;
  const labaBersihBulanan = labaKotorBulanan - m.biayaTetap;
  const bisaHitung = labaPerUnit > 0;
  return {
    labaPerUnit,
    marginPersen: m.harga > 0 ? (labaPerUnit / m.harga) * 100 : 0,
    labaKotorBulanan,
    labaBersihBulanan,
    bepUnitBulanan: bisaHitung && m.biayaTetap > 0 ? Math.ceil(m.biayaTetap / labaPerUnit) : 0,
    balikModalUnit: bisaHitung && m.modalAwal > 0 ? Math.ceil(m.modalAwal / labaPerUnit) : 0,
    balikModalBulan: labaBersihBulanan > 0 && m.modalAwal > 0 ? m.modalAwal / labaBersihBulanan : 0,
  };
}

export function formatRupiah(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "Rp 0";
  const bulat = Math.round(value);
  const tanda = bulat < 0 ? "-" : "";
  return `${tanda}Rp ${Math.abs(bulat).toLocaleString("id-ID")}`;
}

// Isian angka dari kolom input: kosong, teks, atau negatif menjadi 0.
// Atribut min={0} saja tidak menghalangi pengguna mengetik tanda minus.
export function angkaNonNegatif(nilai: string): number {
  const n = Number(nilai);
  return isFinite(n) && n > 0 ? n : 0;
}

// ---- Target laba ----
// Unit per bulan = (target laba bersih + biaya tetap) / laba per unit.
// Biaya tetap harus ditutup dulu sebelum ada laba bersih.

export type HasilTargetLaba = {
  labaPerUnit: number;
  bisaHitung: boolean;
  labaKotorDibutuhkan: number; // target laba bersih + biaya tetap
  unitBulanan: number;
  unitHarian: number; // dibulatkan ke atas
  unitMingguan: number;
  omzetBulanan: number;
  omzetHarian: number; // rata-rata per hari
  labaBersihEstimasi: number;
};

export function hitungTargetLaba(
  targetLabaBersih: number,
  biayaTetap: number,
  harga: number,
  hpp: number,
  hari = 30
): HasilTargetLaba {
  const labaPerUnit = harga - hpp;
  const labaKotorDibutuhkan = Math.max(0, targetLabaBersih) + Math.max(0, biayaTetap);
  const bisaHitung = labaPerUnit > 0;
  const unitBulanan = bisaHitung ? Math.ceil(labaKotorDibutuhkan / labaPerUnit) : 0;
  const unitHarian = unitBulanan > 0 ? Math.ceil(unitBulanan / hari) : 0;
  return {
    labaPerUnit,
    bisaHitung,
    labaKotorDibutuhkan,
    unitBulanan,
    unitHarian,
    unitMingguan: Math.ceil((unitBulanan * 7) / hari),
    omzetBulanan: unitBulanan * harga,
    omzetHarian: (unitBulanan * harga) / hari,
    labaBersihEstimasi: unitBulanan * labaPerUnit - biayaTetap,
  };
}

// ---- Pinjaman ----

export type MetodeBunga = "flat" | "efektif";

export function hitungPinjaman(pokok: number, bungaTahunanPersen: number, tenorBulan: number, metode: MetodeBunga) {
  const n = Math.max(1, Math.round(tenorBulan));
  if (metode === "flat") {
    const totalBunga = pokok * (bungaTahunanPersen / 100) * (n / 12);
    return { cicilan: (pokok + totalBunga) / n, totalBunga, totalBayar: pokok + totalBunga };
  }
  // Anuitas (bunga efektif, cicilan tetap)
  const r = bungaTahunanPersen / 100 / 12;
  const cicilan = r === 0 ? pokok / n : (pokok * r) / (1 - Math.pow(1 + r, -n));
  const totalBayar = cicilan * n;
  return { cicilan, totalBunga: totalBayar - pokok, totalBayar };
}
