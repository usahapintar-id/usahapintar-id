export type RingkasanHPP = {
  nama: string;
  hpp: number;
  hargaJual: number;
  labaPerUnit: number;
  biayaProduksi: number;
  jenisUsahaId: string;
};

export const RINGKASAN_HPP_KEY = "cuankit_hpp_ringkasan";

export function bacaRingkasanHPP(): RingkasanHPP | null {
  try {
    const value = localStorage.getItem(RINGKASAN_HPP_KEY);
    return value ? (JSON.parse(value) as RingkasanHPP) : null;
  } catch {
    return null;
  }
}
