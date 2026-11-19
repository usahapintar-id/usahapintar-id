"use client";

import Link from "next/link";
import { useState } from "react";
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
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type KategoriId = "semua" | "mulai" | "hitung" | "kelola";

type ToolItem = {
  href: string;
  nama: string;
  kategori: Exclude<KategoriId, "semua">;
  kategoriLabel: string;
  deskripsi: string;
  icon: LucideIcon;
};

const tools: ToolItem[] = [
  {
    href: "/analisis-usaha",
    nama: "Analisis Ide Usaha",
    kategori: "mulai",
    kategoriLabel: "Mulai & Riset",
    deskripsi: "Jawab 7 pertanyaan singkat untuk menemukan usaha yang pas dengan modal dan waktumu.",
    icon: Compass,
  },
  {
    href: "/template-usaha",
    nama: "Template Usaha Siap Pakai",
    kategori: "mulai",
    kategoriLabel: "Mulai & Riset",
    deskripsi: "Pilih dari puluhan contoh usaha kuliner, dagang online, dan jasa lengkap dengan estimasi modal.",
    icon: LayoutGrid,
  },
  {
    href: "/peta-musiman",
    nama: "Peta Musiman Usaha",
    kategori: "mulai",
    kategoriLabel: "Mulai & Riset",
    deskripsi: "Lihat kalender lonjakan permintaan dan harga bahan sepanjang tahun di Indonesia.",
    icon: CalendarRange,
  },
  {
    href: "/kalkulator-hpp#kalkulator",
    nama: "Kalkulator HPP & Harga Jual",
    kategori: "hitung",
    kategoriLabel: "Hitung Biaya & Harga",
    deskripsi: "Hitung biaya bahan baku, tenaga kerja, overhead, dan margin keuntungan secara otomatis.",
    icon: Calculator,
  },
  {
    href: "/skala-produksi",
    nama: "Kalkulator Skala Produksi",
    kategori: "hitung",
    kategoriLabel: "Hitung Biaya & Harga",
    deskripsi: "Ubah target jumlah produksi dan hitung kebutuhan bahan baku serta estimasi biayanya otomatis.",
    icon: SlidersHorizontal,
  },
  {
    href: "/simulasi",
    nama: "Simulasi Modal & Laba",
    kategori: "hitung",
    kategoriLabel: "Hitung Biaya & Harga",
    deskripsi: "Uji dampak kenaikan harga bahan atau diskon penjualan terhadap keuntungan bulanan.",
    icon: LineChart,
  },
  {
    href: "/kalkulator-bep",
    nama: "Kalkulator BEP (Titik Impas)",
    kategori: "hitung",
    kategoriLabel: "Hitung Biaya & Harga",
    deskripsi: "Ketahui jumlah produk minimal yang wajib terjual per bulan agar tidak rugi.",
    icon: Scale,
  },
  {
    href: "/target-cuan",
    nama: "Target Cuan Harian",
    kategori: "kelola",
    kategoriLabel: "Target & Keuangan",
    deskripsi: "Ubah target keuntungan bersih bulanan menjadi target penjualan harian yang jelas.",
    icon: Target,
  },
  {
    href: "/kalkulator-pinjaman",
    nama: "Simulasi Pinjaman / KUR",
    kategori: "kelola",
    kategoriLabel: "Target & Keuangan",
    deskripsi: "Cek cicilan bulanan dan total bunga bunga flat maupun efektif sebelum mengambil modal.",
    icon: Landmark,
  },
  {
    href: "/kalkulator-gaji",
    nama: "Kalkulator Gaji Karyawan",
    kategori: "kelola",
    kategoriLabel: "Target & Keuangan",
    deskripsi: "Hitung gaji bersih karyawan usaha kecil termasuk uang makan, lembur, dan potongan.",
    icon: Users,
  },
  {
    href: "/buku-kas",
    nama: "Buku Kas Harian",
    kategori: "kelola",
    kategoriLabel: "Operasional & Keuangan",
    deskripsi: "Catat pemasukan dan pengeluaran harian, hitung saldo otomatis, grafik arus kas, dan laporan periodik.",
    icon: Wallet,
  },
  {
    href: "/generator-nota",
    nama: "Generator Nota & Invoice",
    kategori: "kelola",
    kategoriLabel: "Operasional & Keuangan",
    deskripsi: "Buat nota penjualan dengan logo toko, hitung total & diskon otomatis, unduh PDF, dan kirim ke WhatsApp.",
    icon: Receipt,
  },
  {
    href: "/stok",
    nama: "Manajemen Stok Barang",
    kategori: "kelola",
    kategoriLabel: "Operasional & Keuangan",
    deskripsi: "Pantau stok tersedia, catat barang masuk dan keluar, peringatan stok menipis, serta riwayat mutasi.",
    icon: Boxes,
  },
  {
    href: "/utang-piutang",
    nama: "Pengelola Utang & Piutang",
    kategori: "kelola",
    kategoriLabel: "Operasional & Keuangan",
    deskripsi: "Catat kasbon pelanggan dan tagihan supplier, pantau sisa tagihan otomatis, riwayat cicilan, dan pengingat WA.",
    icon: HandCoins,
  },
  {
    href: "/usaha-saya",
    nama: "Portofolio Usaha Saya",
    kategori: "kelola",
    kategoriLabel: "Target & Keuangan",
    deskripsi: "Simpan dan bandingkan catatan HPP, harga jual, serta target beberapa produk sekaligus.",
    icon: Briefcase,
  },
];

const tabs: { id: KategoriId; label: string }[] = [
  { id: "semua", label: "Semua Alat" },
  { id: "mulai", label: "Mulai & Riset" },
  { id: "hitung", label: "Hitung Biaya & Harga" },
  { id: "kelola", label: "Target & Keuangan" },
];

export default function KategoriTools() {
  const [aktif, setAktif] = useState<KategoriId>("semua");

  const tampil =
    aktif === "semua" ? tools : tools.filter((item) => item.kategori === aktif);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Kategori Alat UMKM</p>
            <h2 className="mt-2.5 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Pilih alat bantu sesuai kebutuhan usahamu hari ini.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori alat bisnis"
            className="flex flex-wrap gap-1.5 rounded-xl border border-ink/10 bg-paperDark/80 p-1"
          >
            {tabs.map((tab) => {
              const selected = aktif === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setAktif(tab.id)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition-all duration-150 ${
                    selected
                      ? "bg-surface text-forest shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tampil.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-soft text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] font-medium text-muted">
                      {tool.kategoriLabel}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink transition-colors group-hover:text-forest">
                    {tool.nama}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    {tool.deskripsi}
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
    </section>
  );
}
