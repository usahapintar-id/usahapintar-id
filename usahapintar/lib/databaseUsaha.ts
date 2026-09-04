export type DataUsaha = {
  id: string;
  nama: string;
  kategori: "Kuliner" | "Dagang Online" | "Jasa Digital" | "Produksi";
  deskripsi: string;
  modalAwal: number;
  biayaTetapBulanan: number;
  hpp: number;
  hargaJual: number;
  penjualanHarian: number;
  kebutuhanAlat: string[];
  kebutuhanWaktu: string;
  kebutuhanKeterampilan: string[];
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

const databaseKuliner: DataUsaha[] = dataAwalUsaha.map(([id, nama, modalAwal, hpp, hargaJual, tingkatKesulitan]) => ({
  id,
  nama,
  kategori: "Kuliner",
  deskripsi: `Template awal ${nama.toLowerCase()} untuk simulasi skala rumahan.`,
  modalAwal,
  biayaTetapBulanan: Math.round(modalAwal * 0.35),
  hpp,
  hargaJual,
  penjualanHarian: 20,
  kebutuhanAlat: ["Kompor atau alat produksi utama", "Wadah dan kemasan", "Alat ukur sederhana"],
  kebutuhanWaktu: "Sampingan atau paruh waktu",
  kebutuhanKeterampilan: ["Mengolah produk", "Menjaga rasa dan ukuran tetap konsisten"],
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

const databaseTambahan: DataUsaha[] = [
  {
    id: "jasa-desain",
    nama: "Jasa Desain UMKM",
    kategori: "Jasa Digital",
    deskripsi: "Template jasa desain sederhana untuk kebutuhan promosi UMKM.",
    modalAwal: 500000,
    biayaTetapBulanan: 150000,
    hpp: 50000,
    hargaJual: 250000,
    penjualanHarian: 1,
    kebutuhanAlat: ["Laptop atau ponsel", "Aplikasi desain", "Internet"],
    kebutuhanWaktu: "Sampingan atau paruh waktu",
    kebutuhanKeterampilan: ["Desain grafis", "Komunikasi dengan klien"],
    tingkatKesulitan: "Menengah",
    alasan: "Cocok untuk pemilik keterampilan desain yang ingin mulai dari proyek kecil.",
    bahan: [{ nama: "Kuota dan aset desain", jumlah: 1, harga: 50000 }],
    tenagaKerja: 0,
    overhead: 0,
    jumlahProduksi: 1,
    satuan: "proyek",
  },
  {
    id: "konveksi-rumahan",
    nama: "Konveksi Rumahan",
    kategori: "Produksi",
    deskripsi: "Template produksi pakaian skala kecil dari rumah.",
    modalAwal: 3500000,
    biayaTetapBulanan: 750000,
    hpp: 75000,
    hargaJual: 125000,
    penjualanHarian: 5,
    kebutuhanAlat: ["Mesin jahit", "Meja kerja", "Alat potong"],
    kebutuhanWaktu: "Paruh waktu atau penuh waktu",
    kebutuhanKeterampilan: ["Menjahit", "Mengatur ukuran dan kualitas"],
    tingkatKesulitan: "Menengah",
    alasan: "Bisa dimulai dari pesanan kecil dan dikembangkan setelah kualitas stabil.",
    bahan: [{ nama: "Kain dan aksesoris", jumlah: 1, harga: 60000 }],
    tenagaKerja: 10000,
    overhead: 5000,
    jumlahProduksi: 1,
    satuan: "potong",
  },
  {
    id: "reseller-fashion",
    nama: "Reseller Fashion Online",
    kategori: "Dagang Online",
    deskripsi: "Template jualan fashion dengan stok terbatas atau pre-order.",
    modalAwal: 800000,
    biayaTetapBulanan: 200000,
    hpp: 70000,
    hargaJual: 100000,
    penjualanHarian: 3,
    kebutuhanAlat: ["Ponsel", "Internet", "Kemasan"],
    kebutuhanWaktu: "Sampingan",
    kebutuhanKeterampilan: ["Jualan", "Membuat konten produk"],
    tingkatKesulitan: "Mudah",
    alasan: "Modal dapat dikendalikan melalui pre-order dan promosi ke jaringan terdekat.",
    bahan: [{ nama: "Stok atau modal talangan", jumlah: 1, harga: 70000 }],
    tenagaKerja: 0,
    overhead: 0,
    jumlahProduksi: 1,
    satuan: "produk",
  },
];

export const databaseUsaha: DataUsaha[] = [...databaseKuliner, ...databaseTambahan];

export function getUsahaById(id: string | null | undefined) {
  return databaseUsaha.find((usaha) => usaha.id === id);
}
