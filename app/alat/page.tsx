import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Briefcase,
  Calculator,
  CalendarRange,
  Compass,
  HandCoins,
  Landmark,
  LayoutGrid,
  LineChart,
  Receipt,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/alat" },
  title: "Alat Bisnis",
  description:
    "Kumpulan kalkulator gratis untuk bantu UMKM mengelola usaha: HPP, BEP, simulasi pinjaman, dan gaji karyawan.",
});

type AlatItem = {
  href: string;
  nama: string;
  deskripsi: string;
  icon: LucideIcon;
};

const kelompokAlat: { judul: string; subjudul: string; items: AlatItem[] }[] = [
  {
    judul: "Riset & Pemilihan Usaha",
    subjudul: "Bantu temukan peluang usaha dan waktu paling tepat untuk memulainya.",
    items: [
      {
        href: "/analisis-usaha",
        nama: "Analisis Ide Usaha",
        deskripsi:
          "Jawab 7 pertanyaan singkat untuk melihat 3 rekomendasi usaha yang sesuai modal dan waktumu.",
        icon: Compass,
      },
      {
        href: "/template-usaha",
        nama: "Template Usaha",
        deskripsi:
          "Jelajahi daftar contoh usaha populer lengkap dengan estimasi modal awal, HPP, dan harga jual.",
        icon: LayoutGrid,
      },
      {
        href: "/peta-musiman",
        nama: "Peta Musiman Usaha",
        deskripsi:
          "Lihat pola musiman harga bahan dan permintaan sepanjang tahun sebelum menentukan stok atau harga.",
        icon: CalendarRange,
      },
    ],
  },
  {
    judul: "Kalkulator Biaya & Harga",
    subjudul: "Hitung biaya produksi dan titik impas agar harga jualmu selalu sehat.",
    items: [
      {
        href: "/kalkulator-hpp#kalkulator",
        nama: "Kalkulator HPP",
        deskripsi:
          "Hitung biaya bahan baku, tenaga kerja, overhead, dan rekomendasi harga jual sesuai margin.",
        icon: Calculator,
      },
      {
        href: "/skala-produksi",
        nama: "Kalkulator Skala Produksi",
        deskripsi:
          "Atur resep dasar dan target produksi baru untuk menghitung takaran bahan baku dan estimasi biaya otomatis.",
        icon: SlidersHorizontal,
      },
      {
        href: "/simulasi",
        nama: "Simulasi Usaha",
        deskripsi:
          "Uji skenario modal, kenaikan biaya bahan, dan perubahan target penjualan sebelum eksekusi.",
        icon: LineChart,
      },
      {
        href: "/kalkulator-bep",
        nama: "Kalkulator BEP (Titik Impas)",
        deskripsi:
          "Cari tahu berapa unit produk yang harus terjual per bulan supaya biaya tetap tertutup.",
        icon: Scale,
      },
    ],
  },
  {
    judul: "Target & Pengelolaan Keuangan",
    subjudul: "Pantau target penjualan harian, cicilan modal, gaji tim, dan catatan usahamu.",
    items: [
      {
        href: "/target-cuan",
        nama: "Target Cuan",
        deskripsi:
          "Hitung jumlah produk yang perlu dijual setiap hari untuk mencapai target laba bulanan.",
        icon: Target,
      },
      {
        href: "/kalkulator-pinjaman",
        nama: "Simulasi Pinjaman / KUR",
        deskripsi:
          "Perkirakan cicilan bulanan dan total bunga flat atau efektif sebelum mengajukan pinjaman modal.",
        icon: Landmark,
      },
      {
        href: "/kalkulator-gaji",
        nama: "Kalkulator Gaji Karyawan",
        deskripsi:
          "Hitung gaji bersih karyawan usaha kecil, termasuk uang makan, lembur, dan potongan.",
        icon: Users,
      },
      {
        href: "/buku-kas",
        nama: "Buku Kas Harian",
        deskripsi:
          "Catat uang masuk dan keluar harian, lihat saldo otomatis, grafik keuangan, dan laporan harian hingga bulanan.",
        icon: Wallet,
      },
      {
        href: "/generator-nota",
        nama: "Generator Nota & Invoice",
        deskripsi:
          "Buat nota penjualan dengan logo toko, diskon otomatis, unduh PDF/PNG, dan bagikan ke WhatsApp.",
        icon: Receipt,
      },
      {
        href: "/stok",
        nama: "Manajemen Stok Barang",
        deskripsi:
          "Kelola barang masuk dan keluar, pantau sisa stok, harga modal/jual, peringatan menipis, dan riwayat mutasi.",
        icon: Boxes,
      },
      {
        href: "/utang-piutang",
        nama: "Pengelola Utang & Piutang",
        deskripsi:
          "Catat piutang pelanggan dan utang supplier, sisa tagihan otomatis, riwayat pembayaran cicilan, dan pengingat WhatsApp.",
        icon: HandCoins,
      },
      {
        href: "/usaha-saya",
        nama: "Usaha Saya",
        deskripsi:
          "Simpan HPP, harga jual, laba, dan target penjualan produkmu langsung di perangkat ini.",
        icon: Briefcase,
      },
      {
        href: "/paket",
        nama: "Akun & Paket CuanKit",
        deskripsi:
          "Atur identitas toko default, sinkronisasi lintas perangkat, dan cek kuota bulanan akun Anda.",
        icon: Sparkles,
      },
    ],
  },
];

export default function AlatPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Alat Bisnis UMKM</p>
            <h1 className="mt-2.5 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Semua alat hitung usaha dalam satu tempat
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Gratis langsung dipakai dari HP atau laptop, tanpa perlu daftar akun. Angka dari satu alat bisa langsung diteruskan ke alat lainnya.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {kelompokAlat.map((kelompok) => (
              <div key={kelompok.judul}>
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                    {kelompok.judul}
                  </h2>
                  <p className="mt-1 font-body text-sm text-muted">
                    {kelompok.subjudul}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {kelompok.items.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Link
                        key={a.href}
                        href={a.href}
                        className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
                      >
                        <div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-soft text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="mt-4 font-display text-lg font-semibold text-ink transition-colors group-hover:text-forest">
                            {a.nama}
                          </h3>
                          <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                            {a.deskripsi}
                          </p>
                        </div>
                        <div className="mt-5 flex items-center gap-1.5 border-t border-ink/[0.07] pt-4 font-body text-xs font-semibold text-forest">
                          <span>Buka alat</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
