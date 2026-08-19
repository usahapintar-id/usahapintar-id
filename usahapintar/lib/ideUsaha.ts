export type ModalRange = "kecil" | "sedang" | "besar" | "sangatBesar";
export type Waktu = "sampingan" | "paruhWaktu" | "penuhWaktu";
export type Keterampilan =
  | "memasak"
  | "menjahit"
  | "desain"
  | "menulis"
  | "jualan"
  | "mengajar"
  | "teknis"
  | "belumAda";
export type SumberDaya =
  | "lokasiStrategis"
  | "kendaraan"
  | "alatMasak"
  | "jaringanLuas"
  | "medsosBesar"
  | "tidakAda";
export type Preferensi = "interaksiLangsung" | "kerjaMandiri" | "buatSendiri" | "jualBarangOrang";

export type IdeUsaha = {
  id: string;
  nama: string;
  kategori: string;
  modalCocok: ModalRange[];
  waktuCocok: Waktu[];
  keterampilanKunci: Keterampilan[];
  sumberDayaPendukung: SumberDaya[];
  preferensiCocok: Preferensi[];
  modalMin: number;
  modalMax: number;
  rincianModal: string;
  alasanTemplate: string;
  langkahAwal: string[];
  tantangan: string;
  kombinasi?: string;
  jenisUsahaKalkulator: string; // untuk link ke preset kalkulator HPP
};

export const ideUsahaList: IdeUsaha[] = [
  {
    id: "katering-rumahan",
    nama: "Katering Rumahan Skala Kecil",
    kategori: "Kuliner",
    modalCocok: ["kecil", "sedang"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["memasak"],
    sumberDayaPendukung: ["lokasiStrategis", "alatMasak", "jaringanLuas"],
    preferensiCocok: ["buatSendiri", "interaksiLangsung"],
    modalMin: 800000,
    modalMax: 1500000,
    rincianModal: "bahan baku awal ~Rp500rb, kemasan & label ~Rp200rb, promosi awal ~Rp300rb",
    alasanTemplate:
      "Keterampilan memasak Anda jadi modal utama, dan lokasi yang strategis bisa dimanfaatkan untuk promosi dari mulut ke mulut. Model sampingan juga pas karena katering bisa dimulai dari pesanan kecil dulu.",
    langkahAwal: [
      "Tentukan 3 menu andalan yang paling dikuasai",
      "Hitung HPP tiap menu",
      "Buat 5-10 foto menu dengan HP untuk promosi",
      "Tawarkan ke 10 tetangga/kolega terdekat dengan harga perkenalan",
      "Kumpulkan testimoni dari 3 pembeli pertama",
    ],
    tantangan: "Konsistensi rasa saat pesanan mulai banyak, dan manajemen waktu masak jika masih sampingan.",
    kombinasi: "Reseller kemasan makanan, sekaligus jadi usaha sampingan kedua.",
    jenisUsahaKalkulator: "kuliner",
  },
  {
    id: "cemilan-kemasan",
    nama: "Cemilan / Jajanan Kemasan",
    kategori: "Kuliner",
    modalCocok: ["kecil", "sedang"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["memasak"],
    sumberDayaPendukung: ["lokasiStrategis", "alatMasak"],
    preferensiCocok: ["buatSendiri"],
    modalMin: 500000,
    modalMax: 1200000,
    rincianModal: "bahan baku ~Rp400rb, kemasan & label ~Rp300rb, peralatan sealer sederhana ~Rp300rb",
    alasanTemplate:
      "Modalnya ringan dan bisa dititipkan ke warung-warung sekitar lokasi Anda. Cocok dikerjakan bertahap sambil tetap punya kesibukan lain.",
    langkahAwal: [
      "Pilih 1-2 jenis cemilan yang tahan lama dan disukai pasar sekitar",
      "Hitung HPP dan tentukan harga jual per kemasan",
      "Desain label sederhana (bisa pakai Canva)",
      "Titipkan ke 5 warung/toko kelontong terdekat",
      "Evaluasi mingguan mana yang paling laku",
    ],
    tantangan: "Daya tahan produk dan konsistensi pasokan ke warung titipan.",
    kombinasi: "Jualan online lewat status WhatsApp untuk jangkauan lebih luas.",
    jenisUsahaKalkulator: "kuliner",
  },
  {
    id: "reseller-fashion",
    nama: "Reseller Fashion Online",
    kategori: "Dagang Online",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["jualan"],
    sumberDayaPendukung: ["medsosBesar", "jaringanLuas"],
    preferensiCocok: ["jualBarangOrang", "kerjaMandiri"],
    modalMin: 300000,
    modalMax: 800000,
    rincianModal: "stok awal terbatas atau sistem pre-order/dropship ~Rp300-500rb, promosi ~Rp200-300rb",
    alasanTemplate:
      "Tidak perlu produksi sendiri, cocok untuk yang suka berjualan dan punya jaringan atau media sosial yang lumayan aktif. Risiko modal kecil karena bisa mulai dari sistem pre-order.",
    langkahAwal: [
      "Cari 2-3 supplier terpercaya dengan sistem reseller/dropship",
      "Tentukan niche produk (misal: baju muslim, kaos anak, dll)",
      "Setup akun jualan di Instagram/Shopee",
      "Posting produk dengan foto yang menarik",
      "Tawarkan ke circle terdekat dulu sebelum ke publik luas",
    ],
    tantangan: "Persaingan harga dengan reseller lain, dan menjaga kualitas dari supplier.",
    kombinasi: "Jasa titip (jastip) untuk produk yang sedang tren.",
    jenisUsahaKalkulator: "umum",
  },
  {
    id: "jasa-desain",
    nama: "Jasa Desain untuk UMKM",
    kategori: "Jasa Digital",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["desain"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["kerjaMandiri", "buatSendiri"],
    modalMin: 200000,
    modalMax: 500000,
    rincianModal: "biaya aplikasi desain (jika belum punya) ~Rp200-300rb, promosi portofolio ~Rp100-200rb",
    alasanTemplate:
      "Keterampilan desain Anda punya pasar luas karena banyak UMKM butuh materi promosi tapi tidak punya kemampuan desain sendiri. Bisa dikerjakan dari mana saja.",
    langkahAwal: [
      "Buat 5-10 contoh desain portofolio (boleh desain ulang brand yang sudah ada sebagai latihan)",
      "Tentukan paket harga (misal: logo, feed Instagram, banner)",
      "Posting portofolio di Instagram dengan hashtag lokal",
      "Tawarkan ke UMKM di sekitar dengan harga perkenalan",
      "Minta testimoni dan referral dari klien pertama",
    ],
    tantangan: "Membangun kepercayaan awal tanpa portofolio panjang, dan negosiasi harga dengan klien.",
    kombinasi: "Jasa kelola media sosial untuk UMKM yang sama.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "les-privat",
    nama: "Les Privat / Bimbel Kecil",
    kategori: "Jasa Edukasi",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["mengajar"],
    sumberDayaPendukung: ["lokasiStrategis", "jaringanLuas"],
    preferensiCocok: ["interaksiLangsung"],
    modalMin: 100000,
    modalMax: 400000,
    rincianModal: "materi ajar & alat tulis ~Rp100-200rb, promosi ~Rp100-200rb",
    alasanTemplate:
      "Kemampuan mengajar Anda bisa langsung dimonetisasi dengan modal sangat kecil. Cocok dijalankan sambil kerja/kuliah karena jadwalnya fleksibel.",
    langkahAwal: [
      "Tentukan mata pelajaran/keahlian yang paling dikuasai",
      "Tentukan tarif per sesi/per bulan",
      "Informasikan ke tetangga, grup WhatsApp RT/sekolah",
      "Mulai dengan 2-3 murid percobaan",
      "Minta testimoni orang tua murid untuk promosi selanjutnya",
    ],
    tantangan: "Konsistensi jadwal dan mengelola beberapa murid dengan level berbeda.",
    kombinasi: "Jual modul/rangkuman belajar digital untuk murid yang lebih luas.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "konveksi-rumahan",
    nama: "Konveksi Rumahan",
    kategori: "Produksi",
    modalCocok: ["sedang", "besar"],
    waktuCocok: ["paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["menjahit"],
    sumberDayaPendukung: ["alatMasak", "lokasiStrategis"],
    preferensiCocok: ["buatSendiri"],
    modalMin: 2000000,
    modalMax: 5000000,
    rincianModal: "mesin jahit & alat ~Rp1,5-3jt, bahan kain awal ~Rp500rb-1jt, kemasan & label ~Rp300-500rb",
    alasanTemplate:
      "Keterampilan menjahit adalah modal utama yang sulit ditiru pesaing tanpa keahlian sama. Cocok untuk skala produksi lebih besar karena modal Anda memadai.",
    langkahAwal: [
      "Tentukan produk fokus (baju, seragam, tas, dll)",
      "Hitung HPP per potong dengan detail",
      "Buat 3-5 sample produk untuk katalog",
      "Cari 1-2 reseller/mitra jual pertama",
      "Bangun akun Instagram khusus untuk showcase produk",
    ],
    tantangan: "Manajemen stok kain dan konsistensi kualitas jahitan saat pesanan banyak.",
    kombinasi: "Jual bahan sisa/kain perca ke perajin kecil lain.",
    jenisUsahaKalkulator: "konveksi",
  },
  {
    id: "jasa-titip",
    nama: "Jasa Titip (Jastip) & Dropship",
    kategori: "Dagang Online",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan"],
    keterampilanKunci: ["jualan"],
    sumberDayaPendukung: ["medsosBesar", "kendaraan"],
    preferensiCocok: ["jualBarangOrang", "kerjaMandiri"],
    modalMin: 200000,
    modalMax: 600000,
    rincianModal: "modal talangan untuk beberapa order awal ~Rp300-500rb, promosi ~Rp100-200rb",
    alasanTemplate:
      "Modal sangat ringan karena sistemnya bayar dulu baru beli/kirim. Cocok untuk waktu sangat terbatas karena bisa dikerjakan di sela kesibukan lain.",
    langkahAwal: [
      "Tentukan niche jastip (produk luar kota/luar negeri, atau dropship marketplace)",
      "Bangun akun media sosial khusus jastip",
      "Buat sistem pre-order dengan DP untuk kurangi risiko",
      "Promosikan ke circle terdekat dulu",
      "Catat rapi setiap pesanan supaya tidak ada yang terlewat",
    ],
    tantangan: "Manajemen arus kas talangan dan risiko pembeli yang tidak jadi bayar.",
    kombinasi: "Reseller fashion online untuk melengkapi jenis produk.",
    jenisUsahaKalkulator: "umum",
  },
  {
    id: "jasa-reparasi",
    nama: "Jasa Reparasi Elektronik/Otomotif",
    kategori: "Jasa Teknis",
    modalCocok: ["sedang"],
    waktuCocok: ["paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["teknis"],
    sumberDayaPendukung: ["lokasiStrategis", "kendaraan"],
    preferensiCocok: ["interaksiLangsung", "kerjaMandiri"],
    modalMin: 1000000,
    modalMax: 3000000,
    rincianModal: "peralatan reparasi dasar ~Rp1-2jt, stok sparepart umum ~Rp500rb-1jt",
    alasanTemplate:
      "Keahlian teknis Anda termasuk yang jarang dimiliki orang lain di sekitar, jadi persaingannya lebih rendah dan bisa pasang tarif jasa yang layak.",
    langkahAwal: [
      "Siapkan peralatan dasar sesuai spesialisasi (elektronik/otomotif)",
      "Tentukan daftar harga jasa per jenis kerusakan umum",
      "Pasang informasi di depan rumah/lokasi usaha dan grup warga",
      "Tawarkan garansi singkat untuk membangun kepercayaan",
      "Kumpulkan testimoni dari pelanggan pertama",
    ],
    tantangan: "Menyediakan sparepart yang lengkap dan menjaga waktu pengerjaan tetap cepat.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "konten-kreator",
    nama: "Konten Kreator / Jasa Penulisan",
    kategori: "Jasa Digital",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["menulis"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["kerjaMandiri", "buatSendiri"],
    modalMin: 100000,
    modalMax: 400000,
    rincianModal: "kuota internet & alat pendukung ~Rp100-200rb, promosi portofolio ~Rp100-200rb",
    alasanTemplate:
      "Kemampuan menulis Anda bisa dimonetisasi lewat jasa penulisan artikel/caption untuk bisnis lain, dengan modal yang sangat minim.",
    langkahAwal: [
      "Buat 3-5 contoh tulisan/caption sebagai portofolio",
      "Tentukan niche (caption jualan, artikel blog, dll)",
      "Tawarkan ke UMKM/kenalan yang butuh konten rutin",
      "Bangun profil di platform freelance jika perlu jangkauan lebih luas",
      "Kumpulkan testimoni dari klien pertama",
    ],
    tantangan: "Menemukan klien rutin di awal dan menetapkan tarif yang wajar.",
    kombinasi: "Jasa desain untuk UMKM, sebagai paket konten lengkap.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "kerajinan-tangan",
    nama: "Kerajinan Tangan / Handmade",
    kategori: "Produksi",
    modalCocok: ["kecil", "sedang"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["menjahit", "desain"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["buatSendiri"],
    modalMin: 500000,
    modalMax: 1500000,
    rincianModal: "bahan baku & alat ~Rp500rb-1jt, kemasan & foto produk ~Rp300-500rb",
    alasanTemplate:
      "Cocok untuk yang suka membuat sesuatu dengan tangan dan punya sisi kreatif. Produk handmade sering punya nilai jual lebih tinggi dibanding produk pabrikan.",
    langkahAwal: [
      "Tentukan jenis kerajinan yang paling dikuasai/disukai",
      "Buat 5-10 produk pertama sebagai stok awal",
      "Foto produk dengan pencahayaan bagus",
      "Buka toko di marketplace (Shopee/Tokopedia) atau Instagram",
      "Ikut bazar/pasar kreatif lokal untuk exposure awal",
    ],
    tantangan: "Waktu produksi yang lama per item dan menetapkan harga yang sepadan dengan effort.",
    jenisUsahaKalkulator: "kerajinan",
  },
];
