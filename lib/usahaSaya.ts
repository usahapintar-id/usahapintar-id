import { bacaJSON, simpanJSON } from "./storage";
import { hitungRingkasan } from "./hitung";

// Satu bentuk data "Usaha Saya" untuk semua halaman (Simulasi, BEP, Target Cuan, HPP, Usaha Saya).
export type UsahaTersimpan = {
  nama: string;
  namaUsaha?: string;
  hpp: number; // HPP per unit tanpa overhead (bahan + tenaga kerja)
  hargaJual: number;
  targetPenjualan: number; // unit per hari
  targetLaba: number;
  bep: number; // unit terjual untuk balik modal awal (0 jika tidak bisa dihitung)
  modalAwal?: number;
  biayaTetap?: number; // biaya tetap per bulan, termasuk overhead
  usahaId?: string; // id template, bila berasal dari Template Usaha
  jenis?: string; // jenis usaha untuk Kalkulator HPP
};

export const USAHA_SAYA_KEY = "cuankit_usaha_saya";

export function bacaUsahaSaya(): UsahaTersimpan[] {
  const data = bacaJSON<UsahaTersimpan[]>(USAHA_SAYA_KEY, []);
  return Array.isArray(data) ? data : [];
}

type MasukanEntri = {
  nama: string;
  namaUsaha?: string;
  hpp: number;
  harga: number;
  penjualan: number;
  modalAwal?: number; // undefined = tidak diketahui halaman ini; data lama dipertahankan
  biayaTetap?: number;
  targetLaba?: number; // bila kosong dipakai laba bersih bulanan hasil hitung
  usahaId?: string;
  jenis?: string;
};

export function buatEntriUsaha(m: MasukanEntri): UsahaTersimpan {
  const r = hitungRingkasan({
    modalAwal: m.modalAwal ?? 0,
    biayaTetap: m.biayaTetap ?? 0,
    hpp: m.hpp,
    harga: m.harga,
    penjualanHarian: m.penjualan,
  });
  return {
    nama: m.nama,
    namaUsaha: m.namaUsaha ?? m.nama,
    hpp: Math.round(m.hpp),
    hargaJual: Math.round(m.harga),
    targetPenjualan: m.penjualan,
    targetLaba: Math.round(m.targetLaba ?? r.labaBersihBulanan),
    modalAwal: m.modalAwal,
    biayaTetap: m.biayaTetap,
    bep: r.balikModalUnit,
    usahaId: m.usahaId,
    jenis: m.jenis,
  };
}

// Nama yang sama = usaha yang sama: data lama diperbarui, bukan dobel.
// Isian yang tidak diketahui halaman penyimpan (undefined) tetap memakai data lama.
export function simpanUsahaSaya(entri: UsahaTersimpan): "baru" | "diperbarui" | "gagal" {
  const daftar = bacaUsahaSaya();
  const lama = daftar.find((u) => u.nama === entri.nama);
  const terdefinisi = Object.fromEntries(Object.entries(entri).filter(([, v]) => v !== undefined)) as Partial<UsahaTersimpan>;
  const final: UsahaTersimpan = { ...(lama ?? {}), ...terdefinisi } as UsahaTersimpan;
  // Balik modal dihitung ulang dari data gabungan supaya tetap benar bila modal berasal dari data lama.
  const laba = final.hargaJual - final.hpp;
  const modal = final.modalAwal ?? 0;
  final.bep = laba > 0 && modal > 0 ? Math.ceil(modal / laba) : 0;
  const berikutnya = lama ? daftar.map((u) => (u === lama ? final : u)) : [...daftar, final];
  return simpanJSON(USAHA_SAYA_KEY, berikutnya) ? (lama ? "diperbarui" : "baru") : "gagal";
}

// ---- Tautan antar halaman: angka ikut terbawa ----
type Param = string | number | undefined;
export function buatQuery(p: Record<string, Param>): string {
  return Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== "" && !(typeof v === "number" && !(v > 0)))
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
}

type AngkaUsaha = { nama?: string; hpp: number; harga: number; biayaTetap?: number; modalAwal?: number; penjualan?: number };

export const hrefSimulasi = (a: AngkaUsaha, dari: "bep" | "target" | "usaha-saya", jenis?: string) =>
  `/simulasi?${buatQuery({ dari, nama: a.nama, hpp: Math.round(a.hpp), harga: Math.round(a.harga), modalAwal: a.modalAwal, biayaTetap: a.biayaTetap, penjualan: a.penjualan, jenis })}`;

export const hrefBEP = (a: AngkaUsaha) =>
  `/kalkulator-bep?${buatQuery({ nama: a.nama, hpp: Math.round(a.hpp), harga: Math.round(a.harga), biayaTetap: a.biayaTetap, modalAwal: a.modalAwal, penjualan: a.penjualan })}`;

export const hrefTarget = (a: AngkaUsaha) =>
  `/target-cuan?${buatQuery({ nama: a.nama, hpp: Math.round(a.hpp), harga: Math.round(a.harga), biayaTetap: a.biayaTetap })}`;

export function hrefHPP(u: Pick<UsahaTersimpan, "usahaId" | "jenis">): string {
  if (u.usahaId) return `/kalkulator-hpp?usaha=${encodeURIComponent(u.usahaId)}#kalkulator`;
  if (u.jenis) return `/kalkulator-hpp?jenis=${encodeURIComponent(u.jenis)}#kalkulator`;
  return "/kalkulator-hpp#kalkulator";
}
