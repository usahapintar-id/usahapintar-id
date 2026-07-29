# UsahaPintar.id

Landing page + Kalkulator HPP untuk UMKM, dibangun dengan Next.js 14 (App Router), TypeScript, dan Tailwind CSS.

## Menjalankan di komputer sendiri

Pastikan Node.js versi 18 ke atas sudah terpasang, lalu:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

## Struktur project

```
app/
  layout.tsx        -> metadata, font, wrapper utama
  page.tsx           -> menyusun urutan section landing page
  globals.css         -> gaya dasar & tekstur kertas
components/
  Header.tsx           -> navigasi atas (sticky)
  Hero.tsx              -> headline utama + kartu "buku kas" (visual andalan)
  Problem.tsx            -> masalah yang sering dialami UMKM
  Features.tsx             -> daftar fitur
  HowItWorks.tsx             -> 3 langkah pakai kalkulator
  HPPCalculator.tsx           -> kalkulator HPP interaktif (inti produk)
  Testimonials.tsx              -> testimoni
  CTASection.tsx                 -> ajakan mencoba kalkulator
  Footer.tsx                      -> footer
```

## Bagian yang paling penting: Kalkulator HPP

Ada di `components/HPPCalculator.tsx`. Logikanya:

1. **Bahan baku** — daftar bahan yang bisa ditambah/dihapus, masing-masing punya jumlah dan harga satuan. Totalnya dijumlahkan otomatis.
2. **Biaya lain** — tenaga kerja dan overhead (listrik, sewa, gas, dll) per satu kali produksi.
3. **Produksi & margin** — jumlah unit yang dihasilkan dan persentase margin keuntungan yang diinginkan (pakai slider).

Rumus yang dipakai:

```
Total modal   = total bahan baku + tenaga kerja + overhead
HPP per unit  = total modal / jumlah unit produksi
Harga jual    = HPP per unit x (1 + margin% )   -> dibulatkan ke atas ke Rp 100 terdekat
Untung/unit   = harga jual - HPP per unit
```

Semua dihitung langsung di browser (client-side), tidak perlu database atau server tambahan.

## Mengubah warna, font, atau teks

- Warna: `tailwind.config.ts` (token `paper`, `forest`, `ledger`, `brass`, `ink`)
- Font: `app/layout.tsx` (Fraunces untuk judul, Inter untuk teks, IBM Plex Mono untuk angka)
- Teks/copy: langsung di masing-masing file komponen

## Deploy

Cara termudah adalah deploy ke [Vercel](https://vercel.com):

1. Push folder ini ke repository GitHub.
2. Import repository tersebut di Vercel.
3. Klik Deploy — tidak perlu konfigurasi tambahan.

## Langkah lanjutan yang bisa ditambahkan

- Simpan riwayat perhitungan HPP ke database (mis. Supabase) supaya bisa dibuka lagi nanti.
- Tambah halaman khusus per kategori usaha (kuliner, konveksi, kerajinan) dengan komponen biaya yang sudah disesuaikan.
- Tambah opsi ekspor hasil perhitungan ke PDF atau gambar untuk dibagikan.
