import { getUsahaById } from "./databaseUsaha";
import { getIdeById } from "./ideUsaha";

export type StateAwalSimulasi = {
  usahaId: string | null;
  kategoriId: string;
  sumberData: string;
  namaUsaha: string | null; // null = simulasi bebas tanpa nama
  catatan: string | null;
  modalAwal: number;
  biayaTetap: number;
  hpp: number;
  harga: number;
  penjualan: number;
};

type Param = string | string[] | undefined;
const satu = (p: Param) => (Array.isArray(p) ? p[0] : p);
const angka = (p: Param) => {
  const n = Number(satu(p));
  return isFinite(n) && n > 0 ? n : undefined;
};

// Dihitung di server dari searchParams supaya HTML pertama sudah berisi angka
// yang benar (tidak ada kilatan nilai default, dan pratinjau/crawler melihat data asli).
export function buatStateAwalSimulasi(searchParams: Record<string, Param>): StateAwalSimulasi {
  const usahaParam = satu(searchParams.usaha) ?? null;

  const usaha = getUsahaById(usahaParam);
  if (usaha) {
    return {
      usahaId: usaha.id,
      kategoriId: usaha.kategori === "Kuliner" ? "kuliner" : usaha.kategori === "Produksi" ? "konveksi" : usaha.kategori === "Jasa Digital" ? "digital" : "umum",
      sumberData: "Template usaha",
      namaUsaha: usaha.nama,
      catatan: null,
      modalAwal: usaha.modalAwal,
      biayaTetap: usaha.biayaTetapBulanan,
      hpp: usaha.hpp,
      harga: usaha.hargaJual,
      penjualan: usaha.penjualanHarian,
    };
  }

  const ide = getIdeById(usahaParam);
  if (ide) {
    const hppEstimasi = Math.max(1000, Math.round(ide.modalMin / 20 / 100) * 100);
    return {
      usahaId: ide.id,
      kategoriId: ide.jenisUsahaKalkulator,
      sumberData: "Estimasi kasar",
      namaUsaha: ide.nama,
      catatan:
        "Usaha ini belum punya template angka. HPP, harga jual, dan penjualan di bawah hanya tebakan awal dari perkiraan modal. Ganti dengan angka usahamu sebelum mengambil keputusan.",
      modalAwal: ide.modalMin,
      biayaTetap: Math.round(ide.modalMin * 0.35),
      hpp: hppEstimasi,
      harga: Math.ceil((hppEstimasi * 1.5) / 100) * 100,
      penjualan: 10,
    };
  }

  const hpp = angka(searchParams.hpp);
  const harga = angka(searchParams.harga);
  const dariKalkulator = hpp !== undefined || harga !== undefined;
  return {
    usahaId: null,
    kategoriId: satu(searchParams.jenis) ?? "kuliner",
    sumberData: dariKalkulator ? "Dari Kalkulator HPP" : "Simulasi bebas",
    namaUsaha: null,
    catatan: dariKalkulator
      ? null
      : "Belum ada usaha yang dipilih, jadi angka di bawah hanya contoh. Isi modal, biaya tetap, HPP, dan harga jual sesuai usahamu.",
    modalAwal: angka(searchParams.modalAwal) ?? 0,
    biayaTetap: angka(searchParams.biayaTetap) ?? 0,
    hpp: hpp ?? 8000,
    harga: harga ?? 15000,
    penjualan: angka(searchParams.penjualan) ?? 20,
  };
}
