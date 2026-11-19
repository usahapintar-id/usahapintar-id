import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { tanggalHariIniISO } from "@/lib/paket";

export const BATAS_BARANG_STOK_GRATIS = 25;

export type JenisMutasiStok = "masuk" | "keluar" | "koreksi" | "awal";
export type StatusStok = "habis" | "menipis" | "aman";

export interface InventoryItemInput {
  name: string;
  sku: string;
  unit: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
}

export interface InventoryItemRecord extends InventoryItemInput {
  id: string;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface StockLogRecord {
  id: string;
  ownerId: string;
  itemId: string;
  itemName: string;
  type: JenisMutasiStok;
  delta: number;
  stockBefore: number;
  stockAfter: number;
  unit: string;
  note: string;
  date: string;
  createdAt?: Timestamp;
}

export const SATUAN_UMUM = [
  "pcs",
  "bungkus",
  "botol",
  "cup",
  "porsi",
  "kg",
  "gram",
  "liter",
  "dus",
  "pak",
];

export const KATEGORI_STOK_UMUM = [
  "Bahan Baku",
  "Produk Jadi",
  "Kemasan",
  "Minuman",
  "Makanan",
  "Perlengkapan",
  "Lainnya",
];

export const LABEL_MUTASI_STOK: Record<JenisMutasiStok, string> = {
  masuk: "Stok Masuk",
  keluar: "Stok Keluar",
  koreksi: "Stok Opname / Koreksi",
  awal: "Stok Awal",
};

export function cekStatusStok(stock: number, minStock: number): StatusStok {
  if (stock <= 0) return "habis";
  if (stock <= minStock) return "menipis";
  return "aman";
}

export function hitungRingkasanStok(items: InventoryItemRecord[]) {
  let totalUnit = 0;
  let totalNilaiModal = 0;
  let totalPotensiJual = 0;
  let jumlahMenipis = 0;
  let jumlahHabis = 0;

  for (const item of items) {
    const qty = Math.max(0, Number(item.stock) || 0);
    const modal = Math.max(0, Number(item.costPrice) || 0);
    const jual = Math.max(0, Number(item.sellPrice) || 0);
    totalUnit += qty;
    totalNilaiModal += qty * modal;
    totalPotensiJual += qty * jual;
    const status = cekStatusStok(qty, item.minStock);
    if (status === "habis") jumlahHabis += 1;
    else if (status === "menipis") jumlahMenipis += 1;
  }

  return {
    totalJenis: items.length,
    totalUnit,
    totalNilaiModal,
    totalPotensiJual,
    jumlahMenipis,
    jumlahHabis,
  };
}

function sanitasiInventoryInput(input: InventoryItemInput) {
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new Error("Nama barang wajib diisi.");
  const unit = input.unit.trim().slice(0, 20) || "pcs";
  return {
    name,
    sku: input.sku.trim().slice(0, 40),
    unit,
    category: input.category.trim().slice(0, 50) || "Lainnya",
    costPrice: Math.min(1000000000, Math.max(0, Number(input.costPrice) || 0)),
    sellPrice: Math.min(1000000000, Math.max(0, Number(input.sellPrice) || 0)),
    stock: Math.min(10000000, Math.max(0, Number(input.stock) || 0)),
    minStock: Math.min(1000000, Math.max(0, Number(input.minStock) || 0)),
  };
}

export async function tambahBarangFirestore(
  uid: string,
  input: InventoryItemInput
): Promise<string> {
  const clean = sanitasiInventoryInput(input);
  const itemRef = doc(collection(db, "inventory"));
  const batch = writeBatch(db);

  batch.set(itemRef, {
    ownerId: uid,
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (clean.stock > 0) {
    const logRef = doc(collection(db, "stockLogs"));
    batch.set(logRef, {
      ownerId: uid,
      itemId: itemRef.id,
      itemName: clean.name,
      type: "awal",
      delta: clean.stock,
      stockBefore: 0,
      stockAfter: clean.stock,
      unit: clean.unit,
      note: "Saldo stok awal barang baru",
      date: tanggalHariIniISO(),
      createdAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
    return itemRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `inventory/${itemRef.id}`);
  }
}

export async function ubahDetailBarangFirestore(
  itemId: string,
  input: Omit<InventoryItemInput, "stock">
): Promise<void> {
  const clean = sanitasiInventoryInput({ ...input, stock: 0 });
  const path = `inventory/${itemId}`;
  try {
    await updateDoc(doc(db, "inventory", itemId), {
      name: clean.name,
      sku: clean.sku,
      unit: clean.unit,
      category: clean.category,
      costPrice: clean.costPrice,
      sellPrice: clean.sellPrice,
      minStock: clean.minStock,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function catatMutasiStokFirestore(params: {
  uid: string;
  item: InventoryItemRecord;
  type: "masuk" | "keluar" | "koreksi";
  jumlah: number;
  note: string;
  date: string;
}): Promise<number> {
  const { uid, item, type, jumlah, note, date } = params;
  const stockBefore = Math.max(0, Number(item.stock) || 0);
  const angka = Math.max(0, Number(jumlah) || 0);

  let stockAfter = stockBefore;
  if (type === "masuk") {
    if (angka <= 0) throw new Error("Jumlah stok masuk harus lebih dari 0.");
    stockAfter = Math.min(10000000, stockBefore + angka);
  } else if (type === "keluar") {
    if (angka <= 0) throw new Error("Jumlah stok keluar harus lebih dari 0.");
    if (angka > stockBefore) {
      throw new Error(
        `Stok tersedia (${stockBefore} ${item.unit}) tidak mencukupi untuk pengeluaran ${angka} ${item.unit}.`
      );
    }
    stockAfter = stockBefore - angka;
  } else {
    stockAfter = Math.min(10000000, angka);
  }

  const delta = stockAfter - stockBefore;
  const safeDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)
    ? date
    : tanggalHariIniISO();

  const itemRef = doc(db, "inventory", item.id);
  const logRef = doc(collection(db, "stockLogs"));
  const batch = writeBatch(db);

  batch.update(itemRef, {
    stock: stockAfter,
    updatedAt: serverTimestamp(),
  });

  batch.set(logRef, {
    ownerId: uid,
    itemId: item.id,
    itemName: item.name.slice(0, 120),
    type,
    delta,
    stockBefore,
    stockAfter,
    unit: item.unit.slice(0, 20),
    note: note.trim().slice(0, 200),
    date: safeDate,
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return stockAfter;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `inventory/${item.id}`);
  }
}

export async function hapusBarangFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "inventory", itemId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `inventory/${itemId}`);
  }
}

export function eksporCSVStok(items: InventoryItemRecord[], namaFile: string) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = [
    "Nama Barang",
    "SKU",
    "Kategori",
    "Stok Tersedia",
    "Satuan",
    "Batas Minimum",
    "Harga Modal (Rp)",
    "Harga Jual (Rp)",
    "Nilai Modal Persediaan (Rp)",
  ];
  const rows = items.map((i) => [
    i.name,
    i.sku || "-",
    i.category,
    i.stock,
    i.unit,
    i.minStock,
    i.costPrice,
    i.sellPrice,
    i.stock * i.costPrice,
  ]);
  const csv =
    "\uFEFF" +
    [header, ...rows].map((r) => r.map(esc).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${namaFile}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const LOCAL_STOK_KEY = "cuankit_stok_tamu_v1";
const LOCAL_STOK_LOG_KEY = "cuankit_stok_log_tamu_v1";

export function bacaStokLokal(): {
  items: InventoryItemRecord[];
  logs: StockLogRecord[];
} {
  if (typeof window === "undefined") return { items: [], logs: [] };
  try {
    const rawItems = window.localStorage.getItem(LOCAL_STOK_KEY);
    const rawLogs = window.localStorage.getItem(LOCAL_STOK_LOG_KEY);
    return {
      items: rawItems ? (JSON.parse(rawItems) as InventoryItemRecord[]) : [],
      logs: rawLogs ? (JSON.parse(rawLogs) as StockLogRecord[]) : [],
    };
  } catch {
    return { items: [], logs: [] };
  }
}

export function simpanStokLokal(
  items: InventoryItemRecord[],
  logs: StockLogRecord[]
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STOK_KEY, JSON.stringify(items.slice(0, 50)));
    window.localStorage.setItem(LOCAL_STOK_LOG_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch {
    // Abaikan kuota penuh
  }
}
