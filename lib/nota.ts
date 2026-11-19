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
import { formatRupiah } from "@/lib/hitung";
import { kunciBulanSekarang, tanggalHariIniISO } from "@/lib/paket";

export type MetodePembayaranNota = "tunai" | "transfer" | "qris" | "tempo";
export type StatusPembayaranNota = "lunas" | "dp" | "belum_lunas";
export type StatusDokumenNota = "aktif" | "batal";

export interface ItemNota {
  nama: string;
  qty: number;
  harga: number;
}

export interface NotaFormInput {
  invoiceNumber: string;
  issueDate: string;
  storeName: string;
  storePhone: string;
  storeAddress: string;
  storeLogoData: string;
  customerName: string;
  customerPhone: string;
  items: ItemNota[];
  discountAmount: number;
  shippingFee: number;
  paidAmount: number;
  paymentMethod: MetodePembayaranNota;
  paymentStatus: StatusPembayaranNota;
  notes: string;
}

export interface InvoiceRecord extends NotaFormInput {
  id: string;
  ownerId: string;
  monthKey: string;
  subtotalAmount: number;
  totalAmount: number;
  recordStatus: StatusDokumenNota;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const LABEL_METODE_BAYAR: Record<MetodePembayaranNota, string> = {
  tunai: "Tunai / Cash",
  transfer: "Transfer Bank",
  qris: "QRIS",
  tempo: "Tempo / Kasbon",
};

export const LABEL_STATUS_BAYAR: Record<StatusPembayaranNota, string> = {
  lunas: "Lunas",
  dp: "DP / Sebagian",
  belum_lunas: "Belum Lunas",
};

export function hitungRingkasanNota(
  items: ItemNota[],
  discountAmount: number,
  shippingFee: number,
  paidAmount: number
) {
  const subtotalAmount = items.reduce(
    (sum, item) =>
      sum + Math.max(0, item.qty || 0) * Math.max(0, item.harga || 0),
    0
  );
  const diskon = Math.max(0, discountAmount || 0);
  const ongkir = Math.max(0, shippingFee || 0);
  const totalAmount = Math.max(0, subtotalAmount - diskon + ongkir);
  const dibayar = Math.max(0, paidAmount || 0);
  const sisaTagihan = Math.max(0, totalAmount - dibayar);
  const kembalian = Math.max(0, dibayar - totalAmount);

  let statusSaran: StatusPembayaranNota = "belum_lunas";
  if (totalAmount === 0 || dibayar >= totalAmount) {
    statusSaran = "lunas";
  } else if (dibayar > 0) {
    statusSaran = "dp";
  }

  return {
    subtotalAmount,
    diskon: Math.min(diskon, subtotalAmount),
    ongkir,
    totalAmount,
    dibayar,
    sisaTagihan,
    kembalian,
    statusSaran,
  };
}

export function buatNomorNotaOtomatis(tanggal = new Date()): string {
  const iso = tanggalHariIniISO(tanggal).replace(/-/g, "");
  const acak = String(Math.floor(1000 + Math.random() * 9000));
  return `INV-${iso}-${acak}`;
}

function sanitasiItems(items: ItemNota[]): ItemNota[] {
  const valid = items
    .map((item) => ({
      nama: item.nama.trim().slice(0, 120),
      qty: Math.min(1000000, Math.max(0.01, Number(item.qty) || 0)),
      harga: Math.min(1000000000, Math.max(0, Number(item.harga) || 0)),
    }))
    .filter((item) => item.nama.length > 0 && item.qty > 0)
    .slice(0, 25);

  if (valid.length === 0) {
    throw new Error("Minimal harus ada 1 barang/jasa dengan nama dan jumlah > 0.");
  }
  return valid;
}

function normalisasiTanggalISO(nilai: string): string {
  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(nilai)) return nilai;
  return tanggalHariIniISO();
}

export function sanitasiNotaPayload(
  input: NotaFormInput,
  ownerId: string
): Omit<InvoiceRecord, "id" | "createdAt" | "updatedAt"> {
  const items = sanitasiItems(input.items);
  const ringkasan = hitungRingkasanNota(
    items,
    input.discountAmount,
    input.shippingFee,
    input.paidAmount
  );
  const issueDate = normalisasiTanggalISO(input.issueDate);
  const monthKey = issueDate.slice(0, 7);
  const storeName = input.storeName.trim().slice(0, 120);
  const customerName = input.customerName.trim().slice(0, 120);

  if (!storeName) {
    throw new Error("Nama toko atau usaha wajib diisi.");
  }
  if (!customerName) {
    throw new Error("Nama pelanggan wajib diisi.");
  }

  return {
    ownerId,
    invoiceNumber:
      input.invoiceNumber.trim().slice(0, 40) || buatNomorNotaOtomatis(),
    issueDate,
    monthKey,
    storeName,
    storePhone: input.storePhone.trim().slice(0, 32),
    storeAddress: input.storeAddress.trim().slice(0, 240),
    storeLogoData: input.storeLogoData.slice(0, 120000),
    customerName,
    customerPhone: input.customerPhone.trim().slice(0, 32),
    items,
    discountAmount: Math.max(0, Number(input.discountAmount) || 0),
    shippingFee: Math.max(0, Number(input.shippingFee) || 0),
    subtotalAmount: ringkasan.subtotalAmount,
    totalAmount: ringkasan.totalAmount,
    paidAmount: Math.max(0, Number(input.paidAmount) || 0),
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    recordStatus: "aktif",
    notes: input.notes.trim().slice(0, 300),
  };
}

export async function simpanNotaBaruFirestore(params: {
  uid: string;
  currentMonthKey: string;
  currentCountThisMonth: number;
  input: NotaFormInput;
}): Promise<string> {
  const { uid, currentMonthKey, currentCountThisMonth, input } = params;
  const payload = sanitasiNotaPayload(input, uid);
  const targetMonthKey = payload.monthKey;

  // Pastikan kunci bulan tidak mundur agar konsisten dengan aturan kuota bulanan Firestore
  const effectiveMonthKey =
    targetMonthKey >= currentMonthKey ? targetMonthKey : currentMonthKey;
  payload.monthKey = effectiveMonthKey;

  const nextCount =
    effectiveMonthKey === currentMonthKey ? currentCountThisMonth + 1 : 1;

  const invoiceRef = doc(collection(db, "invoices"));
  const userRef = doc(db, "users", uid);
  const batch = writeBatch(db);

  batch.set(invoiceRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.update(userRef, {
    invoiceMonthKey: effectiveMonthKey,
    invoiceCountThisMonth: nextCount,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return invoiceRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `invoices/${invoiceRef.id}`);
  }
}

export async function perbaruiNotaFirestore(
  invoiceId: string,
  uid: string,
  input: NotaFormInput
): Promise<void> {
  const payload = sanitasiNotaPayload(input, uid);
  const path = `invoices/${invoiceId}`;
  try {
    await updateDoc(doc(db, "invoices", invoiceId), {
      invoiceNumber: payload.invoiceNumber,
      issueDate: payload.issueDate,
      storeName: payload.storeName,
      storePhone: payload.storePhone,
      storeAddress: payload.storeAddress,
      storeLogoData: payload.storeLogoData,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      items: payload.items,
      discountAmount: payload.discountAmount,
      shippingFee: payload.shippingFee,
      subtotalAmount: payload.subtotalAmount,
      totalAmount: payload.totalAmount,
      paidAmount: payload.paidAmount,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      notes: payload.notes,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function perbaruiPembayaranNotaFirestore(
  invoiceId: string,
  paidAmount: number,
  paymentMethod: MetodePembayaranNota,
  paymentStatus: StatusPembayaranNota
): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    await updateDoc(doc(db, "invoices", invoiceId), {
      paidAmount: Math.max(0, Number(paidAmount) || 0),
      paymentMethod,
      paymentStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function batalkanNotaFirestore(invoiceId: string): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    await updateDoc(doc(db, "invoices", invoiceId), {
      recordStatus: "batal",
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function hapusNotaFirestore(invoiceId: string): Promise<void> {
  const path = `invoices/${invoiceId}`;
  try {
    await deleteDoc(doc(db, "invoices", invoiceId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Kompres logo toko ke ukuran ringan (<= 110 KB data URL) agar muat aman di Firestore & PDF
export async function kompresLogoGambar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pilih file gambar (PNG, JPG, atau WebP).");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file logo."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Format gambar tidak didukung."));
      img.onload = () => {
        const maxDim = 180;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Browser tidak mendukung pemrosesan gambar."));
          return;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (dataUrl.length > 100000) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        }
        if (dataUrl.length > 115000) {
          reject(new Error("Ukuran logo setelah dikompres masih terlalu besar."));
          return;
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function normalisasiNomorWAIndonesia(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function buatTautanWhatsAppNota(nota: NotaFormInput): string {
  const ringkasan = hitungRingkasanNota(
    nota.items,
    nota.discountAmount,
    nota.shippingFee,
    nota.paidAmount
  );

  const barisItem = nota.items
    .filter((i) => i.nama.trim())
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.nama.trim()} (${item.qty} x ${formatRupiah(
          item.harga
        )}) = ${formatRupiah(item.qty * item.harga)}`
    )
    .join("\n");

  const bagianRingkasan = [
    `Subtotal: ${formatRupiah(ringkasan.subtotalAmount)}`,
    nota.discountAmount > 0
      ? `Diskon: -${formatRupiah(nota.discountAmount)}`
      : null,
    nota.shippingFee > 0
      ? `Ongkir/Biaya Lain: ${formatRupiah(nota.shippingFee)}`
      : null,
    `*Total Tagihan: ${formatRupiah(ringkasan.totalAmount)}*`,
    `Dibayar (${LABEL_METODE_BAYAR[nota.paymentMethod]}): ${formatRupiah(
      nota.paidAmount
    )}`,
    ringkasan.sisaTagihan > 0
      ? `Sisa Tagihan: ${formatRupiah(ringkasan.sisaTagihan)}`
      : ringkasan.kembalian > 0
      ? `Kembalian: ${formatRupiah(ringkasan.kembalian)}`
      : null,
    `Status: *${LABEL_STATUS_BAYAR[nota.paymentStatus]}*`,
  ]
    .filter(Boolean)
    .join("\n");

  const pesan = [
    `*NOTA PENJUALAN — ${nota.storeName || "Toko"}*`,
    nota.storePhone ? `Telp/WA: ${nota.storePhone}` : null,
    nota.storeAddress ? `Alamat: ${nota.storeAddress}` : null,
    `------------------------------`,
    `No. Nota: ${nota.invoiceNumber}`,
    `Tanggal: ${nota.issueDate}`,
    `Pelanggan: ${nota.customerName || "-"}`,
    `------------------------------`,
    barisItem,
    `------------------------------`,
    bagianRingkasan,
    nota.notes.trim() ? `\nCatatan: ${nota.notes.trim()}` : null,
    `\nTerima kasih telah berbelanja!`,
  ]
    .filter(Boolean)
    .join("\n");

  const phone = normalisasiNomorWAIndonesia(nota.customerPhone);
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(pesan)}`;
}

const DRAFT_KEY = "cuankit_nota_draft_v1";

export function buatNotaKosong(defaults?: {
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
  storeLogoData?: string;
}): NotaFormInput {
  return {
    invoiceNumber: buatNomorNotaOtomatis(),
    issueDate: tanggalHariIniISO(),
    storeName: defaults?.storeName || "",
    storePhone: defaults?.storePhone || "",
    storeAddress: defaults?.storeAddress || "",
    storeLogoData: defaults?.storeLogoData || "",
    customerName: "",
    customerPhone: "",
    items: [{ nama: "", qty: 1, harga: 0 }],
    discountAmount: 0,
    shippingFee: 0,
    paidAmount: 0,
    paymentMethod: "tunai",
    paymentStatus: "lunas",
    notes: "Barang yang sudah dibeli tidak dapat ditukar kecuali ada perjanjian.",
  };
}

export function bacaDraftNotaLokal(): NotaFormInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NotaFormInput;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function simpanDraftNotaLokal(draft: NotaFormInput): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Abaikan kuota penuh pada draft sementara
  }
}

export function kuotaTerpakaiBulanBerjalan(
  invoiceMonthKey?: string,
  invoiceCountThisMonth?: number
): number {
  const sekarang = kunciBulanSekarang();
  if (!invoiceMonthKey || invoiceMonthKey !== sekarang) return 0;
  return Math.max(0, invoiceCountThisMonth ?? 0);
}
