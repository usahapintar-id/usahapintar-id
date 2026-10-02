import { bacaJSON } from "./storage";

export type RingkasanHPP = {
  nama: string;
  hpp: number;
  hargaJual: number;
  labaPerUnit: number;
  biayaProduksi: number;
  hppVariabel?: number; // HPP per unit tanpa overhead (bahan + tenaga kerja)
  jenisUsahaId: string;
};

export const RINGKASAN_HPP_KEY = "cuankit_hpp_ringkasan";

export function bacaRingkasanHPP(): RingkasanHPP | null {
  const data = bacaJSON<RingkasanHPP | null>(RINGKASAN_HPP_KEY, null);
  return data && typeof data.hpp === "number" && typeof data.hargaJual === "number" ? data : null;
}
