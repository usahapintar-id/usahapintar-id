"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  HandCoins,
  History,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AuthAkunPanel from "@/components/AuthAkunPanel";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import TombolUnduh from "@/components/TombolUnduh";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { angkaNonNegatif, formatRupiah } from "@/lib/hitung";
import { tanggalHariIniISO } from "@/lib/paket";
import {
  bacaUtangLokal,
  buatTautanWhatsAppTagihan,
  catatCicilanUtangFirestore,
  cekLewatJatuhTempo,
  hapusCatatanUtangFirestore,
  hitungRingkasanUtangPiutang,
  LABEL_JENIS_UTANG,
  LABEL_METODE_CICILAN,
  simpanUtangLokal,
  tambahCatatanUtangFirestore,
  ubahDetailUtangFirestore,
  type DebtPaymentRecord,
  type DebtRecord,
  type DebtRecordInput,
  type JenisUtangPiutang,
  type MetodeBayarCicilan,
} from "@/lib/utangPiutang";

function buatFormKosong(): DebtRecordInput {
  return {
    type: "piutang",
    partyName: "",
    partyPhone: "",
    totalAmount: 0,
    transactionDate: tanggalHariIniISO(),
    dueDate: "",
    note: "",
  };
}

export default function UtangPiutangManager() {
  const { user, profile, authReady } = useFirebaseAuth();

  const [debtsCloud, setDebtsCloud] = useState<DebtRecord[]>([]);
  const [paymentsCloud, setPaymentsCloud] = useState<DebtPaymentRecord[]>([]);
  const [debtsTamu, setDebtsTamu] = useState<DebtRecord[]>([]);
  const [paymentsTamu, setPaymentsTamu] = useState<DebtPaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Catatan Utang/Piutang
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DebtRecordInput>(() => buatFormKosong());
  const [savingDebt, setSavingDebt] = useState(false);

  // Panel Catat Pembayaran / Cicilan
  const [bayarTarget, setBayarTarget] = useState<DebtRecord | null>(null);
  const [bayarNominal, setBayarNominal] = useState<number>(0);
  const [bayarTanggal, setBayarTanggal] = useState<string>(() =>
    tanggalHariIniISO()
  );
  const [bayarMetode, setBayarMetode] = useState<MetodeBayarCicilan>("tunai");
  const [bayarCatatan, setBayarCatatan] = useState<string>("");
  const [savingBayar, setSavingBayar] = useState(false);

  // Tab & Filter Kanan
  const [tabKanan, setTabKanan] = useState<"daftar" | "riwayat">("daftar");
  const [filterJenis, setFilterJenis] = useState<
    "semua" | JenisUtangPiutang
  >("semua");
  const [filterStatus, setFilterStatus] = useState<
    "semua" | "belum_lunas" | "lunas"
  >("semua");
  const [filterDebtIdRiwayat, setFilterDebtIdRiwayat] = useState<string | null>(
    null
  );
  const [cari, setCari] = useState("");
  const [hapusKonfirmasiId, setHapusKonfirmasiId] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  useEffect(() => {
    const lokal = bacaUtangLokal();
    setDebtsTamu(lokal.debts);
    setPaymentsTamu(lokal.payments);
  }, []);

  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setDebtsCloud([]);
      setPaymentsCloud([]);
      return;
    }

    setLoading(true);
    const qDebts = query(
      collection(db, "debts"),
      where("ownerId", "==", user.uid),
      limit(300)
    );
    const qPayments = query(
      collection(db, "debtPayments"),
      where("ownerId", "==", user.uid),
      limit(400)
    );

    const unsubDebts = onSnapshot(
      qDebts,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<DebtRecord, "id">),
        }));
        rows.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === "belum_lunas" ? -1 : 1;
          }
          const cmpDate = b.transactionDate.localeCompare(a.transactionDate);
          if (cmpDate !== 0) return cmpDate;
          return (
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
          );
        });
        setDebtsCloud(rows);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, "debts");
      }
    );

    const unsubPayments = onSnapshot(
      qPayments,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<DebtPaymentRecord, "id">),
        }));
        rows.sort((a, b) => {
          const cmpDate = b.paymentDate.localeCompare(a.paymentDate);
          if (cmpDate !== 0) return cmpDate;
          return (
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
          );
        });
        setPaymentsCloud(rows);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "debtPayments");
      }
    );

    return () => {
      unsubDebts();
      unsubPayments();
    };
  }, [authReady, user]);

  const debtsAktif = user ? debtsCloud : debtsTamu;
  const paymentsAktif = user ? paymentsCloud : paymentsTamu;
  const hariIni = tanggalHariIniISO();

  const ringkasan = useMemo(
    () => hitungRingkasanUtangPiutang(debtsAktif, hariIni),
    [debtsAktif, hariIni]
  );

  const daftarTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return debtsAktif.filter((item) => {
      if (filterJenis !== "semua" && item.type !== filterJenis) return false;
      if (filterStatus !== "semua" && item.status !== filterStatus) return false;
      if (!q) return true;
      return (
        item.partyName.toLowerCase().includes(q) ||
        item.partyPhone.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
      );
    });
  }, [debtsAktif, filterJenis, filterStatus, cari]);

  const riwayatTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return paymentsAktif.filter((p) => {
      if (filterDebtIdRiwayat && p.debtId !== filterDebtIdRiwayat) return false;
      if (!q) return true;
      return (
        p.partyName.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q)
      );
    });
  }, [paymentsAktif, filterDebtIdRiwayat, cari]);

  function resetForm() {
    setEditingId(null);
    setForm(buatFormKosong());
  }

  async function handleSimpanCatatan(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!form.partyName.trim()) {
      setFeedback({
        tipe: "error",
        teks: "Nama pelanggan atau supplier wajib diisi.",
      });
      return;
    }

    if (!editingId && form.totalAmount <= 0) {
      setFeedback({
        tipe: "error",
        teks: "Nominal tagihan harus lebih dari Rp 0.",
      });
      return;
    }

    if (!user) {
      if (editingId) {
        const updated = debtsTamu.map((d) =>
          d.id === editingId
            ? {
                ...d,
                type: form.type,
                partyName: form.partyName.trim(),
                partyPhone: form.partyPhone.trim(),
                transactionDate: form.transactionDate,
                dueDate: form.dueDate,
                note: form.note.trim(),
              }
            : d
        );
        setDebtsTamu(updated);
        simpanUtangLokal(updated, paymentsTamu);
        setFeedback({
          tipe: "sukses",
          teks: "Detail catatan diperbarui di browser ini.",
        });
      } else {
        const itemBaru: DebtRecord = {
          id: `lokal-${Date.now()}`,
          ownerId: "tamu",
          type: form.type,
          partyName: form.partyName.trim(),
          partyPhone: form.partyPhone.trim(),
          totalAmount: form.totalAmount,
          paidAmount: 0,
          remainingAmount: form.totalAmount,
          transactionDate: form.transactionDate,
          dueDate: form.dueDate,
          status: "belum_lunas",
          note: form.note.trim(),
        };
        const updated = [itemBaru, ...debtsTamu];
        setDebtsTamu(updated);
        simpanUtangLokal(updated, paymentsTamu);
        setFeedback({
          tipe: "sukses",
          teks: "Catatan disimpan sementara di browser. Masuk Google untuk sinkronisasi cloud.",
        });
      }
      resetForm();
      return;
    }

    setSavingDebt(true);
    try {
      if (editingId) {
        await ubahDetailUtangFirestore(editingId, {
          type: form.type,
          partyName: form.partyName,
          partyPhone: form.partyPhone,
          transactionDate: form.transactionDate,
          dueDate: form.dueDate,
          note: form.note,
        });
        setFeedback({
          tipe: "sukses",
          teks: `Catatan atas nama "${form.partyName.trim()}" berhasil diperbarui.`,
        });
      } else {
        await tambahCatatanUtangFirestore(user.uid, form);
        setFeedback({
          tipe: "sukses",
          teks: `Catatan ${LABEL_JENIS_UTANG[form.type].toLowerCase()} "${form.partyName.trim()}" berhasil disimpan.`,
        });
      }
      resetForm();
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan catatan utang-piutang.",
      });
    } finally {
      setSavingDebt(false);
    }
  }

  function bukaPanelBayar(debt: DebtRecord) {
    setBayarTarget(debt);
    setBayarNominal(debt.remainingAmount);
    setBayarTanggal(tanggalHariIniISO());
    setBayarMetode("tunai");
    setBayarCatatan("");
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitBayar(e: React.FormEvent) {
    e.preventDefault();
    if (!bayarTarget) return;
    setFeedback(null);

    const nominal = Math.round(Number(bayarNominal) || 0);
    if (nominal <= 0) {
      setFeedback({
        tipe: "error",
        teks: "Nominal pembayaran harus lebih dari Rp 0.",
      });
      return;
    }
    if (nominal > bayarTarget.remainingAmount) {
      setFeedback({
        tipe: "error",
        teks: `Nominal melebihi sisa tagihan (${formatRupiah(
          bayarTarget.remainingAmount
        )}).`,
      });
      return;
    }

    if (!user) {
      const paidAfter = bayarTarget.paidAmount + nominal;
      const remainingAfter = Math.max(0, bayarTarget.totalAmount - paidAfter);
      const statusAfter = remainingAfter === 0 ? "lunas" : "belum_lunas";

      const updatedDebts = debtsTamu.map((d) =>
        d.id === bayarTarget.id
          ? {
              ...d,
              paidAmount: paidAfter,
              remainingAmount: remainingAfter,
              status: statusAfter as "lunas" | "belum_lunas",
            }
          : d
      );
      const paymentBaru: DebtPaymentRecord = {
        id: `pay-${Date.now()}`,
        ownerId: "tamu",
        debtId: bayarTarget.id,
        partyName: bayarTarget.partyName,
        amount: nominal,
        paymentDate: bayarTanggal,
        method: bayarMetode,
        note: bayarCatatan.trim(),
      };
      const updatedPayments = [paymentBaru, ...paymentsTamu];
      setDebtsTamu(updatedDebts);
      setPaymentsTamu(updatedPayments);
      simpanUtangLokal(updatedDebts, updatedPayments);
      setBayarTarget(null);
      setFeedback({
        tipe: "sukses",
        teks:
          statusAfter === "lunas"
            ? `Pembayaran dicatat. Tagihan "${bayarTarget.partyName}" sekarang LUNAS.`
            : `Cicilan ${formatRupiah(nominal)} dicatat. Sisa ${formatRupiah(
                remainingAfter
              )}.`,
      });
      return;
    }

    setSavingBayar(true);
    try {
      const hasil = await catatCicilanUtangFirestore({
        uid: user.uid,
        debt: bayarTarget,
        amount: nominal,
        paymentDate: bayarTanggal,
        method: bayarMetode,
        note: bayarCatatan,
      });
      setFeedback({
        tipe: "sukses",
        teks:
          hasil.status === "lunas"
            ? `Pembayaran dicatat. Tagihan "${bayarTarget.partyName}" resmi LUNAS.`
            : `Cicilan ${formatRupiah(
                nominal
              )} berhasil dicatat. Sisa tagihan: ${formatRupiah(
                hasil.remainingAmount
              )}.`,
      });
      setBayarTarget(null);
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal mencatat pembayaran tagihan.",
      });
    } finally {
      setSavingBayar(false);
    }
  }

  async function konfirmasiHapus(id: string) {
    setHapusKonfirmasiId(null);
    if (!user) {
      const updated = debtsTamu.filter((d) => d.id !== id);
      setDebtsTamu(updated);
      simpanUtangLokal(updated, paymentsTamu);
      if (editingId === id) resetForm();
      if (bayarTarget?.id === id) setBayarTarget(null);
      return;
    }

    try {
      await hapusCatatanUtangFirestore(id);
      if (editingId === id) resetForm();
      if (bayarTarget?.id === id) setBayarTarget(null);
      setFeedback({
        tipe: "sukses",
        teks: "Catatan berhasil dihapus.",
      });
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Gagal menghapus catatan.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <AuthAkunPanel ringkas />

      {/* Ringkasan KPI Utang & Piutang */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setTabKanan("daftar");
            setFilterJenis("piutang");
            setFilterStatus("belum_lunas");
          }}
          className="rounded-2xl border border-forest/25 bg-forest-soft p-5 text-left shadow-card transition hover:border-forest"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-forest">
            <span>Piutang Pelanggan (Tagih)</span>
            <ArrowDownLeft className="h-4 w-4 text-forest" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-forest">
            {formatRupiah(ringkasan.totalPiutangSisa)}
          </p>
          <p className="mt-1 font-body text-xs text-forest/80">
            {ringkasan.jumlahPiutangAktif} catatan belum lunas
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setTabKanan("daftar");
            setFilterJenis("utang");
            setFilterStatus("belum_lunas");
          }}
          className="rounded-2xl border border-ledger/25 bg-ledger/5 p-5 text-left shadow-card transition hover:border-ledger"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-ledger">
            <span>Utang Usaha (Bayar)</span>
            <ArrowUpRight className="h-4 w-4 text-ledger" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ledger">
            {formatRupiah(ringkasan.totalUtangSisa)}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            {ringkasan.jumlahUtangAktif} kewajiban aktif
          </p>
        </button>

        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Lewat Jatuh Tempo</span>
            <AlertTriangle
              className={`h-4 w-4 ${
                ringkasan.jumlahJatuhTempo > 0 ? "text-brass" : "text-forest"
              }`}
            />
          </div>
          <p
            className={`mt-2 font-mono text-2xl font-bold tabular-nums ${
              ringkasan.jumlahJatuhTempo > 0 ? "text-brass" : "text-ink"
            }`}
          >
            {ringkasan.jumlahJatuhTempo}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            Tagihan aktif melewati tempo
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTabKanan("daftar");
            setFilterJenis("semua");
            setFilterStatus("lunas");
          }}
          className="rounded-2xl border border-ink/10 bg-surface p-5 text-left shadow-card transition hover:border-forest/30"
        >
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Sudah Lunas</span>
            <CheckCircle2 className="h-4 w-4 text-forest" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ink">
            {ringkasan.jumlahLunas}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            Selisih bersih:{" "}
            <strong className="font-mono text-ink">
              {ringkasan.selisihBersih >= 0 ? "+" : ""}
              {formatRupiah(ringkasan.selisihBersih)}
            </strong>
          </p>
        </button>
      </div>

      {/* Workspace 2 Kolom */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Kolom Kiri: Panel Pembayaran / Cicilan + Form Tambah / Edit */}
        <div className="space-y-5 lg:col-span-5">
          {bayarTarget && (
            <form
              onSubmit={handleSubmitBayar}
              className="rounded-2xl border border-forest/35 bg-surface p-5 sm:p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-forest">
                    Catat Pembayaran / Cicilan
                  </p>
                  <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">
                    {bayarTarget.partyName}
                  </h2>
                  <p className="font-mono text-xs text-muted">
                    Sisa tagihan:{" "}
                    <strong className="text-ink">
                      {formatRupiah(bayarTarget.remainingAmount)}
                    </strong>{" "}
                    dari {formatRupiah(bayarTarget.totalAmount)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBayarTarget(null)}
                  className="font-body text-xs font-semibold text-muted hover:text-ink"
                >
                  Tutup
                </button>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="bayar-nominal"
                    className="font-body text-xs font-semibold text-ink"
                  >
                    Nominal Dibayar (Rp) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setBayarNominal(bayarTarget.remainingAmount)}
                    className="font-body text-[11px] font-semibold text-forest underline"
                  >
                    Lunasi Semua
                  </button>
                </div>

                <input
                  id="bayar-nominal"
                  type="number"
                  min={1}
                  max={bayarTarget.remainingAmount}
                  required
                  value={bayarNominal || ""}
                  onChange={(e) =>
                    setBayarNominal(angkaNonNegatif(e.target.value))
                  }
                  className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-base font-semibold tabular-nums text-ink focus:border-forest focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="bayar-tanggal"
                      className="block font-body text-xs font-semibold text-ink"
                    >
                      Tanggal Bayar
                    </label>
                    <input
                      id="bayar-tanggal"
                      type="date"
                      required
                      value={bayarTanggal}
                      onChange={(e) => setBayarTanggal(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bayar-metode"
                      className="block font-body text-xs font-semibold text-ink"
                    >
                      Metode
                    </label>
                    <select
                      id="bayar-metode"
                      value={bayarMetode}
                      onChange={(e) =>
                        setBayarMetode(e.target.value as MetodeBayarCicilan)
                      }
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                    >
                      <option value="tunai">Tunai</option>
                      <option value="transfer">Transfer Bank</option>
                      <option value="qris">QRIS</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bayar-catatan"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Catatan Pembayaran (opsional)
                  </label>
                  <input
                    id="bayar-catatan"
                    type="text"
                    maxLength={200}
                    value={bayarCatatan}
                    onChange={(e) => setBayarCatatan(e.target.value)}
                    placeholder="Misal: Cicilan tahap 1 via BCA"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingBayar}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 font-body text-sm font-semibold text-white transition hover:bg-forest-light disabled:opacity-50"
                >
                  <Banknote className="h-4 w-4" />
                  <span>
                    {savingBayar ? "Memproses..." : "Simpan Pembayaran"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Form Tambah / Edit Catatan Utang-Piutang */}
          <form
            onSubmit={handleSimpanCatatan}
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
              <h2 className="font-display text-lg font-semibold text-ink">
                {editingId
                  ? "Edit Detail Catatan"
                  : "Tambah Utang / Piutang Baru"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="font-body text-xs font-semibold text-muted hover:text-ink"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="mt-4 space-y-3.5">
              <div
                role="group"
                aria-label="Jenis catatan utang atau piutang"
                className="grid grid-cols-2 gap-1.5 rounded-xl border border-ink/10 bg-paperDark/70 p-1"
              >
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: "piutang" }))}
                  className={`rounded-lg py-2 font-body text-xs font-semibold transition ${
                    form.type === "piutang"
                      ? "bg-forest text-white shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Piutang (Pelanggan Hutang)
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: "utang" }))}
                  className={`rounded-lg py-2 font-body text-xs font-semibold transition ${
                    form.type === "utang"
                      ? "bg-ledger text-white shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Utang Usaha (Ke Supplier)
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="utang-nama"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    {form.type === "piutang"
                      ? "Nama Pelanggan *"
                      : "Nama Supplier / Pihak *"}
                  </label>
                  <input
                    id="utang-nama"
                    type="text"
                    required
                    maxLength={120}
                    value={form.partyName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, partyName: e.target.value }))
                    }
                    placeholder={
                      form.type === "piutang"
                        ? "Misal: Ibu Sari / Warung Maju"
                        : "Misal: Agen Tepung Jaya"
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="utang-wa"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    No. WhatsApp (opsional)
                  </label>
                  <input
                    id="utang-wa"
                    type="tel"
                    maxLength={32}
                    value={form.partyPhone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, partyPhone: e.target.value }))
                    }
                    placeholder="0812..."
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {!editingId && (
                <div>
                  <label
                    htmlFor="utang-nominal"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Nominal Tagihan (Rp) *
                  </label>
                  <input
                    id="utang-nominal"
                    type="number"
                    min={1}
                    required
                    value={form.totalAmount || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        totalAmount: angkaNonNegatif(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-base font-semibold tabular-nums text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="utang-tgl-transaksi"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Tanggal Transaksi *
                  </label>
                  <input
                    id="utang-tgl-transaksi"
                    type="date"
                    required
                    value={form.transactionDate}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, transactionDate: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="utang-jatuh-tempo"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Jatuh Tempo (opsional)
                  </label>
                  <input
                    id="utang-jatuh-tempo"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dueDate: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="utang-catatan"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Keterangan Barang / Nota (opsional)
                </label>
                <input
                  id="utang-catatan"
                  type="text"
                  maxLength={240}
                  value={form.note}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, note: e.target.value }))
                  }
                  placeholder="Misal: Pesanan 20 box snack rapat"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              {feedback && (
                <div
                  role={feedback.tipe === "error" ? "alert" : "status"}
                  className={`rounded-xl px-3.5 py-2.5 font-body text-xs leading-relaxed ${
                    feedback.tipe === "error"
                      ? "border border-ledger/20 bg-ledger/5 text-ledger"
                      : "border border-forest/20 bg-forest-soft text-forest"
                  }`}
                >
                  {feedback.teks}
                </div>
              )}

              <button
                type="submit"
                disabled={savingDebt}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {savingDebt
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan"
                    : "Simpan Catatan"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Daftar Utang/Piutang & Riwayat Pembayaran */}
        <div className="space-y-5 lg:col-span-7">
          <div
            id="laporan-utang-piutang"
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            {/* Header Tabs & Pencarian */}
            <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-4 sm:flex-row sm:items-center">
              <div
                role="tablist"
                aria-label="Tampilan utang dan piutang"
                className="inline-flex rounded-xl border border-ink/10 bg-paperDark/80 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tabKanan === "daftar"}
                  onClick={() => {
                    setTabKanan("daftar");
                    setFilterDebtIdRiwayat(null);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition ${
                    tabKanan === "daftar"
                      ? "bg-surface text-forest shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <HandCoins className="h-3.5 w-3.5" />
                  <span>Daftar Tagihan ({debtsAktif.length})</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tabKanan === "riwayat"}
                  onClick={() => setTabKanan("riwayat")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition ${
                    tabKanan === "riwayat"
                      ? "bg-surface text-forest shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Riwayat Bayar ({paymentsAktif.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <label htmlFor="cari-utang" className="sr-only">
                    Cari nama pelanggan atau catatan
                  </label>
                  <input
                    id="cari-utang"
                    type="search"
                    value={cari}
                    onChange={(e) => setCari(e.target.value)}
                    placeholder="Cari nama / catatan..."
                    className="rounded-xl border border-ink/15 bg-paper py-2 pl-8 pr-3 font-body text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {tabKanan === "daftar" && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <label htmlFor="filter-jenis-utang" className="sr-only">
                  Filter jenis tagihan
                </label>
                <select
                  id="filter-jenis-utang"
                  value={filterJenis}
                  onChange={(e) =>
                    setFilterJenis(
                      e.target.value as "semua" | JenisUtangPiutang
                    )
                  }
                  className="rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-medium text-ink focus:border-forest focus:outline-none"
                >
                  <option value="semua">Semua Jenis</option>
                  <option value="piutang">Piutang Pelanggan</option>
                  <option value="utang">Utang Usaha</option>
                </select>

                <label htmlFor="filter-status-utang" className="sr-only">
                  Filter status pelunasan
                </label>
                <select
                  id="filter-status-utang"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "semua" | "belum_lunas" | "lunas"
                    )
                  }
                  className="rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-medium text-ink focus:border-forest focus:outline-none"
                >
                  <option value="semua">Semua Status</option>
                  <option value="belum_lunas">Belum Lunas</option>
                  <option value="lunas">Sudah Lunas</option>
                </select>
              </div>
            )}

            {tabKanan === "daftar" ? (
              loading ? (
                <div className="mt-5 space-y-3">
                  <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
                  <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
                </div>
              ) : daftarTersaring.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-body text-sm text-muted">
                    {debtsAktif.length === 0
                      ? "Belum ada catatan utang atau piutang. Mulai catat melalui formulir di sebelah kiri."
                      : "Tidak ada catatan yang cocok dengan filter."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {daftarTersaring.map((debt) => {
                    const isLunas = debt.status === "lunas";
                    const lewatTempo = cekLewatJatuhTempo(debt, hariIni);
                    const sedangKonfirmasi = hapusKonfirmasiId === debt.id;

                    return (
                      <div
                        key={debt.id}
                        className={`rounded-xl border p-4 transition ${
                          isLunas
                            ? "border-ink/10 bg-paperDark/30 opacity-85"
                            : lewatTempo
                            ? "border-brass/45 bg-brass-soft/50"
                            : "border-ink/10 bg-paper/70"
                        }`}
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span
                                className={`font-mono text-[11px] font-semibold uppercase ${
                                  debt.type === "piutang"
                                    ? "text-forest"
                                    : "text-ledger"
                                }`}
                              >
                                {debt.type === "piutang"
                                  ? "Piutang"
                                  : "Utang Usaha"}
                              </span>
                              <span className="text-muted">·</span>
                              <h3 className="font-display text-base font-semibold text-ink">
                                {debt.partyName}
                              </h3>
                              {debt.partyPhone && (
                                <span className="font-mono text-[11px] text-muted">
                                  ({debt.partyPhone})
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-muted">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Tgl: {debt.transactionDate}</span>
                              </span>
                              {debt.dueDate && (
                                <span
                                  className={`inline-flex items-center gap-1 ${
                                    lewatTempo
                                      ? "font-semibold text-brass"
                                      : ""
                                  }`}
                                >
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Tempo: {debt.dueDate}
                                    {lewatTempo ? " (Lewat)" : ""}
                                  </span>
                                </span>
                              )}
                            </div>

                            {debt.note && (
                              <p className="mt-1 font-body text-xs text-muted">
                                {debt.note}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p className="font-body text-[11px] text-muted">
                              Sisa Tagihan
                            </p>
                            <p
                              className={`font-mono text-xl font-bold tabular-nums ${
                                isLunas
                                  ? "text-forest"
                                  : debt.type === "piutang"
                                  ? "text-forest"
                                  : "text-ledger"
                              }`}
                            >
                              {formatRupiah(debt.remainingAmount)}
                            </p>
                            <p className="font-mono text-[11px] text-muted">
                              Total {formatRupiah(debt.totalAmount)} · Dibayar{" "}
                              {formatRupiah(debt.paidAmount)}
                            </p>
                            <p
                              className={`mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                                isLunas ? "text-forest" : "text-brass"
                              }`}
                            >
                              {isLunas ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span>
                                {isLunas ? "Lunas" : "Belum Lunas"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {sedangKonfirmasi ? (
                          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-ledger/20 bg-surface px-3 py-2 text-xs">
                            <span className="font-medium text-ledger">
                              Hapus catatan ini?
                            </span>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => void konfirmasiHapus(debt.id)}
                                className="font-semibold text-ledger underline"
                              >
                                Ya, Hapus
                              </button>
                              <button
                                type="button"
                                onClick={() => setHapusKonfirmasiId(null)}
                                className="text-muted hover:text-ink"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
                            {!isLunas && (
                              <button
                                type="button"
                                onClick={() => bukaPanelBayar(debt)}
                                className="inline-flex items-center gap-1 rounded-lg border border-forest/25 bg-forest-soft px-2.5 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                              >
                                <Banknote className="h-3.5 w-3.5" />
                                <span>Catat Bayar / Cicil</span>
                              </button>
                            )}

                            {!isLunas && debt.type === "piutang" && (
                              <a
                                href={buatTautanWhatsAppTagihan(
                                  debt,
                                  profile?.businessName
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-body text-xs font-semibold text-ink transition hover:border-forest hover:text-forest"
                              >
                                <MessageCircle className="h-3.5 w-3.5 text-forest" />
                                <span>Ingatkan WA</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setFilterDebtIdRiwayat(debt.id);
                                setTabKanan("riwayat");
                              }}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-body text-xs font-medium text-muted transition hover:text-ink"
                            >
                              <History className="h-3 w-3" />
                              <span>Riwayat</span>
                            </button>

                            {!isLunas && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(debt.id);
                                  setForm({
                                    type: debt.type,
                                    partyName: debt.partyName,
                                    partyPhone: debt.partyPhone,
                                    totalAmount: debt.totalAmount,
                                    transactionDate: debt.transactionDate,
                                    dueDate: debt.dueDate,
                                    note: debt.note,
                                  });
                                  setBayarTarget(null);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-body text-xs font-medium text-muted transition hover:text-forest"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setHapusKonfirmasiId(debt.id)}
                              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-body text-xs text-muted transition hover:text-ledger"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="mt-4">
                {filterDebtIdRiwayat && (
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-forest/20 bg-forest-soft px-3 py-2 text-xs">
                    <span className="text-forest">
                      Menampilkan riwayat pembayaran untuk catatan terpilih.
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterDebtIdRiwayat(null)}
                      className="font-semibold text-forest underline"
                    >
                      Tampilkan Semua
                    </button>
                  </div>
                )}

                {riwayatTersaring.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-body text-sm text-muted">
                      Belum ada riwayat pembayaran atau cicilan yang dicatat.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {riwayatTersaring.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col justify-between gap-2 rounded-xl border border-ink/10 bg-paper/70 px-4 py-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-x-2">
                            <span className="font-body text-sm font-semibold text-ink">
                              {p.partyName}
                            </span>
                            <span className="text-muted">·</span>
                            <span className="font-mono text-[11px] text-muted">
                              {p.paymentDate}
                            </span>
                            <span className="text-muted">·</span>
                            <span className="font-body text-xs text-muted">
                              {LABEL_METODE_CICILAN[p.method]}
                            </span>
                          </div>
                          {p.note && (
                            <p className="mt-0.5 font-body text-xs text-muted">
                              {p.note}
                            </p>
                          )}
                        </div>

                        <p className="font-mono text-sm font-bold tabular-nums text-forest">
                          +{formatRupiah(p.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card print:hidden">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Unduh Ringkasan Utang &amp; Piutang
            </p>
            <TombolUnduh
              elementId="laporan-utang-piutang"
              namaFile={`Utang-Piutang-${tanggalHariIniISO()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
