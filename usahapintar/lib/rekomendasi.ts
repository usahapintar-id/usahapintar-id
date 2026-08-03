export type ProdukAfiliasi = {
  nama: string;
  deskripsi: string;
  link: string; // GANTI dengan link afiliasi Shopee Anda
  gambar?: string; // opsional: URL gambar produk
};

export type RekomendasiJenisUsaha = {
  jenisUsahaId: string; // harus cocok dengan id di presets.ts
  produk: ProdukAfiliasi[];
};

// PENTING: Ganti setiap "link" di bawah ini dengan link afiliasi Shopee asli Anda.
// Cara ambil link: buka produk di aplikasi Shopee > tombol Bagikan > salin link afiliasi.
export const rekomendasiProduk: RekomendasiJenisUsaha[] = [
  {
    jenisUsahaId: "kuliner",
    produk: [
      {
        nama: "Plastik Kemasan Makanan",
        deskripsi: "Kemasan food grade untuk produk kuliner",
        link: "https://shp.ee/GANTI-LINK-1",
      },
      {
        nama: "Sealer / Mesin Press Plastik",
        deskripsi: "Alat press kemasan supaya lebih rapi dan awet",
        link: "https://shp.ee/GANTI-LINK-2",
      },
      {
        nama: "Stiker Label Produk",
        deskripsi: "Label kemasan custom untuk branding produk",
        link: "https://shp.ee/GANTI-LINK-3",
      },
      {
        nama: "Timbangan Digital Dapur",
        deskripsi: "Untuk takaran bahan baku yang presisi",
        link: "https://shp.ee/GANTI-LINK-4",
      },
      {
        nama: "Kotak Makan / Food Container",
        deskripsi: "Wadah kemasan untuk katering atau pesan antar",
        link: "https://shp.ee/GANTI-LINK-15",
      },
      {
        nama: "Vacuum Sealer",
        deskripsi: "Untuk kemasan frozen food lebih tahan lama",
        link: "https://shp.ee/GANTI-LINK-16",
      },
      {
        nama: "Termometer Makanan",
        deskripsi: "Menjaga konsistensi suhu masakan/adonan",
        link: "https://shp.ee/GANTI-LINK-17",
      },
      {
        nama: "Paper Bag / Kantong Kertas Custom",
        deskripsi: "Kemasan ramah lingkungan untuk take away",
        link: "https://shp.ee/GANTI-LINK-18",
      },
    ],
  },
  {
    jenisUsahaId: "konveksi",
    produk: [
      {
        nama: "Label & Hangtag Baju",
        deskripsi: "Label custom untuk branding produk konveksi",
        link: "https://shp.ee/GANTI-LINK-5",
      },
      {
        nama: "Plastik Packing Baju",
        deskripsi: "Kemasan rapi untuk pengiriman produk",
        link: "https://shp.ee/GANTI-LINK-6",
      },
      {
        nama: "Gunting Kain",
        deskripsi: "Alat potong kain kualitas jahit profesional",
        link: "https://shp.ee/GANTI-LINK-7",
      },
      {
        nama: "Benang Jahit & Obras",
        deskripsi: "Berbagai warna untuk kebutuhan produksi",
        link: "https://shp.ee/GANTI-LINK-19",
      },
      {
        nama: "Meteran Jahit",
        deskripsi: "Alat ukur standar untuk pola pakaian",
        link: "https://shp.ee/GANTI-LINK-20",
      },
      {
        nama: "Setrika Uap",
        deskripsi: "Finishing rapi sebelum produk dikemas",
        link: "https://shp.ee/GANTI-LINK-21",
      },
      {
        nama: "Hanger & Standing Rack",
        deskripsi: "Untuk display dan penyimpanan produk jadi",
        link: "https://shp.ee/GANTI-LINK-22",
      },
    ],
  },
  {
    jenisUsahaId: "kerajinan",
    produk: [
      {
        nama: "Bubble Wrap",
        deskripsi: "Pelindung produk kerajinan saat pengiriman",
        link: "https://shp.ee/GANTI-LINK-8",
      },
      {
        nama: "Kardus Packing",
        deskripsi: "Berbagai ukuran untuk kemasan produk kerajinan",
        link: "https://shp.ee/GANTI-LINK-9",
      },
      {
        nama: "Lem Tembak & Isi Ulang",
        deskripsi: "Alat perekat serbaguna untuk kerajinan",
        link: "https://shp.ee/GANTI-LINK-10",
      },
      {
        nama: "Cat Akrilik & Kuas",
        deskripsi: "Untuk finishing dan pewarnaan produk",
        link: "https://shp.ee/GANTI-LINK-23",
      },
      {
        nama: "Cutter & Gunting Kerajinan",
        deskripsi: "Alat potong presisi untuk bahan kerajinan",
        link: "https://shp.ee/GANTI-LINK-24",
      },
      {
        nama: "Pernis / Clear Coat Finishing",
        deskripsi: "Lapisan pelindung untuk hasil akhir produk",
        link: "https://shp.ee/GANTI-LINK-25",
      },
      {
        nama: "Box Display Produk",
        deskripsi: "Kemasan presentasi untuk produk kerajinan premium",
        link: "https://shp.ee/GANTI-LINK-26",
      },
    ],
  },
  {
    jenisUsahaId: "jasa",
    produk: [
      {
        nama: "Kartu Nama Custom",
        deskripsi: "Cetak kartu nama untuk branding jasa Anda",
        link: "https://shp.ee/GANTI-LINK-11",
      },
      {
        nama: "Banner & Spanduk",
        deskripsi: "Media promosi untuk usaha jasa",
        link: "https://shp.ee/GANTI-LINK-12",
      },
      {
        nama: "Tripod & Ring Light",
        deskripsi: "Untuk dokumentasi/konten promosi jasa",
        link: "https://shp.ee/GANTI-LINK-27",
      },
      {
        nama: "Map & Amplop Custom",
        deskripsi: "Untuk dokumen dan proposal jasa profesional",
        link: "https://shp.ee/GANTI-LINK-28",
      },
      {
        nama: "Mesin Print Portable",
        deskripsi: "Cetak dokumen/nota di lokasi kerja",
        link: "https://shp.ee/GANTI-LINK-29",
      },
    ],
  },
  {
    jenisUsahaId: "umum",
    produk: [
      {
        nama: "Nota / Buku Kwitansi",
        deskripsi: "Untuk pencatatan transaksi usaha",
        link: "https://shp.ee/GANTI-LINK-13",
      },
      {
        nama: "Kalkulator Sederhana",
        deskripsi: "Alat hitung untuk operasional usaha sehari-hari",
        link: "https://shp.ee/GANTI-LINK-14",
      },
      {
        nama: "Timbangan Digital Serbaguna",
        deskripsi: "Untuk berbagai kebutuhan pengukuran usaha",
        link: "https://shp.ee/GANTI-LINK-30",
      },
      {
        nama: "Lakban & Alat Packing",
        deskripsi: "Perlengkapan dasar untuk pengiriman produk",
        link: "https://shp.ee/GANTI-LINK-31",
      },
      {
        nama: "Rak Penyimpanan Stok",
        deskripsi: "Menata bahan baku dan produk jadi lebih rapi",
        link: "https://shp.ee/GANTI-LINK-32",
      },
    ],
  },
];

export function getRekomendasiByJenisUsaha(jenisUsahaId: string) {
  return (
    rekomendasiProduk.find((r) => r.jenisUsahaId === jenisUsahaId)?.produk ??
    []
  );
}
