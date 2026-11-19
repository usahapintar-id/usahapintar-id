"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  CheckCircle2,
  Download,
  History,
  Lock,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import AuthAkunPanel from "@/components/AuthAkunPanel";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import TombolUnduh from "@/components/TombolUnduh";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { angkaNonNegatif, formatRupiah } from "@/lib/hitung";
import { cekAksesFitur, tanggalHariIniISO } from "@/lib/paket";
import {
  bacaStokLokal,
  BATAS_BARANG_STOK_GRATIS,
  catatMutasiStokFirestore,
  cekStatusStok,
  eksporCSVStok,
  hapusBarangFirestore,
  hitungRingkasanStok,
  KATEGORI_STOK_UMUM,
  LABEL_MUTASI_STOK,
  SATUAN_UMUM,
  simpanStokLokal,
  tambahBarangFirestore,
  ubahDetailBarangFirestore,
  type InventoryItemInput,
  type InventoryItemRecord,
  type StockLogRecord,
} from "@/lib/stok";

const FORM_KOSONG: InventoryItemInput = {
  name: "",
  sku: "",
  unit: "pcs",
  category: "Produk Jadi",
  costPrice: 0,
  sellPrice: 0,
  stock: 0,
  minStock: 5,
};

export default function ManajemenStok() {
  const { user, profile, authReady } = useFirebaseAuth();

  const [itemsCloud, setItemsCloud] = useState<InventoryItemRecord[]>([]);
  const [logsCloud, setLogsCloud] = useState<StockLogRecord[]>([]);
  const [itemsTamu, setItemsTamu] = useState<InventoryItemRecord[]>([]);
  const [logsTamu, setLogsTamu] = useState<StockLogRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Barang
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InventoryItemInput>(FORM_KOSONG);
  const [savingItem, setSavingItem] = useState(false);

  // Form Mutasi Stok Cepat
  const [mutasiTarget, setMutasiTarget] = useState<InventoryItemRecord | null>(
    null
  );
  const [mutasiJenis, setMutasiJenis] = useState<
    "masuk" | "keluar" | "koreksi"
  >("masuk");
  const [mutasiJumlah, setMutasiJumlah] = useState<number>(1);
  const [mutasiTanggal, setMutasiTanggal] = useState<string>(() =>
    tanggalHariIniISO()
  );
  const [mutasiCatatan, setMutasiCatatan] = useState<string>("");
  const [savingMutasi, setSavingMutasi] = useState(false);

  // Tab & Filter
  const [tabKanan, setTabKanan] = useState<"daftar" | "riwayat">("daftar");
  const [cari, setCari] = useState("");
  const [filterStok, setFilterStok] = useState<"semua" | "menipis" | "aman">(
    "semua"
  );
  const [hapusKonfirmasiId, setHapusKonfirmasiId] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  useEffect(() => {
    const lokal = bacaStokLokal();
    setItemsTamu(lokal.items);
    setLogsTamu(lokal.logs);
  }, []);

  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setItemsCloud([]);
      setLogsCloud([]);
      return;
    }

    setLoading(true);
    const qItems = query(
      collection(db, "inventory"),
      where("ownerId", "==", user.uid),
      limit(300)
    );
    const qLogs = query(
      collection(db, "stockLogs"),
      where("ownerId", "==", user.uid),
      limit(300)
    );

    const unsubItems = onSnapshot(
      qItems,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InventoryItemRecord, "id">),
        }));
        rows.sort((a, b) => a.name.localeCompare(b.name, "id"));
        setItemsCloud(rows);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, "inventory");
      }
    );

    const unsubLogs = onSnapshot(
      qLogs,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<StockLogRecord, "id">),
        }));
        rows.sort((a, b) => {
          const cmpDate = b.date.localeCompare(a.date);
          if (cmpDate !== 0) return cmpDate;
          return (
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
          );
        });
        setLogsCloud(rows);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "stockLogs");
      }
    );

    return () => {
      unsubItems();
      unsubLogs();
    };
  }, [authReady, user]);

  const itemsAktif = user ? itemsCloud : itemsTamu;
  const logsAktif = user ? logsCloud : logsTamu;
  const plan = profile?.plan ?? "gratis";
  const fiturStokPenuh = cekAksesFitur(plan, "manajemen_stok_lengkap");
  const bolehTambahBarang =
    fiturStokPenuh || itemsAktif.length < BATAS_BARANG_STOK_GRATIS;

  const ringkasan = useMemo(
    () => hitungRingkasanStok(itemsAktif),
    [itemsAktif]
  );

  const barangTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return itemsAktif.filter((item) => {
      const status = cekStatusStok(item.stock, item.minStock);
      if (filterStok === "menipis" && status === "aman") return false;
      if (filterStok === "aman" && status !== "aman") return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [itemsAktif, cari, filterStok]);

  const riwayatTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return logsAktif;
    return logsAktif.filter(
      (log) =>
        log.itemName.toLowerCase().includes(q) ||
        log.note.toLowerCase().includes(q)
    );
  }, [logsAktif, cari]);

  function resetForm() {
    setEditingId(null);
    setForm(FORM_KOSONG);
  }

  async function handleSimpanBarang(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!editingId && !bolehTambahBarang) {
      setFeedback({
        tipe: "error",
        teks: `Paket Gratis dibatasi hingga ${BATAS_BARANG_STOK_GRATIS} jenis barang. Anda tetap dapat memperbarui stok barang yang ada atau melihat info CuanKit Pro.`,
      });
      return;
    }

    if (!form.name.trim()) {
      setFeedback({ tipe: "error", teks: "Nama barang wajib diisi." });
      return;
    }

    if (!user) {
      if (editingId) {
        const updated = itemsTamu.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                sku: form.sku.trim(),
                unit: form.unit.trim() || "pcs",
                category: form.category,
                costPrice: form.costPrice,
                sellPrice: form.sellPrice,
                minStock: form.minStock,
              }
            : item
        );
        setItemsTamu(updated);
        simpanStokLokal(updated, logsTamu);
        setFeedback({
          tipe: "sukses",
          teks: "Detail barang diperbarui di perangkat ini.",
        });
      } else {
        const idBaru = `lokal-${Date.now()}`;
        const itemBaru: InventoryItemRecord = {
          id: idBaru,
          ownerId: "tamu",
          ...form,
          name: form.name.trim(),
          sku: form.sku.trim(),
          unit: form.unit.trim() || "pcs",
        };
        const updatedItems = [itemBaru, ...itemsTamu].sort((a, b) =>
          a.name.localeCompare(b.name, "id")
        );
        let updatedLogs = logsTamu;
        if (itemBaru.stock > 0) {
          const logAwal: StockLogRecord = {
            id: `log-${Date.now()}`,
            ownerId: "tamu",
            itemId: idBaru,
            itemName: itemBaru.name,
            type: "awal",
            delta: itemBaru.stock,
            stockBefore: 0,
            stockAfter: itemBaru.stock,
            unit: itemBaru.unit,
            note: "Saldo stok awal barang baru",
            date: tanggalHariIniISO(),
          };
          updatedLogs = [logAwal, ...logsTamu];
        }
        setItemsTamu(updatedItems);
        setLogsTamu(updatedLogs);
        simpanStokLokal(updatedItems, updatedLogs);
        setFeedback({
          tipe: "sukses",
          teks: "Barang ditambahkan sementara di browser. Masuk Google untuk sinkronisasi cloud.",
        });
      }
      resetForm();
      return;
    }

    setSavingItem(true);
    try {
      if (editingId) {
        await ubahDetailBarangFirestore(editingId, form);
        setFeedback({
          tipe: "sukses",
          teks: `Detail barang "${form.name.trim()}" berhasil diperbarui.`,
        });
      } else {
        await tambahBarangFirestore(user.uid, form);
        setFeedback({
          tipe: "sukses",
          teks: `Barang "${form.name.trim()}" berhasil ditambahkan ke daftar stok.`,
        });
      }
      resetForm();
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan data barang.",
      });
    } finally {
      setSavingItem(false);
    }
  }

  function bukaPanelMutasi(
    item: InventoryItemRecord,
    jenis: "masuk" | "keluar" | "koreksi"
  ) {
    setMutasiTarget(item);
    setMutasiJenis(jenis);
    setMutasiJumlah(jenis === "koreksi" ? item.stock : 1);
    setMutasiTanggal(tanggalHariIniISO());
    setMutasiCatatan("");
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitMutasi(e: React.FormEvent) {
    e.preventDefault();
    if (!mutasiTarget) return;
    setFeedback(null);

    if (!user) {
      const before = mutasiTarget.stock;
      let after = before;
      if (mutasiJenis === "masuk") {
        if (mutasiJumlah <= 0) {
          setFeedback({
            tipe: "error",
            teks: "Jumlah stok masuk harus lebih dari 0.",
          });
          return;
        }
        after = before + mutasiJumlah;
      } else if (mutasiJenis === "keluar") {
        if (mutasiJumlah <= 0) {
          setFeedback({
            tipe: "error",
            teks: "Jumlah stok keluar harus lebih dari 0.",
          });
          return;
        }
        if (mutasiJumlah > before) {
          setFeedback({
            tipe: "error",
            teks: `Stok tersedia (${before} ${mutasiTarget.unit}) tidak cukup.`,
          });
          return;
        }
        after = before - mutasiJumlah;
      } else {
        after = mutasiJumlah;
      }

      const updatedItems = itemsTamu.map((it) =>
        it.id === mutasiTarget.id ? { ...it, stock: after } : it
      );
      const logBaru: StockLogRecord = {
        id: `log-${Date.now()}`,
        ownerId: "tamu",
        itemId: mutasiTarget.id,
        itemName: mutasiTarget.name,
        type: mutasiJenis,
        delta: after - before,
        stockBefore: before,
        stockAfter: after,
        unit: mutasiTarget.unit,
        note: mutasiCatatan.trim(),
        date: mutasiTanggal,
      };
      const updatedLogs = [logBaru, ...logsTamu];
      setItemsTamu(updatedItems);
      setLogsTamu(updatedLogs);
      simpanStokLokal(updatedItems, updatedLogs);
      setMutasiTarget(null);
      setFeedback({
        tipe: "sukses",
        teks: `Stok "${mutasiTarget.name}" diperbarui menjadi ${after} ${mutasiTarget.unit}.`,
      });
      return;
    }

    setSavingMutasi(true);
    try {
      const stokAkhir = await catatMutasiStokFirestore({
        uid: user.uid,
        item: mutasiTarget,
        type: mutasiJenis,
        jumlah: mutasiJumlah,
        note: mutasiCatatan,
        date: mutasiTanggal,
      });
      setFeedback({
        tipe: "sukses",
        teks: `Stok "${mutasiTarget.name}" berhasil diperbarui menjadi ${stokAkhir} ${mutasiTarget.unit}.`,
      });
      setMutasiTarget(null);
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal mencatat perubahan stok.",
      });
    } finally {
      setSavingMutasi(false);
    }
  }

  async function konfirmasiHapusBarang(id: string) {
    setHapusKonfirmasiId(null);
    if (!user) {
      const updated = itemsTamu.filter((i) => i.id !== id);
      setItemsTamu(updated);
      simpanStokLokal(updated, logsTamu);
      if (editingId === id) resetForm();
      if (mutasiTarget?.id === id) setMutasiTarget(null);
      return;
    }

    try {
      await hapusBarangFirestore(id);
      if (editingId === id) resetForm();
      if (mutasiTarget?.id === id) setMutasiTarget(null);
      setFeedback({
        tipe: "sukses",
        teks: "Barang dihapus dari daftar stok.",
      });
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Gagal menghapus barang.",
      });
    }
  }

  const totalPeringatan = ringkasan.jumlahMenipis + ringkasan.jumlahHabis;

  return (
    <div className="space-y-8">
      <AuthAkunPanel ringkas />

      {/* Ringkasan KPI Stok */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Total Jenis Barang</span>
            <Boxes className="h-4 w-4 text-forest" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ink">
            {ringkasan.totalJenis}
            {!fiturStokPenuh && (
              <span className="ml-1 text-sm font-normal text-muted">
                / {BATAS_BARANG_STOK_GRATIS}
              </span>
            )}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            Total {ringkasan.totalUnit.toLocaleString("id-ID")} unit tersedia
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTabKanan("daftar");
            setFilterStok(totalPeringatan > 0 ? "menipis" : "semua");
          }}
          className={`rounded-2xl border p-5 text-left shadow-card transition ${
            totalPeringatan > 0
              ? "border-ledger/30 bg-ledger/5 hover:border-ledger"
              : "border-ink/10 bg-surface"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Peringatan Stok</span>
            <AlertTriangle
              className={`h-4 w-4 ${
                totalPeringatan > 0 ? "text-ledger" : "text-forest"
              }`}
            />
          </div>
          <p
            className={`mt-2 font-mono text-2xl font-bold tabular-nums ${
              totalPeringatan > 0 ? "text-ledger" : "text-forest"
            }`}
          >
            {totalPeringatan}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            {ringkasan.jumlahHabis} habis · {ringkasan.jumlahMenipis} menipis
          </p>
        </button>

        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Nilai Modal Stok</span>
            <Package className="h-4 w-4 text-ink" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ink">
            {formatRupiah(ringkasan.totalNilaiModal)}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            Stok x harga modal
          </p>
        </div>

        <div className="rounded-2xl border border-forest/25 bg-forest-soft p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-forest">
            <span>Potensi Nilai Jual</span>
            <CheckCircle2 className="h-4 w-4 text-forest" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-forest">
            {formatRupiah(ringkasan.totalPotensiJual)}
          </p>
          <p className="mt-1 font-body text-xs text-forest/80">
            Stok x harga jual
          </p>
        </div>
      </div>

      {/* Workspace 2 Kolom */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Kolom Kiri: Panel Mutasi Cepat (jika dipilih) + Form Tambah/Edit Barang */}
        <div className="space-y-5 lg:col-span-5">
          {mutasiTarget && (
            <form
              onSubmit={handleSubmitMutasi}
              className="rounded-2xl border border-forest/30 bg-surface p-5 sm:p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-forest">
                    Catat Perubahan Stok
                  </p>
                  <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">
                    {mutasiTarget.name}
                  </h2>
                  <p className="font-mono text-xs text-muted">
                    Stok saat ini: {mutasiTarget.stock} {mutasiTarget.unit}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMutasiTarget(null)}
                  className="font-body text-xs font-semibold text-muted hover:text-ink"
                >
                  Tutup
                </button>
              </div>

              <div
                role="group"
                aria-label="Jenis mutasi stok"
                className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl border border-ink/10 bg-paperDark/70 p-1"
              >
                {(
                  [
                    { id: "masuk", label: "+ Masuk" },
                    { id: "keluar", label: "- Keluar" },
                    { id: "koreksi", label: "Opname" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setMutasiJenis(opt.id);
                      setMutasiJumlah(
                        opt.id === "koreksi" ? mutasiTarget.stock : 1
                      );
                    }}
                    className={`rounded-lg py-2 font-body text-xs font-semibold transition ${
                      mutasiJenis === opt.id
                        ? opt.id === "keluar"
                          ? "bg-ledger text-white shadow-sm"
                          : "bg-forest text-white shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="mutasi-jumlah"
                      className="block font-body text-xs font-semibold text-ink"
                    >
                      {mutasiJenis === "koreksi"
                        ? `Stok Fisik (${mutasiTarget.unit})`
                        : `Jumlah (${mutasiTarget.unit})`}
                    </label>
                    <input
                      id="mutasi-jumlah"
                      type="number"
                      min={mutasiJenis === "koreksi" ? 0 : 0.01}
                      step="any"
                      required
                      value={mutasiJumlah}
                      onChange={(e) =>
                        setMutasiJumlah(angkaNonNegatif(e.target.value))
                      }
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mutasi-tanggal"
                      className="block font-body text-xs font-semibold text-ink"
                    >
                      Tanggal
                    </label>
                    <input
                      id="mutasi-tanggal"
                      type="date"
                      required
                      value={mutasiTanggal}
                      onChange={(e) => setMutasiTanggal(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mutasi-catatan"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Catatan (opsional)
                  </label>
                  <input
                    id="mutasi-catatan"
                    type="text"
                    maxLength={200}
                    value={mutasiCatatan}
                    onChange={(e) => setMutasiCatatan(e.target.value)}
                    placeholder={
                      mutasiJenis === "masuk"
                        ? "Misal: Belanja kulakan supplier"
                        : mutasiJenis === "keluar"
                        ? "Misal: Penjualan harian / terpakai produksi"
                        : "Misal: Penyesuaian hitung fisik rak"
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingMutasi}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    {savingMutasi ? "Memperbarui..." : "Simpan Perubahan Stok"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Form Tambah / Edit Barang */}
          <form
            onSubmit={handleSimpanBarang}
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
              <h2 className="font-display text-lg font-semibold text-ink">
                {editingId ? "Edit Data Barang" : "Tambah Barang Baru"}
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
              <div>
                <label
                  htmlFor="stok-nama"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Nama Barang / Bahan *
                </label>
                <input
                  id="stok-nama"
                  type="text"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Misal: Biji Kopi Robusta 1kg"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="stok-kategori"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Kategori
                  </label>
                  <select
                    id="stok-kategori"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  >
                    {KATEGORI_STOK_UMUM.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="stok-sku"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Kode / SKU (opsional)
                  </label>
                  <input
                    id="stok-sku"
                    type="text"
                    maxLength={40}
                    value={form.sku}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, sku: e.target.value }))
                    }
                    placeholder="KOPI-01"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="stok-satuan"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Satuan *
                  </label>
                  <select
                    id="stok-satuan"
                    value={form.unit}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, unit: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  >
                    {SATUAN_UMUM.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="stok-min"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Batas Stok Menipis
                  </label>
                  <input
                    id="stok-min"
                    type="number"
                    min={0}
                    value={form.minStock}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        minStock: angkaNonNegatif(e.target.value),
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {!editingId && (
                <div>
                  <label
                    htmlFor="stok-awal"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Jumlah Stok Awal ({form.unit})
                  </label>
                  <input
                    id="stok-awal"
                    type="number"
                    min={0}
                    step="any"
                    value={form.stock || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        stock: angkaNonNegatif(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="stok-harga-modal"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Harga Modal (Rp)
                  </label>
                  <input
                    id="stok-harga-modal"
                    type="number"
                    min={0}
                    value={form.costPrice || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        costPrice: angkaNonNegatif(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stok-harga-jual"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Harga Jual (Rp)
                  </label>
                  <input
                    id="stok-harga-jual"
                    type="number"
                    min={0}
                    value={form.sellPrice || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        sellPrice: angkaNonNegatif(e.target.value),
                      }))
                    }
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                  />
                </div>
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
                disabled={savingItem}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {savingItem
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan Barang"
                    : "Simpan Barang Baru"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Daftar Barang & Riwayat Perubahan Stok */}
        <div className="space-y-5 lg:col-span-7">
          <div
            id="laporan-stok-barang"
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            {/* Header Tabs & Filter */}
            <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-4 sm:flex-row sm:items-center">
              <div
                role="tablist"
                aria-label="Tampilan manajemen stok"
                className="inline-flex rounded-xl border border-ink/10 bg-paperDark/80 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tabKanan === "daftar"}
                  onClick={() => setTabKanan("daftar")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition ${
                    tabKanan === "daftar"
                      ? "bg-surface text-forest shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Boxes className="h-3.5 w-3.5" />
                  <span>Daftar Barang ({itemsAktif.length})</span>
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
                  <span>Riwayat Mutasi ({logsAktif.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <label htmlFor="cari-stok" className="sr-only">
                    Cari barang atau riwayat
                  </label>
                  <input
                    id="cari-stok"
                    type="search"
                    value={cari}
                    onChange={(e) => setCari(e.target.value)}
                    placeholder="Cari nama / SKU..."
                    className="rounded-xl border border-ink/15 bg-paper py-2 pl-8 pr-3 font-body text-xs text-ink focus:border-forest focus:outline-none"
                  />
                </div>

                {tabKanan === "daftar" && (
                  <>
                    <label htmlFor="filter-status-stok" className="sr-only">
                      Filter status stok
                    </label>
                    <select
                      id="filter-status-stok"
                      value={filterStok}
                      onChange={(e) =>
                        setFilterStok(
                          e.target.value as "semua" | "menipis" | "aman"
                        )
                      }
                      className="rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-medium text-ink focus:border-forest focus:outline-none"
                    >
                      <option value="semua">Semua Status</option>
                      <option value="menipis">Stok Menipis / Habis</option>
                      <option value="aman">Stok Aman</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {tabKanan === "daftar" ? (
              loading ? (
                <div className="mt-5 space-y-3">
                  <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
                  <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
                </div>
              ) : barangTersaring.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-body text-sm text-muted">
                    {itemsAktif.length === 0
                      ? "Belum ada barang yang dicatat. Tambahkan barang pertama di formulir sebelah kiri."
                      : "Tidak ada barang yang cocok dengan filter pencarian."}
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {barangTersaring.map((item) => {
                    const status = cekStatusStok(item.stock, item.minStock);
                    const margin = item.sellPrice - item.costPrice;
                    const sedangKonfirmasi = hapusKonfirmasiId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-4 transition ${
                          status === "habis"
                            ? "border-ledger/35 bg-ledger/5"
                            : status === "menipis"
                            ? "border-brass/40 bg-brass-soft/60"
                            : "border-ink/10 bg-paper/70"
                        }`}
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <h3 className="font-display text-base font-semibold text-ink">
                                {item.name}
                              </h3>
                              {item.sku && (
                                <span className="font-mono text-[11px] text-muted">
                                  #{item.sku}
                                </span>
                              )}
                              <span className="text-muted">·</span>
                              <span className="font-body text-xs text-muted">
                                {item.category}
                              </span>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-muted">
                              <span>
                                Modal:{" "}
                                <strong className="font-mono tabular-nums text-ink">
                                  {formatRupiah(item.costPrice)}
                                </strong>
                              </span>
                              <span>
                                Jual:{" "}
                                <strong className="font-mono tabular-nums text-ink">
                                  {formatRupiah(item.sellPrice)}
                                </strong>
                              </span>
                              {item.sellPrice > 0 && (
                                <span
                                  className={
                                    margin >= 0 ? "text-forest" : "text-ledger"
                                  }
                                >
                                  Margin:{" "}
                                  <strong className="font-mono tabular-nums">
                                    {formatRupiah(margin)}
                                  </strong>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p
                              className={`font-mono text-xl font-bold tabular-nums ${
                                status === "habis"
                                  ? "text-ledger"
                                  : status === "menipis"
                                  ? "text-brass"
                                  : "text-forest"
                              }`}
                            >
                              {item.stock}{" "}
                              <span className="text-xs font-medium text-muted">
                                {item.unit}
                              </span>
                            </p>
                            <p
                              className={`mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                                status === "habis"
                                  ? "text-ledger"
                                  : status === "menipis"
                                  ? "text-brass"
                                  : "text-forest"
                              }`}
                            >
                              {status !== "aman" && (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              <span>
                                {status === "habis"
                                  ? "Stok Habis"
                                  : status === "menipis"
                                  ? `Stok Menipis (min ${item.minStock})`
                                  : `Stok Aman (min ${item.minStock})`}
                              </span>
                            </p>
                          </div>
                        </div>

                        {sedangKonfirmasi ? (
                          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-ledger/20 bg-surface px-3 py-2 text-xs">
                            <span className="font-medium text-ledger">
                              Hapus barang ini dari daftar?
                            </span>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => void konfirmasiHapusBarang(item.id)}
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
                            <button
                              type="button"
                              onClick={() => bukaPanelMutasi(item, "masuk")}
                              className="inline-flex items-center gap-1 rounded-lg border border-forest/25 bg-forest-soft px-2.5 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                            >
                              <ArrowDownCircle className="h-3.5 w-3.5" />
                              <span>Barang Masuk</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => bukaPanelMutasi(item, "keluar")}
                              disabled={item.stock <= 0}
                              className="inline-flex items-center gap-1 rounded-lg border border-ledger/25 bg-ledger/5 px-2.5 py-1.5 font-body text-xs font-semibold text-ledger transition hover:bg-ledger hover:text-white disabled:opacity-40"
                            >
                              <ArrowUpCircle className="h-3.5 w-3.5" />
                              <span>Barang Keluar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => bukaPanelMutasi(item, "koreksi")}
                              className="inline-flex items-center gap-1 rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-body text-xs font-semibold text-ink transition hover:border-forest"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Opname</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setForm({
                                  name: item.name,
                                  sku: item.sku,
                                  unit: item.unit,
                                  category: item.category,
                                  costPrice: item.costPrice,
                                  sellPrice: item.sellPrice,
                                  stock: item.stock,
                                  minStock: item.minStock,
                                });
                                setMutasiTarget(null);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-body text-xs font-medium text-muted transition hover:text-forest"
                            >
                              <Pencil className="h-3 w-3" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setHapusKonfirmasiId(item.id)}
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
            ) : riwayatTersaring.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-body text-sm text-muted">
                  Belum ada riwayat perubahan stok. Catat stok masuk atau keluar pada daftar barang.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-2.5">
                {riwayatTersaring.map((log) => {
                  const isPositif = log.delta >= 0;
                  return (
                    <div
                      key={log.id}
                      className="flex flex-col justify-between gap-2 rounded-xl border border-ink/10 bg-paper/70 px-4 py-3 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2">
                          <span className="font-body text-sm font-semibold text-ink">
                            {log.itemName}
                          </span>
                          <span className="text-muted">·</span>
                          <span className="font-mono text-[11px] font-semibold text-muted">
                            {LABEL_MUTASI_STOK[log.type]}
                          </span>
                          <span className="text-muted">·</span>
                          <span className="font-mono text-[11px] text-muted">
                            {log.date}
                          </span>
                        </div>
                        {log.note && (
                          <p className="mt-0.5 font-body text-xs text-muted">
                            {log.note}
                          </p>
                        )}
                      </div>

                      <div className="sm:text-right">
                        <p
                          className={`font-mono text-sm font-bold tabular-nums ${
                            log.type === "keluar" || log.delta < 0
                              ? "text-ledger"
                              : "text-forest"
                          }`}
                        >
                          {isPositif ? "+" : ""}
                          {log.delta} {log.unit}
                        </p>
                        <p className="font-mono text-[11px] text-muted">
                          {log.stockBefore} → {log.stockAfter} {log.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ekspor Daftar Stok */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card print:hidden">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Ekspor Data Persediaan
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <TombolUnduh
                elementId="laporan-stok-barang"
                namaFile={`Stok-Barang-${tanggalHariIniISO()}`}
              />

              {fiturStokPenuh ? (
                <button
                  type="button"
                  onClick={() =>
                    eksporCSVStok(
                      itemsAktif,
                      `Stok-Barang-${tanggalHariIniISO()}`
                    )
                  }
                  disabled={itemsAktif.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh CSV Stok</span>
                </button>
              ) : (
                <Link
                  href="/paket"
                  className="inline-flex items-center gap-2 rounded-xl border border-brass/40 bg-brass-soft px-4 py-2.5 font-body text-xs font-semibold text-ink transition hover:border-brass"
                >
                  <Lock className="h-3.5 w-3.5 text-brass" />
                  <span>Barang Tak Terbatas &amp; CSV (Pro)</span>
                </Link>
              )}
            </div>
          </div>

          {!fiturStokPenuh && (
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-brass/30 bg-brass-soft px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-ink">
                <Sparkles className="h-4 w-4 shrink-0 text-brass" />
                <span>
                  Paket Gratis mencakup hingga {BATAS_BARANG_STOK_GRATIS} jenis barang. Upgrade ke{" "}
                  <strong>CuanKit Pro</strong> untuk item tak terbatas &amp; ekspor CSV.
                </span>
              </div>
              <Link
                href="/paket"
                className="shrink-0 font-body text-xs font-semibold text-forest underline"
              >
                Lihat Paket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
