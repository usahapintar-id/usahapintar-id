export type Artikel = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[]; // paragraphs; strings starting with "## " become subheadings
};

export const artikelList: Artikel[] = [
  {
    slug: "cara-menghitung-hpp-usaha-kuliner-rumahan",
    title: "Cara Menghitung HPP untuk Usaha Kuliner Rumahan",
    excerpt:
      "Panduan langkah demi langkah menghitung Harga Pokok Produksi untuk usaha makanan rumahan, lengkap dengan contoh perhitungan sederhana.",
    date: "1 Agustus 2026",
    readTime: "6 menit baca",
    content: [
      "Banyak pelaku usaha kuliner rumahan menentukan harga jual dengan cara menebak — melihat harga kompetitor, lalu mengambil angka yang terasa pantas. Cara ini berisiko: bisa jadi harga terlalu murah sehingga tidak menutup biaya, atau terlalu mahal sehingga kalah bersaing. Solusinya adalah menghitung Harga Pokok Produksi (HPP) terlebih dahulu, baru menentukan harga jual dari sana.",
      "## Apa itu HPP",
      "HPP adalah total biaya yang dikeluarkan untuk menghasilkan satu unit produk, sebelum ditambah keuntungan. Untuk usaha kuliner, HPP biasanya terdiri dari tiga komponen utama: bahan baku, tenaga kerja, dan biaya overhead seperti gas, listrik, dan kemasan.",
      "## Langkah 1: Catat semua bahan baku",
      "Buat daftar setiap bahan yang dipakai dalam satu kali produksi, lengkap dengan jumlah dan harga belinya. Misalnya untuk membuat 20 potong kue lapis: tepung terigu 2 kg seharga Rp 24.000, gula pasir 1 kg seharga Rp 15.000, dan seterusnya. Jumlahkan semuanya menjadi total biaya bahan baku per satu kali produksi.",
      "## Langkah 2: Hitung tenaga kerja",
      "Jika Anda mengerjakan sendiri, tetap beri nilai pada waktu Anda — ini sering dilupakan padahal waktu Anda punya nilai ekonomi. Kalikan jam kerja dengan upah per jam yang wajar di daerah Anda, atau tetapkan nilai tetap per satu kali produksi.",
      "## Langkah 3: Tambahkan overhead",
      "Overhead mencakup biaya yang tidak langsung terlihat tapi tetap dikeluarkan: gas untuk memasak, listrik, air, kemasan, hingga penyusutan alat masak. Banyak usaha rumahan melewatkan komponen ini, padahal jika diabaikan terus-menerus, keuntungan yang terlihat di atas kertas sebenarnya lebih kecil dari kenyataan.",
      "## Langkah 4: Bagi dengan jumlah produksi",
      "Jumlahkan bahan baku, tenaga kerja, dan overhead, lalu bagi dengan jumlah unit yang dihasilkan. Hasilnya adalah HPP per unit — biaya riil untuk menghasilkan satu potong kue, satu porsi nasi, atau satu bungkus keripik.",
      "## Langkah 5: Tentukan margin dan harga jual",
      "Setelah HPP diketahui, tambahkan margin keuntungan yang diinginkan. Margin 30-50% adalah kisaran umum untuk usaha kuliner rumahan, tapi ini bisa disesuaikan tergantung daya beli pasar dan tingkat persaingan di daerah Anda.",
      "Menghitung HPP secara rutin — bukan hanya sekali di awal — juga penting karena harga bahan baku terus berubah. Usaha yang sehat adalah usaha yang harga jualnya mengikuti perubahan biaya produksi, bukan harga yang dipatok sekali lalu dilupakan.",
    ],
  },
  {
    slug: "kesalahan-umkm-menentukan-harga-jual",
    title: "5 Kesalahan UMKM Saat Menentukan Harga Jual",
    excerpt:
      "Lima kesalahan yang paling sering membuat UMKM sulit berkembang meski ramai pembeli — dan cara memperbaikinya.",
    date: "1 Agustus 2026",
    readTime: "5 menit baca",
    content: [
      "Ramai pembeli tidak selalu berarti usaha untung. Banyak pelaku UMKM mengalami kondisi ini: toko terlihat sibuk, produk laris, tapi di akhir bulan modal tidak bertambah. Berikut lima kesalahan umum dalam menentukan harga jual yang sering menjadi penyebabnya.",
      "## 1. Menyamakan harga dengan kompetitor tanpa menghitung biaya sendiri",
      "Setiap usaha punya struktur biaya yang berbeda — lokasi, skala produksi, dan efisiensi kerja tidak pernah persis sama. Menyamakan harga dengan usaha lain tanpa tahu HPP sendiri berisiko menjual di bawah biaya produksi tanpa disadari.",
      "## 2. Melupakan biaya overhead",
      "Listrik, gas, sewa tempat, hingga penyusutan peralatan sering tidak dimasukkan ke dalam perhitungan harga. Biaya-biaya ini terasa kecil satu per satu, tapi jika diakumulasikan dalam sebulan, jumlahnya bisa signifikan dan menggerus keuntungan yang terlihat di atas kertas.",
      "## 3. Tidak menghargai waktu kerja sendiri",
      "Pelaku usaha yang mengerjakan produksi sendiri sering tidak memasukkan nilai waktunya ke dalam HPP. Akibatnya, usaha terlihat untung padahal sebenarnya pemilik hanya 'membayar dirinya sendiri' dengan sangat murah, bahkan terkadang tidak dibayar sama sekali secara riil.",
      "## 4. Menetapkan harga sekali lalu tidak pernah meninjau ulang",
      "Harga bahan baku naik dari waktu ke waktu, tapi banyak usaha mempertahankan harga jual lama karena enggan mengubahnya. Meninjau ulang HPP secara berkala — misalnya setiap tiga bulan — membantu memastikan margin keuntungan tetap sehat.",
      "## 5. Memberi diskon besar tanpa menghitung dampaknya ke margin",
      "Diskon dan promosi memang efektif menarik pembeli, tapi jika diberikan tanpa memperhitungkan HPP, diskon bisa membuat harga jual turun di bawah titik impas. Sebelum memberi potongan harga, hitung dulu batas minimum harga yang masih memberi keuntungan.",
      "Menghindari lima kesalahan ini dimulai dari satu kebiasaan sederhana: menghitung HPP secara rutin sebelum menentukan harga, bukan menebak berdasarkan perasaan atau mengikuti harga usaha lain.",
    ],
  },
  {
    slug: "bedanya-margin-dan-markup",
    title: "Bedanya Margin dan Markup, Mana yang Harus Dipakai?",
    excerpt:
      "Dua istilah ini sering tertukar padahal hasil perhitungannya bisa sangat berbeda. Simak perbedaan dan cara memilih yang tepat untuk usaha Anda.",
    date: "1 Agustus 2026",
    readTime: "4 menit baca",
    content: [
      "Saat menentukan harga jual, dua istilah yang sering digunakan bergantian padahal berbeda adalah margin dan markup. Memahami perbedaannya penting karena keduanya menghasilkan harga jual yang berbeda meski persentasenya sama.",
      "## Markup: persentase dari biaya",
      "Markup dihitung dari HPP (biaya produksi). Jika HPP suatu produk Rp 10.000 dan markup yang diinginkan 50%, maka harga jual menjadi Rp 15.000 (HPP ditambah 50% dari HPP itu sendiri).",
      "## Margin: persentase dari harga jual",
      "Margin dihitung dari harga jual, bukan dari HPP. Jika ingin margin 50% dengan HPP Rp 10.000, harga jualnya justru menjadi Rp 20.000 — karena Rp 10.000 keuntungan harus sama dengan 50% dari harga jual akhir, bukan 50% dari HPP.",
      "## Kenapa ini penting dipahami",
      "Perbedaan ini sering menyebabkan pelaku usaha keliru menghitung, terutama saat berpindah dari satu istilah ke istilah lain tanpa sadar. Selisihnya bisa membuat harga jual jauh lebih rendah dari yang seharusnya, yang berarti keuntungan riil lebih kecil dari yang direncanakan.",
      "## Mana yang sebaiknya dipakai",
      "Tidak ada yang mutlak lebih benar — keduanya valid tergantung kebiasaan industri. Namun untuk usaha kecil yang baru mulai menghitung HPP, markup biasanya lebih mudah dipahami karena perhitungannya langsung dari biaya yang sudah diketahui. Yang terpenting adalah konsisten memakai satu metode dan memahami betul cara kerjanya, supaya tidak salah menetapkan harga akhir.",
      "Kalkulator HPP di UsahaPintar.id menggunakan pendekatan markup — margin keuntungan dihitung sebagai tambahan persentase dari HPP — karena lebih intuitif untuk pelaku usaha yang baru mulai mencatat biaya produksinya secara rutin.",
    ],
  },
];

export function getArtikelBySlug(slug: string) {
  return artikelList.find((a) => a.slug === slug);
}
