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
import { normalisasiNomorWAIndonesia } from "@/lib/nota";
import { tanggalHariIniISO } from "@/lib/paket";

export type JenisUtangPiutang = "piutang" | "utang";
export type StatusUtangPiutang = "belum_lunas" | "lunas";
export type MetodeBayarCicilan = "tunai" | "transfer" | "qris" | "lainnya";

export interface DebtRecordInput {
  type: JenisUtangPiutang;
  partyName: string;
  partyPhone: string;
  totalAmount: number;
  transactionDate: string;
  dueDate: string;
  note: string;
}

export interface DebtRecord extends DebtRecordInput {
  id: string;
  ownerId: string;
  paidAmount: number;
  remainingAmount: number;
  status: StatusUtangPiutang;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DebtPaymentRecord {
  id: string;
  ownerId: string;
  debtId: string;
  partyName: string;
  amount: number;
  paymentDate: string;
  method: MetodeBayarCicilan;
  note: string;
  createdAt?: Timestamp;
}

export const LABEL_JENIS_UTANG: Record<JenisUtangPiutang, string> = {
  piutang: "Piutang Pelanggan",
  utang: "Utang Usaha",
};

export const LABEL_METODE_CICILAN: Record<MetodeBayarCicilan, string> = {
  tunai: "Tunai",
  transfer: "Transfer Bank",
  qris: "QRIS",
  lainnya: "Lainnya",
};

export function cekLewatJatuhTempo(debt: DebtRecord, hariIni = tanggalHariIniISO()): boolean {
  if (debt.status === "lunas" || !debt.dueDate) return false;
  return debt.dueDate < hariIni;
}

export function hitungRingkasanUtangPiutang(
  debts: DebtRecord[],
  hariIni = tanggalHariIniISO()
) {
  let totalPiutangSisa = 0;
  let jumlahPiutangAktif = 0;
  let totalUtangSisa = 0;
  let jumlahUtangAktif = 0;
  let jumlahJatuhTempo = 0;
  let jumlahLunas = 0;

  for (const d of debts) {
    const sisa = Math.max(0, Number(d.remainingAmount) || 0);
    if (d.status === "lunas" || sisa === 0) {
      jumlahLunas += 1;
      continue;
    }

    if (d.type === "piutang") {
      totalPiutangSisa += sisa;
      jumlahPiutangAktif += 1;
    } else {
      totalUtangSisa += sisa;
      jumlahUtangAktif += 1;
    }

    if (cekLewatJatuhTempo(d, hariIni)) {
      jumlahJatuhTempo += 1;
    }
  }

  return {
    totalPiutangSisa,
    jumlahPiutangAktif,
    totalUtangSisa,
    jumlahUtangAktif,
    jumlahJatuhTempo,
    jumlahLunas,
    selisihBersih: totalPiutangSisa - totalUtangSisa,
  };
}

function sanitasiDebtInput(input: DebtRecordInput): DebtRecordInput {
  const partyName = input.partyName.trim().slice(0, 120);
  if (!partyName) {
    throw new Error("Nama pelanggan atau pihak terkait wajib diisi.");
  }

  const totalAmount = Math.min(
    10000000000,
    Math.max(0, Math.round(Number(input.totalAmount) || 0))
  );
  if (totalAmount <= 0) {
    throw new Error("Nominal utang atau piutang harus lebih dari Rp 0.");
  }

  const transactionDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(
    input.transactionDate
  )
    ? input.transactionDate
    : tanggalHariIniISO();

  const dueDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.dueDate)
    ? input.dueDate
    : "";

  return {
    type: input.type === "utang" ? "utang" : "piutang",
    partyName,
    partyPhone: input.partyPhone.trim().slice(0, 32),
    totalAmount,
    transactionDate,
    dueDate,
    note: input.note.trim().slice(0, 240),
  };
}

export async function tambahCatatanUtangFirestore(
  uid: string,
  input: DebtRecordInput
): Promise<string> {
  const clean = sanitasiDebtInput(input);
  const ref = doc(collection(db, "debts"));
  const batch = writeBatch(db);

  batch.set(ref, {
    ownerId: uid,
    ...clean,
    paidAmount: 0,
    remainingAmount: clean.totalAmount,
    status: "belum_lunas",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return ref.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `debts/${ref.id}`);
  }
}

export async function ubahDetailUtangFirestore(
  debtId: string,
  input: Omit<DebtRecordInput, "totalAmount">
): Promise<void> {
  const clean = sanitasiDebtInput({ ...input, totalAmount: 1 });
  const path = `debts/${debtId}`;

  try {
    await updateDoc(doc(db, "debts", debtId), {
      type: clean.type,
      partyName: clean.partyName,
      partyPhone: clean.partyPhone,
      transactionDate: clean.transactionDate,
      dueDate: clean.dueDate,
      note: clean.note,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function catatCicilanUtangFirestore(params: {
  uid: string;
  debt: DebtRecord;
  amount: number;
  paymentDate: string;
  method: MetodeBayarCicilan;
  note: string;
}): Promise<{ remainingAmount: number; status: StatusUtangPiutang }> {
  const { uid, debt, amount, paymentDate, method, note } = params;

  if (debt.status === "lunas" || debt.remainingAmount <= 0) {
    throw new Error("Tagihan ini sudah lunas.");
  }

  const bayar = Math.round(Number(amount) || 0);
  if (bayar <= 0) {
    throw new Error("Nominal pembayaran harus lebih dari Rp 0.");
  }
  if (bayar > debt.remainingAmount) {
    throw new Error(
      `Nominal pembayaran melebihi sisa tagihan (${formatRupiah(
        debt.remainingAmount
      )}).`
    );
  }

  const safeDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(paymentDate)
    ? paymentDate
    : tanggalHariIniISO();

  const paidAfter = debt.paidAmount + bayar;
  const remainingAfter = Math.max(0, debt.totalAmount - paidAfter);
  const statusAfter: StatusUtangPiutang =
    remainingAfter === 0 ? "lunas" : "belum_lunas";

  const debtRef = doc(db, "debts", debt.id);
  const paymentRef = doc(collection(db, "debtPayments"));
  const batch = writeBatch(db);

  batch.update(debtRef, {
    paidAmount: paidAfter,
    remainingAmount: remainingAfter,
    status: statusAfter,
    updatedAt: serverTimestamp(),
  });

  batch.set(paymentRef, {
    ownerId: uid,
    debtId: debt.id,
    partyName: debt.partyName.slice(0, 120),
    amount: bayar,
    paymentDate: safeDate,
    method,
    note: note.trim().slice(0, 200),
    createdAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return { remainingAmount: remainingAfter, status: statusAfter };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `debts/${debt.id}`);
  }
}

export async function hapusCatatanUtangFirestore(debtId: string): Promise<void> {
  const path = `debts/${debtId}`;
  try {
    await deleteDoc(doc(db, "debts", debtId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function buatTautanWhatsAppTagihan(
  debt: DebtRecord,
  namaUsaha?: string
): string {
  const pengirim = namaUsaha?.trim() || "Kami";
  const pesan = [
    `Halo Kak *${debt.partyName}*,`,
    "",
    debt.type === "piutang"
      ? `Izin mengingatkan catatan tagihan dari *${pengirim}* dengan rincian berikut:`
      : `Berikut rincian catatan pembayaran ke *${debt.partyName}* dari *${pengirim}*:`,
    `• Tanggal Transaksi: ${debt.transactionDate}`,
    debt.dueDate ? `• Jatuh Tempo: ${debt.dueDate}` : null,
    `• Total Tagihan: ${formatRupiah(debt.totalAmount)}`,
    debt.paidAmount > 0 ? `• Sudah Dibayar: ${formatRupiah(debt.paidAmount)}` : null,
    `• *Sisa Tagihan: ${formatRupiah(debt.remainingAmount)}*`,
    debt.note ? `• Catatan: ${debt.note}` : null,
    "",
    debt.type === "piutang"
      ? "Mohon konfirmasinya jika pembayaran sudah dilakukan ya Kak. Terima kasih banyak."
      : "Terima kasih atas kerja samanya.",
  ]
    .filter(Boolean)
    .join("\n");

  const phone = normalisasiNomorWAIndonesia(debt.partyPhone);
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(pesan)}`;
}

const LOCAL_DEBTS_KEY = "cuankit_utang_tamu_v1";
const LOCAL_DEBT_PAYMENTS_KEY = "cuankit_utang_bayar_tamu_v1";

export function bacaUtangLokal(): {
  debts: DebtRecord[];
  payments: DebtPaymentRecord[];
} {
  if (typeof window === "undefined") return { debts: [], payments: [] };
  try {
    const rawDebts = window.localStorage.getItem(LOCAL_DEBTS_KEY);
    const rawPayments = window.localStorage.getItem(LOCAL_DEBT_PAYMENTS_KEY);
    return {
      debts: rawDebts ? (JSON.parse(rawDebts) as DebtRecord[]) : [],
      payments: rawPayments
        ? (JSON.parse(rawPayments) as DebtPaymentRecord[])
        : [],
    };
  } catch {
    return { debts: [], payments: [] };
  }
}

export function simpanUtangLokal(
  debts: DebtRecord[],
  payments: DebtPaymentRecord[]
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_DEBTS_KEY, JSON.stringify(debts.slice(0, 80)));
    window.localStorage.setItem(
      LOCAL_DEBT_PAYMENTS_KEY,
      JSON.stringify(payments.slice(0, 160))
    );
  } catch {
    // Abaikan jika kuota penyimpanan penuh
  }
}
