// Arsitektur paket langganan & kesiapan integrasi payment gateway Indonesia (CuanKit.id).
// Tidak ada pembayaran palsu; modul ini memisahkan hak akses Gratis vs Premium
// serta menyediakan kontrak integrasi untuk payment gateway (Midtrans / Xendit / Duitku).

export type PaketTier = "gratis" | "premium";

export const BATAS_NOTA_GRATIS_BULANAN = 15;
export const HARGA_PREMIUM_BULANAN = 49000;
export const HARGA_PREMIUM_TAHUNAN = 468000;

export type FiturCuanKit =
  | "kalkulator_hpp"
  | "kalkulator_bep"
  | "simulasi_usaha"
  | "generator_nota_dasar"
  | "generator_nota_tanpa_batas"
  | "buku_kas_dasar"
  | "buku_kas_laporan_lanjutan"
  | "manajemen_stok_lengkap"
  | "katalog_digital_ekstra"
  | "asisten_ai"
  | "ekspor_laporan_lanjutan";

export interface RingkasanFiturPaket {
  id: FiturCuanKit;
  nama: string;
  deskripsi: string;
  gratis: string;
  premium: string;
  tersediaGratis: boolean;
}

export const DAFTAR_FITUR_PAKET: RingkasanFiturPaket[] = [
  {
    id: "kalkulator_hpp",
    nama: "Kalkulator HPP, BEP, Target Cuan & Simulasi",
    deskripsi: "Semua alat hitung modal, biaya produksi, titik impas, gaji, dan pinjaman.",
    gratis: "Tanpa batas",
    premium: "Tanpa batas",
    tersediaGratis: true,
  },
  {
    id: "generator_nota_dasar",
    nama: "Generator Nota & Invoice",
    deskripsi: "Buat nota penjualan dengan logo toko, ekspor PDF, dan kirim via WhatsApp.",
    gratis: `Maksimal ${BATAS_NOTA_GRATIS_BULANAN} nota / bulan`,
    premium: "Tanpa batas + riwayat penuh",
    tersediaGratis: true,
  },
  {
    id: "buku_kas_dasar",
    nama: "Buku Kas Harian & Saldo Otomatis",
    deskripsi: "Catat pemasukan dan pengeluaran harian beserta laporan periode.",
    gratis: "Fitur pencatatan dasar",
    premium: "Laporan lanjutan & ekspor penuh",
    tersediaGratis: true,
  },
  {
    id: "manajemen_stok_lengkap",
    nama: "Manajemen Stok & Peringatan Menipis",
    deskripsi: "Kelola stok masuk/keluar, harga modal/jual, dan riwayat mutasi barang.",
    gratis: "Segera dengan batas item",
    premium: "Item & riwayat tak terbatas",
    tersediaGratis: false,
  },
  {
    id: "katalog_digital_ekstra",
    nama: "Katalog Produk Digital & QR Code",
    deskripsi: "Halaman etalase online toko dengan tombol order langsung ke WhatsApp.",
    gratis: "Etalase dasar",
    premium: "Produk ekstra & kustomisasi toko",
    tersediaGratis: false,
  },
  {
    id: "asisten_ai",
    nama: "Asisten Analisis Usaha AI",
    deskripsi: "Analisis otomatis arus kas, produk paling untung, dan rekomendasi efisiensi.",
    gratis: "Belum termasuk",
    premium: "Tersedia penuh",
    tersediaGratis: false,
  },
];

export function cekAksesFitur(plan: PaketTier, fitur: FiturCuanKit): boolean {
  if (plan === "premium") return true;
  return (
    fitur === "kalkulator_hpp" ||
    fitur === "kalkulator_bep" ||
    fitur === "simulasi_usaha" ||
    fitur === "generator_nota_dasar" ||
    fitur === "buku_kas_dasar"
  );
}

export interface StatusKuotaNota {
  plan: PaketTier;
  terpakai: number;
  batas: number | null; // null = unlimited
  sisa: number | null;
  bolehBuat: boolean;
}

export function hitungStatusKuotaNota(plan: PaketTier, terpakaiBulanIni: number): StatusKuotaNota {
  const aman = Math.max(0, Math.floor(terpakaiBulanIni));
  if (plan === "premium") {
    return {
      plan,
      terpakai: aman,
      batas: null,
      sisa: null,
      bolehBuat: true,
    };
  }
  const sisa = Math.max(0, BATAS_NOTA_GRATIS_BULANAN - aman);
  return {
    plan,
    terpakai: aman,
    batas: BATAS_NOTA_GRATIS_BULANAN,
    sisa,
    bolehBuat: aman < BATAS_NOTA_GRATIS_BULANAN,
  };
}

export function kunciBulanSekarang(tanggal = new Date()): string {
  const y = tanggal.getFullYear();
  const m = String(tanggal.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function tanggalHariIniISO(tanggal = new Date()): string {
  const y = tanggal.getFullYear();
  const m = String(tanggal.getMonth() + 1).padStart(2, "0");
  const d = String(tanggal.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---- Kontrak Integrasi Payment Gateway Indonesia (Midtrans / Xendit / Duitku) ----

export type PaymentGatewayProvider = "midtrans" | "xendit" | "duitku";
export type MetodeBayarLangganan = "qris" | "virtual_account" | "ewallet";
export type SiklusLangganan = "bulanan" | "tahunan";

export interface CheckoutIntentPayload {
  uid: string;
  email: string;
  siklus: SiklusLangganan;
  metode: MetodeBayarLangganan;
  provider: PaymentGatewayProvider;
}

export interface CheckoutIntentResponse {
  tersedia: boolean;
  provider: PaymentGatewayProvider;
  nominal: number;
  pesan: string;
  redirectUrl?: string;
}

export const METODE_PEMBAYARAN_INDONESIA: {
  id: MetodeBayarLangganan;
  label: string;
  contoh: string;
}[] = [
  { id: "qris", label: "QRIS", contoh: "GoPay, OVO, DANA, ShopeePay, BCA Mobile" },
  { id: "virtual_account", label: "Virtual Account", contoh: "BCA, BRI, Mandiri, BNI, BSI" },
  { id: "ewallet", label: "Dompet Digital", contoh: "DANA, OVO, LinkAja, ShopeePay" },
];
