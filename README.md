# CuanKit (cuankit.id)

Alat bantu usaha untuk pemula: cari ide usaha, hitung modal, HPP, harga jual, laba, dan BEP.
Dibangun dengan Next.js 14 (App Router), TypeScript, dan Tailwind CSS.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # cek build produksi sebelum deploy
npm run uji     # uji rumus (scripts/uji-logika.ts)
```

## Struktur

```
app/                 halaman (App Router); tiap folder = satu URL
components/          komponen UI (kalkulator, simulasi, kuesioner, dll)
lib/
  hitung.ts          rumus murni: laba, BEP, balik modal, pinjaman (satu sumber kebenaran)
  databaseUsaha.ts   template usaha + ringkasanTemplate() untuk angka contoh di homepage
  simulasiAwal.ts    membaca ?usaha= / ?hpp= / ?harga= di server untuk halaman Simulasi
  storage.ts         pembungkus localStorage yang aman (try/catch)
  ideUsaha.ts        ide usaha untuk kuesioner Analisis Usaha
  matchingUsaha.ts   skor kecocokan kuesioner
  rekomendasi.ts     tautan afiliasi (isi tautan asli; yang masih GANTI-LINK disembunyikan)
```

## Definisi angka (jangan diubah sepihak di satu halaman)

- Laba per unit = harga jual - HPP
- BEP bulanan = biaya tetap per bulan / laba per unit
- Balik modal (unit) = modal awal / laba per unit
- Balik modal (bulan) = modal awal / laba bersih per bulan
- Laba bersih bulanan = laba per unit x penjualan/hari x 30 - biaya tetap
- Markup (slider HPP) = kenaikan di atas HPP; margin = laba / harga jual
- Target Cuan (unit/bulan) = (target laba bersih + biaya tetap) / laba per unit
- HPP yang dikirim ke BEP, Target Cuan, dan Simulasi = bahan + tenaga kerja per unit (tanpa overhead). Overhead bulanan (sewa, listrik, gas) dimasukkan sebagai biaya tetap di sana, supaya tidak terhitung dua kali.

## Catatan

- Data pengguna hanya disimpan di localStorage browser (lihat halaman Privasi).
- Isi tautan afiliasi di `lib/rekomendasi.ts`; produk dengan `GANTI-LINK` tidak ditampilkan.
- Testimoni di `components/Testimonials.tsx` harus berasal dari pengguna nyata.
