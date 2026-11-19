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
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Download,
  Lock,
  Pencil,
  PlusCircle,
  Search,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import AuthAkunPanel from "@/components/AuthAkunPanel";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import GrafikBukuKas from "@/components/GrafikBukuKas";
import TombolUnduh from "@/components/TombolUnduh";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { angkaNonNegatif, formatRupiah } from "@/lib/hitung";
import {
  bacaTransaksiLokalKas,
  buatDataGrafikKas,
  eksporCSVBukuKas,
  filterTransaksiByPeriode,
  hapusTransaksiKasFirestore,
  hitungRingkasanKas,
  KATEGORI_PEMASUKAN,
  KATEGORI_PENGELUARAN,
  LABEL_METODE_KAS,
  simpanTransaksiLokalKas,
  tambahTransaksiKasFirestore,
  ubahTransaksiKasFirestore,
  type CashTransactionInput,
  type CashTransactionRecord,
  type JenisKas,
  type MetodeKas,
  type PeriodeLaporanKas,
} from "@/lib/bukuKas";
import { cekAksesFitur, tanggalHariIniISO } from "@/lib/paket";

const METODE_OPTIONS: MetodeKas[] = ["tunai", "transfer", "qris", "lainnya"];

export default function BukuKasHarian() {
  const { user, profile, authReady } = useFirebaseAuth();

  const [transaksiCloud, setTransaksiCloud] = useState<CashTransactionRecord[]>([]);
  const [transaksiTamu, setTransaksiTamu] = useState<CashTransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Tambah / Edit Transaksi
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<JenisKas>("masuk");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>(KATEGORI_PEMASUKAN[0]);
  const [date, setDate] = useState<string>(() => tanggalHariIniISO());
  const [paymentMethod, setPaymentMethod] = useState<MetodeKas>("tunai");
  const [description, setDescription] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  // Filter Laporan
  const [periode, setPeriode] = useState<PeriodeLaporanKas>("harian");
  const [tanggalAcuan, setTanggalAcuan] = useState<string>(() =>
    tanggalHariIniISO()
  );
  const [filterJenis, setFilterJenis] = useState<"semua" | JenisKas>("semua");
  const [cari, setCari] = useState("");
  const [hapusKonfirmasiId, setHapusKonfirmasiId] = useState<string | null>(null);

  // Muat mode tamu lokal bila belum login
  useEffect(() => {
    setTransaksiTamu(bacaTransaksiLokalKas());
  }, []);

  // Langganan Firestore saat user login (query filter ownerId saja agar bebas error index komposit)
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setTransaksiCloud([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "transactions"),
      where("ownerId", "==", user.uid),
      limit(500)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CashTransactionRecord, "id">),
        }));
        rows.sort((a, b) => {
          const cmpDate = b.date.localeCompare(a.date);
          if (cmpDate !== 0) return cmpDate;
          return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);
        });
        setTransaksiCloud(rows);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, "transactions");
      }
    );

    return () => unsub();
  }, [authReady, user]);

  const sumberData = user ? transaksiCloud : transaksiTamu;
  const plan = profile?.plan ?? "gratis";
  const bolehEksporLanjutan = cekAksesFitur(plan, "buku_kas_laporan_lanjutan");

  // Saldo keseluruhan sepanjang catatan
  const saldoKumulatif = useMemo(
    () => hitungRingkasanKas(sumberData).saldoBersih,
    [sumberData]
  );

  // Data terfilter periode (Harian / Mingguan / Bulanan)
  const dataPeriode = useMemo(
    () => filterTransaksiByPeriode(sumberData, periode, tanggalAcuan),
    [sumberData, periode, tanggalAcuan]
  );

  const ringkasanPeriode = useMemo(
    () => hitungRingkasanKas(dataPeriode),
    [dataPeriode]
  );

  const dataGrafik = useMemo(
    () => buatDataGrafikKas(sumberData, periode, tanggalAcuan),
    [sumberData, periode, tanggalAcuan]
  );

  const daftarTampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return dataPeriode.filter((tx) => {
      if (filterJenis !== "semua" && tx.type !== filterJenis) return false;
      if (!q) return true;
      return (
        tx.category.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q)
      );
    });
  }, [dataPeriode, filterJenis, cari]);

  const daftarKategoriAktif =
    type === "masuk" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

  function gantiJenisForm(nextType: JenisKas) {
    setType(nextType);
    const listBaru =
      nextType === "masuk" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;
    if (!listBaru.includes(category)) {
      setCategory(listBaru[0]);
    }
  }

  function resetForm() {
    setEditingId(null);
    setAmount(0);
    setDescription("");
    setDate(tanggalAcuan);
    setPaymentMethod("tunai");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (amount <= 0) {
      setFeedback({
        tipe: "error",
        teks: "Masukkan nominal transaksi lebih dari Rp 0.",
      });
      return;
    }

    const input: CashTransactionInput = {
      type,
      amount,
      category,
      date,
      paymentMethod,
      description,
    };

    if (!user) {
      // Mode uji coba lokal untuk pengunjung yang belum login
      if (editingId) {
        const updated = transaksiTamu.map((item) =>
          item.id === editingId ? { ...item, ...input } : item
        );
        setTransaksiTamu(updated);
        simpanTransaksiLokalKas(updated);
        setFeedback({
          tipe: "sukses",
          teks: "Transaksi diperbarui di perangkat ini. Masuk Google untuk sinkronisasi antarperangkat.",
        });
      } else {
        const baru: CashTransactionRecord = {
          id: `lokal-${Date.now()}`,
          ownerId: "tamu",
          ...input,
        };
        const updated = [baru, ...transaksiTamu].sort((a, b) =>
          b.date.localeCompare(a.date)
        );
        setTransaksiTamu(updated);
        simpanTransaksiLokalKas(updated);
        setFeedback({
          tipe: "sukses",
          teks: "Transaksi dicatat sementara di browser ini. Masuk akun untuk menyimpan lintas perangkat.",
        });
      }
      resetForm();
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await ubahTransaksiKasFirestore(editingId, user.uid, input);
        setFeedback({
          tipe: "sukses",
          teks: "Perubahan transaksi kas berhasil disimpan.",
        });
      } else {
        await tambahTransaksiKasFirestore(user.uid, input);
        setFeedback({
          tipe: "sukses",
          teks: `${
            type === "masuk" ? "Pemasukan" : "Pengeluaran"
          } sebesar ${formatRupiah(amount)} berhasil dicatat.`,
        });
      }
      resetForm();
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan transaksi kas.",
      });
    } finally {
      setSaving(false);
    }
  }

  function mulaiEdit(tx: CashTransactionRecord) {
    setEditingId(tx.id);
    setType(tx.type);
    setAmount(tx.amount);
    setCategory(tx.category);
    setDate(tx.date);
    setPaymentMethod(tx.paymentMethod);
    setDescription(tx.description);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function konfirmasiHapus(id: string) {
    setHapusKonfirmasiId(null);
    if (!user) {
      const updated = transaksiTamu.filter((t) => t.id !== id);
      setTransaksiTamu(updated);
      simpanTransaksiLokalKas(updated);
      if (editingId === id) resetForm();
      return;
    }

    try {
      await hapusTransaksiKasFirestore(id);
      if (editingId === id) resetForm();
      setFeedback({
        tipe: "sukses",
        teks: "Transaksi berhasil dihapus dari buku kas.",
      });
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Gagal menghapus transaksi.",
      });
    }
  }

  const labelPeriodeAktif =
    periode === "harian"
      ? `Tanggal ${tanggalAcuan}`
      : periode === "mingguan"
      ? `7 Hari hingga ${tanggalAcuan}`
      : `Bulan ${tanggalAcuan.slice(0, 7)}`;

  return (
    <div className="space-y-8">
      <AuthAkunPanel ringkas />

      {/* Ringkasan Saldo Otomatis */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Pemasukan ({periode})</span>
            <ArrowDownCircle className="h-4 w-4 text-forest" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-forest">
            {formatRupiah(ringkasanPeriode.totalMasuk)}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            {ringkasanPeriode.jumlahMasuk} transaksi masuk
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Pengeluaran ({periode})</span>
            <ArrowUpCircle className="h-4 w-4 text-ledger" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ledger">
            {formatRupiah(ringkasanPeriode.totalKeluar)}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            {ringkasanPeriode.jumlahKeluar} transaksi keluar
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Selisih Kas ({periode})</span>
            <Wallet className="h-4 w-4 text-ink" />
          </div>
          <p
            className={`mt-2 font-mono text-2xl font-bold tabular-nums ${
              ringkasanPeriode.saldoBersih >= 0 ? "text-ink" : "text-ledger"
            }`}
          >
            {formatRupiah(ringkasanPeriode.saldoBersih)}
          </p>
          <p className="mt-1 font-body text-xs text-muted">
            {labelPeriodeAktif}
          </p>
        </div>

        <div className="rounded-2xl border border-forest/25 bg-forest-soft p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-forest">
            <span>Saldo Kas Total</span>
            <Wallet className="h-4 w-4 text-forest" />
          </div>
          <p
            className={`mt-2 font-mono text-2xl font-bold tabular-nums ${
              saldoKumulatif >= 0 ? "text-forest" : "text-ledger"
            }`}
          >
            {formatRupiah(saldoKumulatif)}
          </p>
          <p className="mt-1 font-body text-xs text-forest/80">
            Akumulasi seluruh {sumberData.length} catatan
          </p>
        </div>
      </div>

      {/* Layout Utama: Form Catat Transaksi + Grafik & Ringkasan */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Form Pencatatan Cepat */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card lg:col-span-5"
        >
          <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
            <h2 className="font-display text-lg font-semibold text-ink">
              {editingId ? "Edit Transaksi Kas" : "Catat Transaksi Kas"}
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

          {/* Toggle Pemasukan / Pengeluaran */}
          <div
            role="group"
            aria-label="Pilih jenis transaksi"
            className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-ink/10 bg-paperDark/70 p-1"
          >
            <button
              type="button"
              onClick={() => gantiJenisForm("masuk")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-body text-xs font-semibold transition ${
                type === "masuk"
                  ? "bg-forest text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <ArrowDownCircle className="h-4 w-4" />
              <span>Pemasukan</span>
            </button>
            <button
              type="button"
              onClick={() => gantiJenisForm("keluar")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 font-body text-xs font-semibold transition ${
                type === "keluar"
                  ? "bg-ledger text-white shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              <ArrowUpCircle className="h-4 w-4" />
              <span>Pengeluaran</span>
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="kas-nominal"
                className="block font-body text-xs font-semibold text-ink"
              >
                Nominal (Rp) *
              </label>
              <input
                id="kas-nominal"
                type="number"
                min={1}
                required
                value={amount || ""}
                onChange={(e) => setAmount(angkaNonNegatif(e.target.value))}
                placeholder="Misal: 150000"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-base font-semibold tabular-nums text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="kas-kategori"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Kategori *
                </label>
                <select
                  id="kas-kategori"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                >
                  {daftarKategoriAktif.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="kas-tanggal"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Tanggal *
                </label>
                <input
                  id="kas-tanggal"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="kas-metode"
                className="block font-body text-xs font-semibold text-ink"
              >
                Metode Pembayaran
              </label>
              <select
                id="kas-metode"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as MetodeKas)
                }
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
              >
                {METODE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {LABEL_METODE_KAS[m]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="kas-catatan"
                className="block font-body text-xs font-semibold text-ink"
              >
                Keterangan / Catatan
              </label>
              <input
                id="kas-catatan"
                type="text"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Misal: Belanja es batu & gula 10 kg"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            {feedback && (
              <p
                role={feedback.tipe === "error" ? "alert" : "status"}
                className={`rounded-xl px-3.5 py-2.5 font-body text-xs leading-relaxed ${
                  feedback.tipe === "error"
                    ? "border border-ledger/20 bg-ledger/5 text-ledger"
                    : "border border-forest/20 bg-forest-soft text-forest"
                }`}
              >
                {feedback.teks}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 ${
                type === "masuk"
                  ? "bg-forest hover:bg-forest-light"
                  : "bg-ledger hover:opacity-90"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>
                {saving
                  ? "Menyimpan..."
                  : editingId
                  ? "Simpan Perubahan"
                  : type === "masuk"
                  ? "Simpan Pemasukan"
                  : "Simpan Pengeluaran"}
              </span>
            </button>
          </div>
        </form>

        {/* Panel Laporan & Grafik Keuangan */}
        <div className="space-y-5 lg:col-span-7">
          <div
            id="laporan-buku-kas"
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            {/* Kontrol Periode Laporan */}
            <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-4 sm:flex-row sm:items-center">
              <div
                role="tablist"
                aria-label="Pilih periode laporan kas"
                className="inline-flex rounded-xl border border-ink/10 bg-paperDark/80 p-1"
              >
                {(["harian", "mingguan", "bulanan"] as PeriodeLaporanKas[]).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      role="tab"
                      aria-selected={periode === p}
                      onClick={() => setPeriode(p)}
                      className={`rounded-lg px-3.5 py-1.5 font-body text-xs font-semibold capitalize transition ${
                        periode === p
                          ? "bg-surface text-forest shadow-sm"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted" />
                <label htmlFor="kas-tanggal-acuan" className="sr-only">
                  Tanggal acuan laporan
                </label>
                <input
                  id="kas-tanggal-acuan"
                  type="date"
                  value={tanggalAcuan}
                  onChange={(e) =>
                    setTanggalAcuan(e.target.value || tanggalHariIniISO())
                  }
                  className="rounded-xl border border-ink/15 bg-paper px-3 py-1.5 font-mono text-xs text-ink focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            {/* Grafik Sederhana */}
            <div className="mt-5">
              <GrafikBukuKas
                data={dataGrafik}
                judul={
                  periode === "bulanan"
                    ? `Ringkasan Pekanan Bulan ${tanggalAcuan.slice(0, 7)}`
                    : `Pergerakan 7 Hari hingga ${tanggalAcuan}`
                }
              />
            </div>

            {/* Ringkasan Per Kategori */}
            {ringkasanPeriode.kategoriTeratas.length > 0 && (
              <div className="mt-5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Rincian Per Kategori ({labelPeriodeAktif})
                </p>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {ringkasanPeriode.kategoriTeratas.slice(0, 6).map((kat) => (
                    <div
                      key={`${kat.type}-${kat.kategori}`}
                      className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper/70 px-3.5 py-2.5 text-xs"
                    >
                      <span className="truncate pr-2 font-body font-medium text-ink">
                        {kat.kategori}
                      </span>
                      <span
                        className={`shrink-0 font-mono font-semibold tabular-nums ${
                          kat.type === "masuk" ? "text-forest" : "text-ledger"
                        }`}
                      >
                        {kat.type === "masuk" ? "+" : "-"}
                        {formatRupiah(kat.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ekspor Laporan (PDF/PNG Gratis + CSV Lanjutan Pro) */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card print:hidden">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Ekspor Laporan Keuangan
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <TombolUnduh
                elementId="laporan-buku-kas"
                namaFile={`Laporan-Kas-${periode}-${tanggalAcuan}`}
              />

              {bolehEksporLanjutan ? (
                <button
                  type="button"
                  onClick={() =>
                    eksporCSVBukuKas(
                      daftarTampil,
                      `Buku-Kas-${periode}-${tanggalAcuan}`
                    )
                  }
                  disabled={daftarTampil.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh CSV Lengkap</span>
                </button>
              ) : (
                <Link
                  href="/paket"
                  className="inline-flex items-center gap-2 rounded-xl border border-brass/40 bg-brass-soft px-4 py-2.5 font-body text-xs font-semibold text-ink transition hover:border-brass"
                >
                  <Lock className="h-3.5 w-3.5 text-brass" />
                  <span>Ekspor CSV Lengkap (Paket Pro)</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Riwayat Transaksi */}
      <section className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-7 shadow-card print:hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Daftar Transaksi ({labelPeriodeAktif})
            </h2>
            <p className="mt-1 font-body text-xs text-muted">
              Menampilkan {daftarTampil.length} transaksi pada periode terpilih.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <label htmlFor="cari-kas" className="sr-only">
                Cari kategori atau catatan transaksi
              </label>
              <input
                id="cari-kas"
                type="search"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari kategori / catatan..."
                className="rounded-xl border border-ink/15 bg-paper py-2 pl-8 pr-3 font-body text-xs text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <label htmlFor="filter-jenis-kas" className="sr-only">
              Filter jenis transaksi
            </label>
            <select
              id="filter-jenis-kas"
              value={filterJenis}
              onChange={(e) =>
                setFilterJenis(e.target.value as "semua" | JenisKas)
              }
              className="rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-medium text-ink focus:border-forest focus:outline-none"
            >
              <option value="semua">Semua Jenis</option>
              <option value="masuk">Pemasukan Saja</option>
              <option value="keluar">Pengeluaran Saja</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-5 space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-paperDark" />
            <div className="h-16 animate-pulse rounded-xl bg-paperDark" />
          </div>
        ) : daftarTampil.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-body text-sm text-muted">
              Belum ada transaksi pada periode {labelPeriodeAktif}. Gunakan formulir di atas untuk mulai mencatat pemasukan atau pengeluaran.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {daftarTampil.map((tx) => {
              const isMasuk = tx.type === "masuk";
              const konfirmasi = hapusKonfirmasiId === tx.id;
              return (
                <div
                  key={tx.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-ink/10 bg-paper/70 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isMasuk
                          ? "bg-forest-soft text-forest"
                          : "bg-ledger/10 text-ledger"
                      }`}
                    >
                      {isMasuk ? (
                        <ArrowDownCircle className="h-4 w-4" />
                      ) : (
                        <ArrowUpCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-body text-sm font-semibold text-ink">
                          {tx.category}
                        </span>
                        <span className="text-muted">·</span>
                        <span className="font-mono text-[11px] text-muted">
                          {tx.date}
                        </span>
                        <span className="text-muted">·</span>
                        <span className="font-body text-xs text-muted">
                          {LABEL_METODE_KAS[tx.paymentMethod]}
                        </span>
                      </div>
                      {tx.description && (
                        <p className="mt-0.5 font-body text-xs text-muted">
                          {tx.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p
                      className={`font-mono text-base font-bold tabular-nums ${
                        isMasuk ? "text-forest" : "text-ledger"
                      }`}
                    >
                      {isMasuk ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </p>

                    {konfirmasi ? (
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => void konfirmasiHapus(tx.id)}
                          className="font-semibold text-ledger underline"
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => setHapusKonfirmasiId(null)}
                          className="text-muted hover:text-ink"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => mulaiEdit(tx)}
                          aria-label={`Edit transaksi ${tx.category}`}
                          className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-forest"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHapusKonfirmasiId(tx.id)}
                          aria-label={`Hapus transaksi ${tx.category}`}
                          className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-ledger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!bolehEksporLanjutan && (
          <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-brass/30 bg-brass-soft px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-ink">
              <Sparkles className="h-4 w-4 shrink-0 text-brass" />
              <span>
                Ingin ekspor catatan buku kas ke format CSV/Excel untuk pembukuan lanjutan? Tersedia di{" "}
                <strong>CuanKit Pro</strong>.
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
      </section>
    </div>
  );
}
