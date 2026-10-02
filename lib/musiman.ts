export type PolaMusiman = {
  periode: string;
  nama: string;
  arah: "naik" | "turun" | "campuran";
  komoditas: string[];
  usahaTerdampak: string[];
  penjelasan: string;
};

// Catatan: Ramadan, Idulfitri, dan Iduladha mengikuti kalender Hijriah,
// jadi bulan Masehinya bergeser sekitar 10-11 hari lebih awal tiap tahun.
// Data di bawah adalah pola umum yang berulang, bukan tanggal pasti tiap tahun.
export const polaMusiman: PolaMusiman[] = [
  {
    periode: "Menjelang & selama Ramadan",
    nama: "Ramadan",
    arah: "naik",
    komoditas: ["Cabai", "Bawang merah & putih", "Daging ayam", "Minyak goreng", "Gula pasir"],
    usahaTerdampak: ["Kuliner", "Katering", "Jasa antar makanan"],
    penjelasan:
      "Permintaan bahan pangan naik karena konsumsi rumah tangga meningkat selama bulan puasa, sementara pasokan dan distribusi tidak selalu bisa mengimbangi secepat itu.",
  },
  {
    periode: "Menjelang Idulfitri (Lebaran)",
    nama: "Idulfitri",
    arah: "naik",
    komoditas: ["Bahan kue & camilan", "Daging", "Bahan pakaian/tekstil"],
    usahaTerdampak: ["Kuliner", "Konveksi & fashion", "Oleh-oleh & parsel"],
    penjelasan:
      "Selain lonjakan harga pangan, permintaan pakaian baru dan parsel/hampers ikut naik tajam. Ongkos distribusi juga naik karena bersaing dengan arus mudik.",
  },
  {
    periode: "Menjelang Iduladha",
    nama: "Iduladha",
    arah: "naik",
    komoditas: ["Daging sapi", "Daging kambing", "Cabai", "Bawang"],
    usahaTerdampak: ["Kuliner berbasis daging", "Katering hajatan/kurban"],
    penjelasan:
      "Permintaan hewan kurban dan daging melonjak tajam menjelang Iduladha, mendorong harga naik signifikan dalam waktu singkat sebelum kembali normal.",
  },
  {
    periode: "Pertengahan tahun (Juni–Juli)",
    nama: "Tahun ajaran baru",
    arah: "naik",
    komoditas: ["Alat tulis", "Seragam & tas sekolah", "Buku"],
    usahaTerdampak: ["Konveksi seragam", "Percetakan", "Toko alat tulis"],
    penjelasan:
      "Permintaan perlengkapan sekolah naik signifikan menjelang tahun ajaran baru, jadi momentum baik untuk usaha yang berkaitan dengan kebutuhan pelajar.",
  },
  {
    periode: "Desember (Natal & Tahun Baru)",
    nama: "Natal & Tahun Baru",
    arah: "naik",
    komoditas: ["Daging ayam", "Telur", "Bahan kue", "Bahan pakaian"],
    usahaTerdampak: ["Kuliner", "Bakery & kue kering", "Fashion", "Jasa dekorasi/parcel"],
    penjelasan:
      "Mirip pola Lebaran dalam skala lebih kecil — permintaan bahan pangan dan pakaian naik menjelang libur akhir tahun, ditambah momentum belanja Tahun Baru.",
  },
  {
    periode: "Pasca-panen raya (bervariasi per komoditas & daerah)",
    nama: "Musim panen",
    arah: "turun",
    komoditas: ["Beras", "Cabai", "Bawang (di daerah sentra produksi)"],
    usahaTerdampak: ["Kuliner", "Usaha olahan hasil tani"],
    penjelasan:
      "Saat panen raya, pasokan melimpah dan harga di tingkat petani cenderung turun. Ini momentum baik untuk usaha yang butuh stok bahan baku dalam jumlah besar dengan biaya lebih rendah.",
  },
];
