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
    slug: "harga-bahan-baku-naik-cara-menyesuaikan-hpp",
    title: "Harga Bahan Baku Naik? Ini Cara Menyesuaikan HPP Tanpa Kehilangan Pelanggan",
    excerpt:
      "Saat harga kedelai, tepung, atau bahan pokok lain naik, banyak UMKM bingung antara menaikkan harga atau menahan kerugian. Berikut cara menyikapinya secara terukur.",
    date: "1 Agustus 2026",
    readTime: "6 menit baca",
    content: [
      "Kenaikan harga bahan baku — baik kedelai, tepung, minyak goreng, atau bahan pokok lainnya — adalah kondisi yang berulang dan sulit dihindari oleh pelaku usaha kecil. Yang membedakan usaha yang bertahan dan yang tergerus keuntungannya biasanya bukan soal bisa menghindari kenaikan harga, tapi soal seberapa cepat dan tepat mereka menyesuaikan HPP.",
      "## Kesalahan yang sering terjadi",
      "Reaksi paling umum saat bahan baku naik adalah menahan harga jual lama karena takut kehilangan pelanggan. Sikap ini bisa dipahami, tapi jika dibiarkan terlalu lama, margin keuntungan tergerus pelan-pelan sampai akhirnya usaha berjalan tanpa untung, bahkan merugi tanpa disadari.",
      "## Langkah 1: Hitung ulang HPP begitu ada kenaikan harga",
      "Begitu mendengar atau merasakan kenaikan harga bahan baku, langkah pertama bukan panik menaikkan harga jual, tapi menghitung ulang HPP dengan harga baru. Tanpa angka pasti, keputusan menaikkan harga jual hanya berdasarkan perasaan, bukan perhitungan.",
      "## Langkah 2: Pisahkan kenaikan sementara dan permanen",
      "Tidak semua kenaikan harga bahan baku bersifat permanen — sebagian hanya fluktuasi musiman yang akan turun kembali dalam beberapa minggu. Untuk kenaikan yang terlihat sementara, opsi memperkecil ukuran porsi atau menyesuaikan komposisi bahan bisa jadi solusi jangka pendek. Untuk kenaikan yang terlihat permanen, penyesuaian harga jual biasanya tidak terhindarkan.",
      "## Langkah 3: Naikkan harga secara bertahap, bukan sekaligus besar",
      "Kenaikan harga jual yang besar dan tiba-tiba lebih terasa mengagetkan bagi pelanggan dibanding kenaikan kecil yang dilakukan bertahap. Jika margin memungkinkan, menaikkan harga dalam beberapa tahap kecil biasanya lebih mudah diterima pasar dibanding satu kali lonjakan besar.",
      "## Langkah 4: Komunikasikan alasan kenaikan, bukan hanya angkanya",
      "Pelanggan cenderung lebih memahami kenaikan harga ketika tahu alasannya, misalnya harga bahan baku utama sedang naik di pasaran. Komunikasi sederhana lewat media sosial atau papan harga bisa membantu mengurangi keluhan.",
      "## Langkah 5: Evaluasi ulang komposisi biaya, bukan cuma bahan baku",
      "Saat menyesuaikan harga karena satu komponen naik, ini juga momen yang tepat untuk meninjau ulang komponen biaya lain — tenaga kerja, overhead, dan margin — apakah semuanya masih realistis dengan kondisi sekarang.",
      "Kenaikan harga bahan baku memang di luar kendali pelaku usaha, tapi cara meresponsnya sepenuhnya ada di tangan Anda. Usaha yang rutin menghitung ulang HPP setiap kali ada perubahan harga bahan baku cenderung lebih stabil keuntungannya dibanding usaha yang mempertahankan harga jual lama demi menghindari komplain sesaat.",
    ],
  },
  {
    slug: "dampak-kenaikan-tarif-listrik-biaya-produksi-umkm",
    title: "Dampak Kenaikan Tarif Listrik ke Biaya Produksi UMKM, dan Cara Menghitungnya",
    excerpt:
      "Kenaikan tarif listrik sering dianggap biaya kecil yang tidak perlu dihitung ulang, padahal dampaknya ke HPP bisa lebih besar dari perkiraan.",
    date: "1 Agustus 2026",
    readTime: "5 menit baca",
    content: [
      "Listrik adalah salah satu komponen biaya overhead yang paling sering diabaikan dalam perhitungan HPP, padahal untuk usaha yang menggunakan peralatan listrik secara intensif — seperti oven, mesin jahit, mesin cetak, atau kulkas pendingin — kenaikan tarif listrik bisa berdampak nyata ke margin keuntungan.",
      "## Kenapa listrik sering terlewat dari perhitungan",
      "Tagihan listrik biasanya dibayar sebagai satu angka bulanan untuk seluruh rumah tangga atau tempat usaha, bukan per produk yang dihasilkan. Karena tidak terlihat langsung per unit produksi, banyak pelaku usaha kesulitan memasukkannya ke dalam HPP, dan akhirnya memilih untuk tidak menghitungnya sama sekali.",
      "## Cara sederhana mengalokasikan biaya listrik ke HPP",
      "Cara paling praktis adalah memperkirakan proporsi penggunaan listrik untuk usaha dibanding total tagihan bulanan. Misalnya, jika total tagihan listrik bulanan Rp 300.000 dan diperkirakan 60% dipakai untuk kegiatan usaha, maka Rp 180.000 adalah biaya listrik usaha per bulan. Bagi angka ini dengan jumlah produksi dalam sebulan untuk mendapatkan alokasi biaya listrik per unit.",
      "## Contoh dampaknya ke HPP",
      "Jika usaha memproduksi 300 unit produk dalam sebulan dengan alokasi biaya listrik Rp 180.000, maka tambahan biaya listrik per unit adalah Rp 600. Angka ini terlihat kecil per unit, tapi jika tarif listrik naik 20%, tambahan biaya per unit ikut naik menjadi Rp 720 — dan jika tidak disesuaikan ke harga jual, margin keuntungan otomatis tergerus di setiap unit yang terjual.",
      "## Kapan perlu menghitung ulang",
      "Setiap kali ada pengumuman kenaikan tarif dasar listrik, atau saat penggunaan alat-alat listrik di usaha bertambah (misalnya membeli mesin baru), ini menjadi momen yang tepat untuk menghitung ulang alokasi biaya listrik ke HPP. Kebiasaan meninjau ulang komponen overhead secara berkala membantu memastikan harga jual tetap mencerminkan biaya produksi yang sebenarnya.",
      "## Bukan hanya listrik",
      "Prinsip yang sama berlaku untuk biaya overhead lain yang sering terlewat: air, gas, sewa tempat, hingga penyusutan peralatan. Semua komponen ini kecil secara individual, tapi jika diakumulasikan dan tidak pernah dihitung ulang, selisihnya bisa signifikan terhadap keuntungan usaha dalam jangka panjang.",
    ],
  },
  {
    slug: "rumus-menghitung-hpp-dan-harga-jual",
    title: "Rumus Menghitung HPP dan Harga Jual (Lengkap dengan Contoh)",
    excerpt:
      "Kumpulan rumus dasar untuk menghitung Harga Pokok Produksi (HPP) dan harga jual, disertai contoh perhitungan yang mudah diikuti.",
    date: "1 Agustus 2026",
    readTime: "7 menit baca",
    content: [
      "Salah satu pertanyaan paling sering dicari pelaku usaha kecil adalah bagaimana rumus menghitung HPP dan harga jual yang benar. Artikel ini merangkum rumus-rumus dasarnya secara ringkas, lengkap dengan contoh angka supaya mudah langsung dipraktikkan.",
      "## Apa itu HPP",
      "HPP atau Harga Pokok Produksi adalah total biaya yang dikeluarkan untuk menghasilkan satu unit produk. HPP menjadi dasar sebelum menentukan harga jual, karena tanpa mengetahui HPP, harga jual yang ditetapkan bisa jadi tidak menutup biaya produksi sama sekali.",
      "## Rumus dasar HPP",
      "Rumus paling sederhana untuk menghitung HPP per unit adalah sebagai berikut:",
      "HPP per unit = (Biaya bahan baku + Biaya tenaga kerja + Biaya overhead) / Jumlah unit yang dihasilkan",
      "Ketiga komponen biaya ini perlu dihitung untuk satu kali proses produksi, lalu dibagi dengan jumlah unit yang dihasilkan dari proses tersebut.",
      "## Contoh perhitungan HPP",
      "Misalkan sebuah usaha kue rumahan memproduksi 20 potong kue dalam satu kali produksi, dengan rincian biaya sebagai berikut: bahan baku Rp 80.000, tenaga kerja Rp 30.000, dan overhead (gas, listrik, kemasan) Rp 10.000. Total biaya produksi adalah Rp 120.000. Dengan rumus di atas, HPP per potong kue adalah Rp 120.000 dibagi 20, yaitu Rp 6.000 per potong.",
      "## Rumus menghitung harga jual dari HPP",
      "Setelah HPP diketahui, harga jual dihitung dengan menambahkan margin keuntungan yang diinginkan. Rumus yang umum dipakai (menggunakan pendekatan markup dari biaya) adalah:",
      "Harga jual = HPP per unit x (1 + persentase margin)",
      "Melanjutkan contoh di atas, jika HPP per potong kue adalah Rp 6.000 dan margin keuntungan yang diinginkan 50%, maka harga jualnya adalah Rp 6.000 x 1,5 = Rp 9.000 per potong.",
      "## Rumus menghitung keuntungan",
      "Untuk mengetahui keuntungan per unit, gunakan rumus:",
      "Keuntungan per unit = Harga jual - HPP per unit",
      "Dari contoh di atas, keuntungan per potong kue adalah Rp 9.000 dikurangi Rp 6.000, yaitu Rp 3.000 per potong. Jika seluruh 20 potong terjual, total keuntungan yang didapat adalah Rp 60.000.",
      "## Kesalahan umum dalam menghitung HPP",
      "Kesalahan yang paling sering terjadi adalah melupakan komponen biaya overhead dan tenaga kerja, sehingga HPP yang dihitung lebih rendah dari kenyataan. Akibatnya, harga jual yang ditetapkan pun ikut lebih rendah dari yang seharusnya, dan keuntungan riil menjadi lebih kecil dari yang terlihat di atas kertas.",
      "## Praktikkan langsung tanpa menghitung manual",
      "Rumus-rumus di atas bisa dihitung manual dengan kalkulator biasa, tapi akan lebih cepat dan minim kesalahan jika menggunakan kalkulator HPP otomatis. Cukup masukkan bahan baku, tenaga kerja, overhead, jumlah produksi, dan margin yang diinginkan — hasil HPP dan harga jual langsung terlihat tanpa perlu menghitung manual satu per satu.",
    ],
  },
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
      "Kalkulator HPP di CuanKit menggunakan pendekatan markup — margin keuntungan dihitung sebagai tambahan persentase dari HPP — karena lebih intuitif untuk pelaku usaha yang baru mulai mencatat biaya produksinya secara rutin.",
    ],
  },
];

export function getArtikelBySlug(slug: string) {
  return artikelList.find((a) => a.slug === slug);
}
