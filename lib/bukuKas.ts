import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { tanggalHariIniISO } from "@/lib/paket";

export type JenisKas = "masuk" | "keluar";
export type MetodeKas = "tunai" | "transfer" | "qris" | "lainnya";
export type PeriodeLaporanKas = "harian" | "mingguan" | "bulanan";

export interface CashTransactionInput {
  type: JenisKas;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: MetodeKas;
  description: string;
}

export interface CashTransactionRecord extends CashTransactionInput {
  id: string;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const KATEGORI_PEMASUKAN = [
  "Penjualan Harian",
  "Pembayaran Piutang",
  "Modal Tambahan",
  "Pendapatan Lain",
];

export const KATEGORI_PENGELUARAN = [
  "Bahan Baku & Stok",
  "Operasional & Kemasan",
  "Gaji / Upah",
  "Sewa, Listrik & Air",
  "Ongkir & Transport",
  "Peralatan & Lainnya",
];

export const LABEL_METODE_KAS: Record<MetodeKas, string> = {
  tunai: "Tunai",
  transfer: "Transfer Bank",
  qris: "QRIS",
  lainnya: "Lainnya",
};

function normalisasiTanggalISO(nilai: string): string {
  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(nilai)) return nilai;
  return tanggalHariIniISO();
}

function geserHariISO(tanggalISO: string, deltaHari: number): string {
  const [y, m, d] = tanggalISO.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  dt.setUTCDate(dt.getUTCDate() + deltaHari);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function formatTanggalPendekID(tanggalISO: string): string {
  const [, m, d] = tanggalISO.split("-");
  const bulan = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${Number(d)} ${bulan[Number(m)] || m}`;
}

export function sanitasiTransaksiPayload(
  input: CashTransactionInput,
  ownerId: string
) {
  const amount = Math.min(10000000000, Math.max(0, Number(input.amount) || 0));
  if (amount <= 0) {
    throw new Error("Nominal transaksi harus lebih besar dari Rp 0.");
  }
  const category = input.category.trim().slice(0, 50);
  if (!category) {
    throw new Error("Kategori transaksi wajib dipilih atau diisi.");
  }
  return {
    ownerId,
    type: input.type,
    amount,
    category,
    date: normalisasiTanggalISO(input.date),
    paymentMethod: input.paymentMethod,
    description: input.description.trim().slice(0, 200),
  };
}

export async function tambahTransaksiKasFirestore(
  uid: string,
  input: CashTransactionInput
): Promise<string> {
  const payload = sanitasiTransaksiPayload(input, uid);
  try {
    const ref = await addDoc(collection(db, "transactions"), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, "transactions");
  }
}

export async function ubahTransaksiKasFirestore(
  id: string,
  uid: string,
  input: CashTransactionInput
): Promise<void> {
  const payload = sanitasiTransaksiPayload(input, uid);
  try {
    await updateDoc(doc(db, "transactions", id), {
      type: payload.type,
      amount: payload.amount,
      category: payload.category,
      date: payload.date,
      paymentMethod: payload.paymentMethod,
      description: payload.description,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `transactions/${id}`);
  }
}

export async function hapusTransaksiKasFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "transactions", id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `transactions/${id}`);
  }
}

export function filterTransaksiByPeriode<T extends { date: string }>(
  daftar: T[],
  periode: PeriodeLaporanKas,
  tanggalAcuan: string
): T[] {
  const acuan = normalisasiTanggalISO(tanggalAcuan);
  if (periode === "harian") {
    return daftar.filter((t) => t.date === acuan);
  }
  if (periode === "mingguan") {
    const awal = geserHariISO(acuan, -6);
    return daftar.filter((t) => t.date >= awal && t.date <= acuan);
  }
  const bulan = acuan.slice(0, 7);
  return daftar.filter((t) => t.date.slice(0, 7) === bulan);
}

export interface RingkasanKas {
  totalMasuk: number;
  totalKeluar: number;
  saldoBersih: number;
  jumlahMasuk: number;
  jumlahKeluar: number;
  kategoriTeratas: {
    kategori: string;
    type: JenisKas;
    total: number;
  }[];
}

export function hitungRingkasanKas(
  daftar: { type: JenisKas; amount: number; category: string }[]
): RingkasanKas {
  let totalMasuk = 0;
  let totalKeluar = 0;
  let jumlahMasuk = 0;
  let jumlahKeluar = 0;
  const mapKat = new Map<string, { kategori: string; type: JenisKas; total: number }>();

  for (const item of daftar) {
    const nom = Math.max(0, Number(item.amount) || 0);
    if (item.type === "masuk") {
      totalMasuk += nom;
      jumlahMasuk += 1;
    } else {
      totalKeluar += nom;
      jumlahKeluar += 1;
    }
    const key = `${item.type}::${item.category}`;
    const existing = mapKat.get(key);
    if (existing) {
      existing.total += nom;
    } else {
      mapKat.set(key, { kategori: item.category, type: item.type, total: nom });
    }
  }

  const kategoriTeratas = Array.from(mapKat.values()).sort(
    (a, b) => b.total - a.total
  );

  return {
    totalMasuk,
    totalKeluar,
    saldoBersih: totalMasuk - totalKeluar,
    jumlahMasuk,
    jumlahKeluar,
    kategoriTeratas,
  };
}

export interface TitikGrafikKas {
  key: string;
  label: string;
  masuk: number;
  keluar: number;
}

export function buatDataGrafikKas(
  semuaTransaksi: { type: JenisKas; amount: number; date: string }[],
  periode: PeriodeLaporanKas,
  tanggalAcuan: string
): TitikGrafikKas[] {
  const acuan = normalisasiTanggalISO(tanggalAcuan);

  if (periode === "harian" || periode === "mingguan") {
    // Tampilkan tren 7 hari terakhir hingga tanggalAcuan
    const hari: TitikGrafikKas[] = [];
    for (let i = -6; i <= 0; i++) {
      const tgl = geserHariISO(acuan, i);
      let masuk = 0;
      let keluar = 0;
      for (const tx of semuaTransaksi) {
        if (tx.date === tgl) {
          if (tx.type === "masuk") masuk += tx.amount;
          else keluar += tx.amount;
        }
      }
      hari.push({
        key: tgl,
        label: formatTanggalPendekID(tgl),
        masuk,
        keluar,
      });
    }
    return hari;
  }

  // Bulanan: bagi menjadi pekan (Tgl 1-7, 8-14, 15-21, 22-31) agar bersih dan terbaca di mobile
  const bulan = acuan.slice(0, 7);
  const buckets: { label: string; min: number; max: number }[] = [
    { label: "Tgl 1–7", min: 1, max: 7 },
    { label: "Tgl 8–14", min: 8, max: 14 },
    { label: "Tgl 15–21", min: 15, max: 21 },
    { label: "Tgl 22–31", min: 22, max: 31 },
  ];

  return buckets.map((b, idx) => {
    let masuk = 0;
    let keluar = 0;
    for (const tx of semuaTransaksi) {
      if (tx.date.slice(0, 7) !== bulan) continue;
      const dayNum = Number(tx.date.slice(8, 10));
      if (dayNum >= b.min && dayNum <= b.max) {
        if (tx.type === "masuk") masuk += tx.amount;
        else keluar += tx.amount;
      }
    }
    return {
      key: `${bulan}-w${idx + 1}`,
      label: b.label,
      masuk,
      keluar,
    };
  });
}

export function eksporCSVBukuKas(
  daftar: CashTransactionRecord[],
  namaFile: string
) {
  const escapeCSV = (val: string | number) => {
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const header = ["Tanggal", "Jenis", "Kategori", "Metode", "Nominal (Rp)", "Catatan"];
  const rows = daftar.map((t) => [
    t.date,
    t.type === "masuk" ? "Pemasukan" : "Pengeluaran",
    t.category,
    LABEL_METODE_KAS[t.paymentMethod],
    t.amount,
    t.description || "-",
  ]);
  const csv =
    "\uFEFF" +
    [header, ...rows]
      .map((r) => r.map(escapeCSV).join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${namaFile}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const LOCAL_KAS_KEY = "cuankit_buku_kas_tamu_v1";

export function bacaTransaksiLokalKas(): CashTransactionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function simpanTransaksiLokalKas(data: CashTransactionRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_KAS_KEY, JSON.stringify(data.slice(0, 100)));
  } catch {
    // Abaikan jika storage penuh
  }
}
