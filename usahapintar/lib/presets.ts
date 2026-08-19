export type BahanPreset = {
  nama: string;
  jumlah: number;
  harga: number;
};

export type JenisUsaha = {
  id: string;
  label: string;
  bahanLabel: string;
  overheadLabel: string;
  satuanUnit: string; // e.g. "pcs", "potong", "layanan"
  contohBahan: BahanPreset[];
  tenagaKerja: number;
  overhead: number;
  jumlahProduksi: number;
};

export const jenisUsahaList: JenisUsaha[] = [
  {
    id: "kuliner",
    label: "Kuliner",
    bahanLabel: "Bahan baku",
    overheadLabel: "Overhead (gas, listrik, kemasan)",
    satuanUnit: "porsi/pcs",
    contohBahan: [
      { nama: "Tepung terigu", jumlah: 2, harga: 12000 },
      { nama: "Gula pasir", jumlah: 1, harga: 15000 },
    ],
    tenagaKerja: 30000,
    overhead: 10000,
    jumlahProduksi: 20,
  },
  {
    id: "konveksi",
    label: "Konveksi",
    bahanLabel: "Bahan & material",
    overheadLabel: "Overhead (listrik, sewa mesin, benang)",
    satuanUnit: "potong",
    contohBahan: [
      { nama: "Kain (meter)", jumlah: 3, harga: 25000 },
      { nama: "Benang & aksesoris", jumlah: 1, harga: 8000 },
    ],
    tenagaKerja: 40000,
    overhead: 15000,
    jumlahProduksi: 10,
  },
  {
    id: "kerajinan",
    label: "Kerajinan",
    bahanLabel: "Bahan kerajinan",
    overheadLabel: "Overhead (listrik, alat, penyusutan)",
    satuanUnit: "buah",
    contohBahan: [
      { nama: "Bahan dasar (kayu/rotan/kain)", jumlah: 1, harga: 20000 },
      { nama: "Cat/pelapis/finishing", jumlah: 1, harga: 10000 },
    ],
    tenagaKerja: 25000,
    overhead: 8000,
    jumlahProduksi: 5,
  },
  {
    id: "jasa",
    label: "Jasa",
    bahanLabel: "Alat & bahan habis pakai",
    overheadLabel: "Overhead (listrik, transportasi, sewa alat)",
    satuanUnit: "layanan",
    contohBahan: [{ nama: "Bahan/alat habis pakai", jumlah: 1, harga: 15000 }],
    tenagaKerja: 60000,
    overhead: 10000,
    jumlahProduksi: 1,
  },
  {
    id: "digital",
    label: "Jasa Digital",
    bahanLabel: "Biaya operasional bulanan",
    overheadLabel: "Overhead (software, cloud storage, langganan tools)",
    satuanUnit: "proyek",
    contohBahan: [
      { nama: "Kuota internet/WiFi (bulanan)", jumlah: 1, harga: 300000 },
      { nama: "Listrik (alokasi kerja, bulanan)", jumlah: 1, harga: 150000 },
    ],
    tenagaKerja: 500000,
    overhead: 100000,
    jumlahProduksi: 4,
  },
  {
    id: "umum",
    label: "Lainnya",
    bahanLabel: "Bahan baku",
    overheadLabel: "Overhead (listrik, sewa, dll)",
    satuanUnit: "unit",
    contohBahan: [{ nama: "", jumlah: 1, harga: 0 }],
    tenagaKerja: 0,
    overhead: 0,
    jumlahProduksi: 1,
  },
];
