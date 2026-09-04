import { databaseUsaha } from "./databaseUsaha";

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
  | "fotografi"
  | "berkebun"
  | "kecantikan"
  | "belumAda";
export type SumberDaya =
  | "lokasiStrategis"
  | "kendaraan"
  | "alatMasak"
  | "jaringanLuas"
  | "medsosBesar"
  | "tidakAda";
export type Preferensi = "interaksiLangsung" | "kerjaMandiri" | "buatSendiri" | "jualBarangOrang";
export type Pengalaman = "belumPernah" | "pernahSedikit" | "sudahBerpengalaman";

export type IdeUsaha = {
  id: string;
  nama: string;
  kategori: string;
  deskripsi?: string;
  modalCocok: ModalRange[];
  waktuCocok: Waktu[];
  keterampilanKunci: Keterampilan[];
  keterampilanWajib?: Keterampilan[];
  sumberDayaPendukung: SumberDaya[];
  sumberDayaWajib?: SumberDaya[];
  preferensiCocok: Preferensi[];
  targetLabaBulanan?: number;
  tujuanUsaha?: string[];
  modalMin: number;
  modalIdeal?: number;
  modalMax: number;
  rincianModal: string;
  estimasiModal?: { nama: string; nominal: number }[];
  tingkatKesulitan?: "Mudah" | "Menengah" | "Sulit";
  potensiPasar?: "Tinggi" | "Sedang" | "Rendah";
  potensiPengembangan?: string[];
  kelebihan?: string[];
  alasanTemplate: string;
  langkahAwal: string[];
  tantangan: string;
  kombinasi?: string;
  jenisUsahaKalkulator: string; // untuk link ke preset kalkulator HPP
  cocokPemula?: boolean; // true jika ide ini ramah untuk yang belum punya keterampilan khusus
  potensiKeuntungan?: string;
};

const ideUsahaLama: IdeUsaha[] = [
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
    cocokPemula: true,
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
    modalCocok: ["besar"],
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
    cocokPemula: true,
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
  {
    id: "warung-sembako",
    nama: "Warung Sembako / Kelontong",
    kategori: "Dagang",
    modalCocok: ["besar"],
    waktuCocok: ["paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["jualan", "belumAda"],
    sumberDayaPendukung: ["lokasiStrategis"],
    preferensiCocok: ["interaksiLangsung", "jualBarangOrang"],
    modalMin: 2000000,
    modalMax: 5000000,
    rincianModal: "stok awal sembako ~Rp1,5-3jt, etalase & rak ~Rp500rb-1jt, timbangan & alat ~Rp300-500rb",
    alasanTemplate:
      "Tidak butuh keterampilan khusus, cukup lokasi yang strategis dan konsisten menjaga stok. Kebutuhan sembako selalu ada sepanjang tahun, jadi permintaannya stabil.",
    langkahAwal: [
      "Survei harga sembako di warung sekitar sebagai acuan",
      "Tentukan 20-30 item paling dibutuhkan sehari-hari untuk stok awal",
      "Cari supplier grosir terdekat dengan harga bersaing",
      "Atur etalase supaya mudah dilihat dari luar",
      "Buka dengan promo perkenalan untuk tetangga sekitar",
    ],
    tantangan: "Modal tertahan di stok barang, dan bersaing dengan minimarket modern di sekitar.",
    jenisUsahaKalkulator: "umum",
    cocokPemula: true,
  },
  {
    id: "laundry-kiloan",
    nama: "Laundry Kiloan",
    kategori: "Jasa",
    modalCocok: ["besar", "sangatBesar"],
    waktuCocok: ["penuhWaktu"],
    keterampilanKunci: ["belumAda"],
    sumberDayaPendukung: ["lokasiStrategis"],
    preferensiCocok: ["interaksiLangsung", "kerjaMandiri"],
    modalMin: 5000000,
    modalMax: 12000000,
    rincianModal: "mesin cuci & pengering ~Rp4-8jt, deterjen & perlengkapan awal ~Rp500rb-1jt, etalase/signage ~Rp500rb-1jt",
    alasanTemplate:
      "Cocok untuk lokasi dekat kos-kosan, kampus, atau perumahan padat. Modal awal cukup besar tapi permintaannya rutin dan berulang setiap minggu dari pelanggan yang sama.",
    langkahAwal: [
      "Pastikan lokasi dekat target pasar (kos, kampus, perumahan)",
      "Beli mesin cuci kapasitas besar sesuai budget",
      "Tentukan harga per kilogram dan paket ekspres",
      "Pasang spanduk yang jelas terlihat dari jalan",
      "Berikan promo cuci pertama gratis/diskon untuk menarik pelanggan awal",
    ],
    tantangan: "Modal awal besar untuk mesin, dan konsistensi kualitas cuci-setrika saat ramai.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "tanaman-hias",
    nama: "Budidaya & Jual Tanaman Hias",
    kategori: "Pertanian",
    modalCocok: ["kecil", "sedang"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["berkebun"],
    sumberDayaPendukung: ["lokasiStrategis", "medsosBesar"],
    preferensiCocok: ["buatSendiri", "kerjaMandiri"],
    modalMin: 500000,
    modalMax: 2000000,
    rincianModal: "bibit & pot ~Rp400-800rb, media tanam & pupuk ~Rp200-400rb, rak display ~Rp300-500rb",
    alasanTemplate:
      "Hobi berkebun Anda bisa langsung dimonetisasi. Tanaman hias punya pasar yang stabil, terutama lewat media sosial dengan foto-foto menarik.",
    langkahAwal: [
      "Pilih 3-5 jenis tanaman hias yang sedang diminati dan mudah dirawat",
      "Siapkan area kecil di rumah untuk pembibitan",
      "Foto tanaman dengan pencahayaan alami yang bagus",
      "Jual lewat Instagram/marketplace dengan deskripsi perawatan",
      "Ikut komunitas pecinta tanaman untuk memperluas jaringan",
    ],
    tantangan: "Waktu tunggu tanaman tumbuh dan risiko gagal panen/tanaman mati.",
    kombinasi: "Jasa desain taman kecil untuk rumah tetangga.",
    jenisUsahaKalkulator: "kerajinan",
  },
  {
    id: "jasa-fotografi",
    nama: "Jasa Fotografi Event & Produk",
    kategori: "Jasa Digital",
    modalCocok: ["sedang", "besar"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["fotografi"],
    sumberDayaPendukung: ["medsosBesar", "jaringanLuas"],
    preferensiCocok: ["interaksiLangsung", "buatSendiri"],
    modalMin: 1500000,
    modalMax: 4000000,
    rincianModal: "kamera/lensa (jika belum punya) atau sewa alat ~Rp1-3jt, editing software ~Rp200-500rb, promosi portofolio ~Rp200-300rb",
    alasanTemplate:
      "Keahlian fotografi Anda sangat dicari UMKM untuk foto produk, dan untuk acara seperti ulang tahun atau pernikahan kecil. Bisa mulai dari peralatan yang sudah ada.",
    langkahAwal: [
      "Kumpulkan 10-15 foto portofolio terbaik (boleh hasil hunting foto sendiri)",
      "Tentukan 2-3 paket harga (foto produk, foto event)",
      "Posting portofolio di Instagram dengan hashtag lokal",
      "Tawarkan sesi foto produk gratis/diskon ke 2-3 UMKM pertama untuk portofolio",
      "Minta testimoni dan referral dari klien pertama",
    ],
    tantangan: "Persaingan dengan fotografer lain dan investasi alat yang tidak murah di awal.",
    kombinasi: "Jasa desain untuk UMKM, sebagai paket konten visual lengkap.",
    jenisUsahaKalkulator: "digital",
  },
  {
    id: "jasa-rias",
    nama: "Jasa Rias / Makeup Artist",
    kategori: "Jasa",
    modalCocok: ["besar"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["kecantikan"],
    sumberDayaPendukung: ["medsosBesar", "jaringanLuas", "kendaraan"],
    preferensiCocok: ["interaksiLangsung", "buatSendiri"],
    modalMin: 2000000,
    modalMax: 6000000,
    rincianModal: "peralatan makeup profesional ~Rp1,5-4jt, promosi portofolio ~Rp300-500rb, kursus/sertifikasi tambahan (opsional) ~Rp500rb-1jt",
    alasanTemplate:
      "Keahlian merias Anda punya permintaan tinggi terutama musim nikahan dan acara wisuda. Bisa dimulai dari lingkaran pertemanan sebelum menerima klien luar.",
    langkahAwal: [
      "Buat portofolio hasil rias di beberapa model (teman/keluarga)",
      "Tentukan paket harga (harian, wisuda, pengantin)",
      "Bangun akun Instagram khusus portofolio",
      "Tawarkan harga promo untuk 5 klien pertama",
      "Kumpulkan foto testimoni dari tiap klien",
    ],
    tantangan: "Persaingan tinggi dengan MUA lain dan musim ramai-sepi yang tidak menentu.",
    jenisUsahaKalkulator: "jasa",
  },
  {
    id: "toko-online-thrift",
    nama: "Toko Online Barang Preloved/Thrift",
    kategori: "Dagang Online",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan"],
    keterampilanKunci: ["jualan", "belumAda"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["jualBarangOrang", "kerjaMandiri"],
    modalMin: 300000,
    modalMax: 700000,
    rincianModal: "modal awal beli barang preloved ~Rp300-500rb, kemasan & promosi ~Rp100-200rb",
    alasanTemplate:
      "Modal sangat ringan dan sedang tren, cocok untuk yang baru mulai belajar jualan online tanpa risiko besar. Barang bisa dicari dari lemari sendiri dulu untuk permulaan.",
    langkahAwal: [
      "Kumpulkan barang preloved dari lemari sendiri sebagai stok awal",
      "Foto barang dengan pencahayaan bagus dan detail kondisi jelas",
      "Buka akun khusus di Instagram/Shopee untuk thrift",
      "Tentukan harga wajar dibanding kondisi barang",
      "Promosikan ke circle terdekat dulu sebelum publik luas",
    ],
    tantangan: "Konsistensi stok barang baru dan bersaing dengan banyak toko thrift lain.",
    kombinasi: "Reseller fashion online untuk melengkapi dengan barang baru.",
    jenisUsahaKalkulator: "umum",
    cocokPemula: true,
  },
  {
    id: "jasa-admin-medsos",
    nama: "Jasa Admin & Kelola Media Sosial UMKM",
    kategori: "Jasa Digital",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["menulis", "desain"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["kerjaMandiri", "buatSendiri"],
    modalMin: 200000,
    modalMax: 500000,
    rincianModal: "kuota internet & alat pendukung ~Rp200-300rb, langganan tools desain/jadwal posting ~Rp100-200rb",
    alasanTemplate:
      "Banyak UMKM aktif jualan tapi tidak sempat kelola media sosial secara rutin. Kombinasi menulis dan desain Anda pas untuk mengisi kebutuhan ini, bisa dikerjakan dari rumah.",
    langkahAwal: [
      "Buat 1-2 studi kasus contoh pengelolaan akun (boleh akun sendiri/latihan)",
      "Tentukan paket bulanan (jumlah posting, caption, desain)",
      "Tawarkan ke UMKM yang sudah dikenal dulu",
      "Buat kalender konten sederhana sebagai contoh kerja",
      "Kumpulkan hasil (kenaikan interaksi) sebagai bukti kerja untuk klien berikutnya",
    ],
    tantangan: "Klien yang berekspektasi hasil instan, dan revisi berulang tanpa batas jelas.",
    kombinasi: "Jasa desain untuk UMKM dan jasa penulisan, sebagai paket konten lengkap.",
    jenisUsahaKalkulator: "digital",
  },
  {
    id: "jasa-bersih-rumah",
    nama: "Jasa Bersih-Bersih Rumah/Kos",
    kategori: "Jasa",
    modalCocok: ["kecil", "sedang"],
    waktuCocok: ["sampingan", "paruhWaktu"],
    keterampilanKunci: ["belumAda"],
    sumberDayaPendukung: ["kendaraan", "lokasiStrategis"],
    preferensiCocok: ["interaksiLangsung"],
    modalMin: 300000,
    modalMax: 1000000,
    rincianModal: "peralatan bersih-bersih dasar ~Rp300-600rb, transportasi ~Rp100-200rb, seragam/kartu nama ~Rp100-200rb",
    alasanTemplate:
      "Tidak butuh keterampilan khusus, cukup niat dan konsistensi. Banyak keluarga/anak kos butuh bantuan ini tapi jarang ada penyedia jasa yang jelas dan terpercaya di sekitar mereka.",
    langkahAwal: [
      "Siapkan peralatan bersih-bersih dasar",
      "Tentukan tarif per jam atau per area (rumah/kamar kos)",
      "Informasikan ke grup WhatsApp RT/perumahan/kos sekitar",
      "Mulai dengan 2-3 pelanggan percobaan untuk bangun reputasi",
      "Minta testimoni dan rekomendasi dari pelanggan pertama",
    ],
    tantangan: "Membangun kepercayaan awal karena bekerja di ruang pribadi orang lain.",
    jenisUsahaKalkulator: "jasa",
    cocokPemula: true,
  },
  {
    id: "penulis-lepas",
    nama: "Penulis Lepas (Freelance Writer)",
    kategori: "Jasa Digital",
    modalCocok: ["kecil"],
    waktuCocok: ["sampingan", "paruhWaktu", "penuhWaktu"],
    keterampilanKunci: ["menulis"],
    sumberDayaPendukung: ["medsosBesar"],
    preferensiCocok: ["kerjaMandiri"],
    modalMin: 100000,
    modalMax: 400000,
    rincianModal: "kuota internet & listrik bulanan ~Rp300-400rb",
    alasanTemplate:
      "Kemampuan menulis Anda bisa dijual ke media online, blog perusahaan, atau UMKM yang butuh artikel SEO. Modal paling ringan dari semua jenis usaha karena hanya butuh koneksi internet.",
    langkahAwal: [
      "Buat 3-5 tulisan contoh dengan topik berbeda sebagai portofolio",
      "Daftar di platform freelance atau tawarkan langsung ke media/blog lokal",
      "Tentukan tarif per artikel/per kata",
      "Bangun kehadiran di LinkedIn untuk kredibilitas",
      "Ambil proyek kecil dulu untuk membangun rekam jejak",
    ],
    tantangan: "Persaingan tarif dengan penulis lain dan mencari klien yang bayar tepat waktu.",
    kombinasi: "Jasa admin media sosial untuk pemasukan tambahan.",
    jenisUsahaKalkulator: "digital",
  },
];

export const ideUsahaKuliner: IdeUsaha[] = databaseUsaha.map((usaha) => ({
  id: usaha.id,
  nama: usaha.nama,
  kategori: usaha.kategori,
  deskripsi: usaha.deskripsi,
  modalCocok: usaha.modalAwal <= 1000000 ? ["kecil", "sedang"] : ["sedang", "besar"],
  waktuCocok: usaha.kategori === "Produksi" ? ["paruhWaktu", "penuhWaktu"] : ["sampingan", "paruhWaktu"],
  keterampilanKunci: usaha.kategori === "Kuliner" ? ["memasak"] : usaha.kategori === "Produksi" ? ["menjahit"] : ["jualan"],
  sumberDayaPendukung: usaha.kategori === "Kuliner" ? ["alatMasak", "lokasiStrategis"] : usaha.kategori === "Produksi" ? ["lokasiStrategis"] : ["medsosBesar", "jaringanLuas"],
  preferensiCocok: usaha.kategori === "Dagang Online" ? ["jualBarangOrang", "kerjaMandiri"] : usaha.kategori === "Jasa Digital" ? ["kerjaMandiri", "buatSendiri"] : ["buatSendiri", "interaksiLangsung"],
  modalMin: usaha.modalAwal,
  modalMax: Math.round(usaha.modalAwal * 1.5),
  modalIdeal: usaha.modalAwal,
  rincianModal: `Peralatan dan bahan awal sekitar ${usaha.modalAwal.toLocaleString("id-ID")}.`,
  tingkatKesulitan: usaha.tingkatKesulitan,
  potensiPasar: "Tinggi",
  potensiKeuntungan: `${(usaha.hargaJual - usaha.hpp).toLocaleString("id-ID")} per unit sebelum biaya tetap`,
  targetLabaBulanan: (usaha.hargaJual - usaha.hpp) * usaha.penjualanHarian * 30,
  alasanTemplate: usaha.alasan,
  langkahAwal: ["Pilih 1 menu utama untuk diuji", "Hitung ulang HPP dengan harga bahan di daerah Anda", "Uji jual ke pelanggan terdekat"],
  tantangan: "Menjaga rasa, ukuran porsi, dan biaya bahan tetap konsisten.",
  jenisUsahaKalkulator: usaha.kategori === "Kuliner" ? "kuliner" : usaha.kategori === "Produksi" ? "konveksi" : usaha.kategori === "Jasa Digital" ? "digital" : "umum",
  cocokPemula: usaha.tingkatKesulitan === "Mudah",
}));

export const ideUsahaList: IdeUsaha[] = Array.from(
  new Map([...ideUsahaKuliner, ...ideUsahaLama].map((ide) => [ide.id, ide])).values()
);

export function getIdeById(id: string | null | undefined) {
  return ideUsahaList.find((ide) => ide.id === id);
}
