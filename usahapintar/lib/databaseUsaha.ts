export type DataUsaha = {
  id: string;
  nama: string;
  kategori: "Kuliner";
  deskripsi: string;
  modalAwal: number;
  biayaTetap: number;
  hpp: number;
  hargaJual: number;
  penjualanHarian: number;
  tingkatKesulitan: "Mudah" | "Menengah" | "Sulit";
  alasan: string;
  bahan: { nama: string; jumlah: number; harga: number }[];
  tenagaKerja: number;
  overhead: number;
  jumlahProduksi: number;
  satuan: string;
};

// Angka awal adalah contoh konservatif dan seluruhnya dapat diedit di HPP.
const dataAwalUsaha: [string, string, number, number, number, DataUsaha["tingkatKesulitan"]][] = [
  ["nasi-goreng", "Nasi Goreng", 1500000, 9000, 15000, "Mudah"],
  ["ayam-geprek", "Ayam Geprek", 2500000, 11000, 18000, "Menengah"],
  ["ayam-bakar", "Ayam Bakar", 3000000, 13000, 22000, "Menengah"],
  ["soto", "Soto", 2500000, 9000, 16000, "Menengah"],
  ["bakso", "Bakso", 3500000, 10000, 18000, "Menengah"],
  ["mie-ayam", "Mie Ayam", 2500000, 8000, 15000, "Mudah"],
  ["seblak", "Seblak", 1200000, 7000, 14000, "Mudah"],
  ["rice-bowl", "Rice Bowl", 2000000, 11000, 20000, "Mudah"],
  ["gorengan", "Gorengan", 800000, 1500, 3000, "Mudah"],
  ["risol", "Risol", 1000000, 2500, 5000, "Mudah"],
  ["cireng", "Cireng", 800000, 1500, 3000, "Mudah"],
  ["es-teh-jumbo", "Es Teh Jumbo", 700000, 2000, 5000, "Mudah"],
  ["es-jeruk", "Es Jeruk", 900000, 3000, 7000, "Mudah"],
  ["kopi-minuman-sederhana", "Kopi / Minuman Sederhana", 1500000, 5000, 12000, "Mudah"],
];

export const databaseUsaha: DataUsaha[] = dataAwalUsaha.map(([id, nama, modalAwal, hpp, hargaJual, tingkatKesulitan]) => ({
  id,
  nama,
  kategori: "Kuliner",
  deskripsi: `Template awal ${nama.toLowerCase()} untuk simulasi skala rumahan.`,
  modalAwal,
  biayaTetap: Math.round(modalAwal * 0.35),
  hpp,
  hargaJual,
  penjualanHarian: 20,
  tingkatKesulitan,
  alasan: `Cocok diuji dari skala kecil. HPP dan harga jual ${nama.toLowerCase()} di bawah adalah estimasi awal, bukan patokan harga pasar.`,
  bahan: [
    { nama: "Bahan utama", jumlah: 1, harga: Math.round(hpp * 0.65) },
    { nama: "Bumbu dan pelengkap", jumlah: 1, harga: Math.round(hpp * 0.35) },
  ],
  tenagaKerja: 0,
  overhead: 0,
  jumlahProduksi: 1,
  satuan: "porsi/pcs",
}));

export function getUsahaById(id: string | null | undefined) {
  return databaseUsaha.find((usaha) => usaha.id === id);
}
