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
  Ban,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  FilePlus2,
  MessageCircle,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import AuthAkunPanel from "@/components/AuthAkunPanel";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import TombolUnduh from "@/components/TombolUnduh";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { angkaNonNegatif, formatRupiah } from "@/lib/hitung";
import {
  bacaDraftNotaLokal,
  batalkanNotaFirestore,
  buatNomorNotaOtomatis,
  buatNotaKosong,
  buatTautanWhatsAppNota,
  hapusNotaFirestore,
  hitungRingkasanNota,
  kompresLogoGambar,
  kuotaTerpakaiBulanBerjalan,
  LABEL_METODE_BAYAR,
  LABEL_STATUS_BAYAR,
  perbaruiNotaFirestore,
  perbaruiPembayaranNotaFirestore,
  simpanDraftNotaLokal,
  simpanNotaBaruFirestore,
  type InvoiceRecord,
  type ItemNota,
  type MetodePembayaranNota,
  type NotaFormInput,
  type StatusPembayaranNota,
} from "@/lib/nota";
import { hitungStatusKuotaNota, kunciBulanSekarang } from "@/lib/paket";

const METODE_OPSI: MetodePembayaranNota[] = ["tunai", "transfer", "qris", "tempo"];
const STATUS_OPSI: StatusPembayaranNota[] = ["lunas", "dp", "belum_lunas"];

export default function GeneratorNota() {
  const { user, profile, authReady, simpanProfilToko } = useFirebaseAuth();

  const [form, setForm] = useState<NotaFormInput>(() => buatNotaKosong());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tabMobile, setTabMobile] = useState<"editor" | "pratinjau">("editor");
  const [saving, setSaving] = useState(false);
  const [savingDefaultToko, setSavingDefaultToko] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Riwayat nota tersinkronisasi dari Firestore
  const [riwayat, setRiwayat] = useState<InvoiceRecord[]>([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "semua" | StatusPembayaranNota | "batal"
  >("semua");
  const [konfirmasiAksi, setKonfirmasiAksi] = useState<{
    id: string;
    jenis: "batal" | "hapus";
  } | null>(null);

  // Muat draft lokal saat halaman pertama kali dibuka (hanya jika belum mengedit)
  useEffect(() => {
    const draft = bacaDraftNotaLokal();
    if (draft) {
      setForm(draft);
    }
  }, []);

  // Isi identitas toko default dari profil Firestore bila kolom toko masih kosong
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => {
      if (prev.storeName || prev.storePhone || prev.storeAddress || prev.storeLogoData) {
        return prev;
      }
      return {
        ...prev,
        storeName: profile.businessName || "",
        storePhone: profile.businessPhone || "",
        storeAddress: profile.businessAddress || "",
        storeLogoData: profile.businessLogoData || "",
      };
    });
  }, [profile]);

  // Simpan draft lokal otomatis untuk kenyamanan mengetik
  useEffect(() => {
    simpanDraftNotaLokal(form);
  }, [form]);

  // Langganan riwayat nota pengguna dari Firestore (filter ownerId saja agar tidak butuh index komposit)
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setRiwayat([]);
      return;
    }

    setLoadingRiwayat(true);
    const q = query(
      collection(db, "invoices"),
      where("ownerId", "==", user.uid),
      limit(100)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<InvoiceRecord, "id">),
        }));
        rows.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() ?? 0;
          const tB = b.createdAt?.toMillis?.() ?? 0;
          if (tB !== tA) return tB - tA;
          return b.issueDate.localeCompare(a.issueDate);
        });
        setRiwayat(rows);
        setLoadingRiwayat(false);
      },
      (err) => {
        setLoadingRiwayat(false);
        handleFirestoreError(err, OperationType.LIST, "invoices");
      }
    );

    return () => unsub();
  }, [authReady, user]);

  const ringkasan = useMemo(
    () =>
      hitungRingkasanNota(
        form.items,
        form.discountAmount,
        form.shippingFee,
        form.paidAmount
      ),
    [form.items, form.discountAmount, form.shippingFee, form.paidAmount]
  );

  const plan = profile?.plan ?? "gratis";
  const terpakaiBulanIni = kuotaTerpakaiBulanBerjalan(
    profile?.invoiceMonthKey,
    profile?.invoiceCountThisMonth
  );
  const kuota = hitungStatusKuotaNota(plan, terpakaiBulanIni);

  const waUrl = useMemo(() => buatTautanWhatsAppNota(form), [form]);

  const riwayatTersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return riwayat.filter((inv) => {
      if (filterStatus === "batal" && inv.recordStatus !== "batal") return false;
      if (
        filterStatus !== "semua" &&
        filterStatus !== "batal" &&
        (inv.recordStatus === "batal" || inv.paymentStatus !== filterStatus)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.storeName.toLowerCase().includes(q)
      );
    });
  }, [riwayat, cari, filterStatus]);

  function updateItem(index: number, patch: Partial<ItemNota>) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function tambahItem() {
    if (form.items.length >= 25) {
      setFeedback({
        tipe: "error",
        teks: "Maksimal 25 item barang per nota.",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { nama: "", qty: 1, harga: 0 }],
    }));
  }

  function hapusItem(index: number) {
    if (form.items.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  }

  async function handleUnggahLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeedback(null);
    try {
      const dataUrl = await kompresLogoGambar(file);
      setForm((prev) => ({ ...prev, storeLogoData: dataUrl }));
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks: err instanceof Error ? err.message : "Gagal memproses logo.",
      });
    }
  }

  async function handleSimpanDefaultToko() {
    if (!user) return;
    setFeedback(null);
    setSavingDefaultToko(true);
    try {
      await simpanProfilToko({
        businessName: form.storeName,
        businessPhone: form.storePhone,
        businessAddress: form.storeAddress,
        businessLogoData: form.storeLogoData,
      });
      setFeedback({
        tipe: "sukses",
        teks: "Identitas toko ini disimpan sebagai default untuk nota berikutnya.",
      });
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan identitas toko default.",
      });
    } finally {
      setSavingDefaultToko(false);
    }
  }

  function buatBaru() {
    setEditingId(null);
    setFeedback(null);
    setForm(
      buatNotaKosong({
        storeName: form.storeName || profile?.businessName || "",
        storePhone: form.storePhone || profile?.businessPhone || "",
        storeAddress: form.storeAddress || profile?.businessAddress || "",
        storeLogoData: form.storeLogoData || profile?.businessLogoData || "",
      })
    );
  }

  async function handleSimpanNota(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!user) {
      setFeedback({
        tipe: "error",
        teks: "Silakan masuk dengan Google terlebih dahulu untuk menyimpan nota ke cloud.",
      });
      return;
    }

    if (!editingId && !kuota.bolehBuat) {
      setFeedback({
        tipe: "error",
        teks: `Kuota ${kuota.batas} nota/bulan pada Paket Gratis sudah habis. Anda tetap bisa mengedit nota lama atau melihat info Paket Pro.`,
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await perbaruiNotaFirestore(editingId, user.uid, form);
        setFeedback({
          tipe: "sukses",
          teks: `Perubahan nota ${form.invoiceNumber} berhasil disimpan.`,
        });
      } else {
        const currentMonthKey =
          profile?.invoiceMonthKey || kunciBulanSekarang();
        const currentCount = profile?.invoiceCountThisMonth ?? 0;
        const idBaru = await simpanNotaBaruFirestore({
          uid: user.uid,
          currentMonthKey,
          currentCountThisMonth: currentCount,
          input: form,
        });
        setEditingId(idBaru);
        setFeedback({
          tipe: "sukses",
          teks: `Nota ${form.invoiceNumber} tersimpan ke akun Anda dan siap diunduh atau dikirim ke pelanggan.`,
        });
      }
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan nota. Periksa kembali isian Anda.",
      });
    } finally {
      setSaving(false);
    }
  }

  function muatNotaKeEditor(inv: InvoiceRecord) {
    setEditingId(inv.recordStatus === "aktif" ? inv.id : null);
    setFeedback(
      inv.recordStatus === "batal"
        ? {
            tipe: "error",
            teks: "Nota ini berstatus Dibatalkan. Anda bisa memakainya sebagai acuan untuk membuat nota baru.",
          }
        : null
    );
    setForm({
      invoiceNumber:
        inv.recordStatus === "batal"
          ? buatNomorNotaOtomatis()
          : inv.invoiceNumber,
      issueDate: inv.issueDate,
      storeName: inv.storeName,
      storePhone: inv.storePhone,
      storeAddress: inv.storeAddress,
      storeLogoData: inv.storeLogoData,
      customerName: inv.customerName,
      customerPhone: inv.customerPhone,
      items: inv.items.length > 0 ? inv.items : [{ nama: "", qty: 1, harga: 0 }],
      discountAmount: inv.discountAmount,
      shippingFee: inv.shippingFee,
      paidAmount: inv.paidAmount,
      paymentMethod: inv.paymentMethod,
      paymentStatus: inv.paymentStatus,
      notes: inv.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleTandaiLunas(inv: InvoiceRecord) {
    setFeedback(null);
    try {
      await perbaruiPembayaranNotaFirestore(
        inv.id,
        inv.totalAmount,
        inv.paymentMethod,
        "lunas"
      );
      setFeedback({
        tipe: "sukses",
        teks: `Nota ${inv.invoiceNumber} ditandai Lunas.`,
      });
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Gagal memperbarui status pembayaran nota.",
      });
    }
  }

  async function jalankanKonfirmasiAksi() {
    if (!konfirmasiAksi) return;
    const { id, jenis } = konfirmasiAksi;
    setKonfirmasiAksi(null);
    try {
      if (jenis === "batal") {
        await batalkanNotaFirestore(id);
        if (editingId === id) setEditingId(null);
        setFeedback({
          tipe: "sukses",
          teks: "Nota berhasil dibatalkan dan terkunci dari perubahan.",
        });
      } else {
        await hapusNotaFirestore(id);
        if (editingId === id) setEditingId(null);
        setFeedback({
          tipe: "sukses",
          teks: "Nota dihapus dari daftar riwayat.",
        });
      }
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Gagal memproses tindakan pada nota.",
      });
    }
  }

  async function salinTeksNota() {
    try {
      const urlObj = new URL(waUrl);
      const text = urlObj.searchParams.get("text") || "";
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      setFeedback({
        tipe: "error",
        teks: "Browser tidak mengizinkan penyalinan otomatis.",
      });
    }
  }

  const namaFileEkspor = `Nota-${(form.invoiceNumber || "CuanKit").replace(
    /[^a-zA-Z0-9_-]/g,
    "-"
  )}`;

  return (
    <div className="space-y-8">
      <AuthAkunPanel />

      {/* Mobile Tab Switcher (Editor vs Pratinjau) */}
      <div
        role="tablist"
        aria-label="Tampilan Generator Nota"
        className="grid grid-cols-2 gap-1.5 rounded-xl border border-ink/10 bg-paperDark/80 p-1 lg:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tabMobile === "editor"}
          onClick={() => setTabMobile("editor")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-body text-xs font-semibold transition ${
            tabMobile === "editor"
              ? "bg-surface text-forest shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Isi Data Nota</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tabMobile === "pratinjau"}
          onClick={() => setTabMobile("pratinjau")}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 font-body text-xs font-semibold transition ${
            tabMobile === "pratinjau"
              ? "bg-surface text-forest shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Lihat Nota &amp; Kirim</span>
        </button>
      </div>

      {/* Workspace 2 Kolom */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Kolom Kiri: Form Editor */}
        <form
          onSubmit={handleSimpanNota}
          className={`space-y-6 lg:col-span-7 ${
            tabMobile === "pratinjau" ? "hidden lg:block" : ""
          }`}
        >
          {/* 1. Identitas Toko */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-forest" />
                <h2 className="font-display text-lg font-semibold text-ink">
                  Identitas Toko / Usaha
                </h2>
              </div>
              {user && (
                <button
                  type="button"
                  onClick={() => void handleSimpanDefaultToko()}
                  disabled={savingDefaultToko}
                  className="font-body text-xs font-semibold text-forest hover:underline disabled:opacity-50"
                >
                  {savingDefaultToko
                    ? "Menyimpan..."
                    : "Jadikan Identitas Default"}
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nota-nama-toko"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Nama Toko / Usaha *
                </label>
                <input
                  id="nota-nama-toko"
                  type="text"
                  required
                  maxLength={120}
                  value={form.storeName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, storeName: e.target.value }))
                  }
                  placeholder="Misal: Warung Kopi Nusantara"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="nota-telp-toko"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  No. HP / WhatsApp Toko
                </label>
                <input
                  id="nota-telp-toko"
                  type="tel"
                  maxLength={32}
                  value={form.storePhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, storePhone: e.target.value }))
                  }
                  placeholder="0812-3456-7890"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="nota-alamat-toko"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Alamat Toko
                </label>
                <input
                  id="nota-alamat-toko"
                  type="text"
                  maxLength={240}
                  value={form.storeAddress}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, storeAddress: e.target.value }))
                  }
                  placeholder="Jl. Mawar No. 8, Kec. Sukajadi, Bandung"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                {form.storeLogoData && (
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-ink/15 bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.storeLogoData}
                      alt="Logo toko"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <label
                  htmlFor="nota-upload-logo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/15 bg-paper px-3.5 py-2 font-body text-xs font-semibold text-ink transition hover:bg-paperDark"
                >
                  <Upload className="h-3.5 w-3.5 text-forest" />
                  <span>
                    {form.storeLogoData ? "Ganti Logo Toko" : "Tambah Logo Toko"}
                  </span>
                </label>
                <input
                  id="nota-upload-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => void handleUnggahLogo(e)}
                  className="sr-only"
                />
                {form.storeLogoData && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, storeLogoData: "" }))
                    }
                    className="inline-flex items-center gap-1 font-body text-xs font-medium text-ledger hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus logo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Detail Nota & Pelanggan */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-forest" />
                <h2 className="font-display text-lg font-semibold text-ink">
                  Detail Nota &amp; Pelanggan
                </h2>
              </div>
              {editingId && (
                <span className="font-mono text-xs font-semibold text-brass">
                  Sedang Mengedit Nota
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nota-nomor"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Nomor Nota *
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="nota-nomor"
                    type="text"
                    required
                    maxLength={40}
                    value={form.invoiceNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, invoiceNumber: e.target.value }))
                    }
                    className="w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-forest focus:outline-none"
                  />
                  <button
                    type="button"
                    title="Buat nomor acak baru"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        invoiceNumber: buatNomorNotaOtomatis(),
                      }))
                    }
                    className="shrink-0 rounded-xl border border-ink/15 bg-paper px-3 text-ink transition hover:bg-paperDark"
                    aria-label="Buat nomor nota baru"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="nota-tanggal"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Tanggal Transaksi *
                </label>
                <input
                  id="nota-tanggal"
                  type="date"
                  required
                  value={form.issueDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, issueDate: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="nota-pelanggan"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Nama Pelanggan *
                </label>
                <input
                  id="nota-pelanggan"
                  type="text"
                  required
                  maxLength={120}
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                  placeholder="Misal: Ibu Rina / Pelanggan Umum"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="nota-wa-pelanggan"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  No. WhatsApp Pelanggan (opsional)
                </label>
                <input
                  id="nota-wa-pelanggan"
                  type="tel"
                  maxLength={32}
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerPhone: e.target.value }))
                  }
                  placeholder="0813-xxxx-xxxx"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Daftar Barang / Jasa */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3.5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Daftar Barang / Jasa ({form.items.length}/25)
              </h2>
              <button
                type="button"
                onClick={tambahItem}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest-soft px-3 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {form.items.map((item, idx) => {
                const subtotalItem =
                  Math.max(0, item.qty) * Math.max(0, item.harga);
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-ink/10 bg-paper/70 p-3.5"
                  >
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                      <div className="sm:col-span-5">
                        <label
                          htmlFor={`item-nama-${idx}`}
                          className="block font-body text-[11px] font-semibold text-muted"
                        >
                          Nama Barang / Layanan #{idx + 1}
                        </label>
                        <input
                          id={`item-nama-${idx}`}
                          type="text"
                          required
                          maxLength={120}
                          value={item.nama}
                          onChange={(e) =>
                            updateItem(idx, { nama: e.target.value })
                          }
                          placeholder="Misal: Ayam Geprek Komplit"
                          className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-3 py-2 font-body text-sm text-ink focus:border-forest focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:col-span-5">
                        <div>
                          <label
                            htmlFor={`item-qty-${idx}`}
                            className="block font-body text-[11px] font-semibold text-muted"
                          >
                            Jumlah
                          </label>
                          <input
                            id={`item-qty-${idx}`}
                            type="number"
                            min={0.01}
                            step="any"
                            required
                            value={item.qty || ""}
                            onChange={(e) =>
                              updateItem(idx, {
                                qty: angkaNonNegatif(e.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-3 py-2 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`item-harga-${idx}`}
                            className="block font-body text-[11px] font-semibold text-muted"
                          >
                            Harga Satuan (Rp)
                          </label>
                          <input
                            id={`item-harga-${idx}`}
                            type="number"
                            min={0}
                            required
                            value={item.harga || ""}
                            onChange={(e) =>
                              updateItem(idx, {
                                harga: angkaNonNegatif(e.target.value),
                              })
                            }
                            placeholder="0"
                            className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-3 py-2 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 sm:col-span-2 sm:flex-col sm:items-end">
                        <span className="font-mono text-xs font-semibold tabular-nums text-ink">
                          {formatRupiah(subtotalItem)}
                        </span>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => hapusItem(idx)}
                            aria-label={`Hapus item ${idx + 1}`}
                            className="rounded-lg p-1.5 text-muted transition hover:bg-ledger/10 hover:text-ledger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Diskon, Ongkir & Pembayaran */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card">
            <h2 className="border-b border-ink/10 pb-3.5 font-display text-lg font-semibold text-ink">
              Diskon, Pembayaran &amp; Catatan
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nota-diskon"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Diskon (Rp)
                </label>
                <input
                  id="nota-diskon"
                  type="number"
                  min={0}
                  value={form.discountAmount || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      discountAmount: angkaNonNegatif(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="nota-ongkir"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Ongkir / Biaya Tambahan (Rp)
                </label>
                <input
                  id="nota-ongkir"
                  type="number"
                  min={0}
                  value={form.shippingFee || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      shippingFee: angkaNonNegatif(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="nota-metode"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Metode Pembayaran
                </label>
                <select
                  id="nota-metode"
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      paymentMethod: e.target.value as MetodePembayaranNota,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                >
                  {METODE_OPSI.map((m) => (
                    <option key={m} value={m}>
                      {LABEL_METODE_BAYAR[m]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="nota-status-bayar"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Status Pembayaran
                </label>
                <select
                  id="nota-status-bayar"
                  value={form.paymentStatus}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      paymentStatus: e.target.value as StatusPembayaranNota,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                >
                  {STATUS_OPSI.map((s) => (
                    <option key={s} value={s}>
                      {LABEL_STATUS_BAYAR[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="nota-dibayar"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Nominal Dibayar Pelanggan (Rp)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        paidAmount: ringkasan.totalAmount,
                        paymentStatus: "lunas",
                      }))
                    }
                    className="font-body text-xs font-semibold text-forest hover:underline"
                  >
                    Isi Sesuai Total ({formatRupiah(ringkasan.totalAmount)})
                  </button>
                </div>
                <input
                  id="nota-dibayar"
                  type="number"
                  min={0}
                  value={form.paidAmount || ""}
                  onChange={(e) => {
                    const nominal = angkaNonNegatif(e.target.value);
                    const ringkasBaru = hitungRingkasanNota(
                      form.items,
                      form.discountAmount,
                      form.shippingFee,
                      nominal
                    );
                    setForm((p) => ({
                      ...p,
                      paidAmount: nominal,
                      paymentStatus: ringkasBaru.statusSaran,
                    }));
                  }}
                  placeholder="0"
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="nota-catatan"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Catatan Bawah Nota
                </label>
                <textarea
                  id="nota-catatan"
                  rows={2}
                  maxLength={300}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Misal: Terima kasih, pesanan diproses setelah transfer dikonfirmasi."
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            {feedback && (
              <div
                role={feedback.tipe === "error" ? "alert" : "status"}
                className={`mt-4 rounded-xl px-4 py-3 font-body text-xs leading-relaxed ${
                  feedback.tipe === "error"
                    ? "border border-ledger/20 bg-ledger/5 text-ledger"
                    : "border border-forest/20 bg-forest-soft text-forest"
                }`}
              >
                {feedback.teks}
                {feedback.tipe === "error" &&
                  !kuota.bolehBuat &&
                  !editingId && (
                    <Link
                      href="/paket"
                      className="ml-1.5 font-semibold underline"
                    >
                      Lihat Paket Pro
                    </Link>
                  )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>
                  {saving
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan Nota"
                    : "Simpan Nota ke Cloud"}
                </span>
              </button>

              <button
                type="button"
                onClick={buatBaru}
                className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-paperDark"
              >
                <FilePlus2 className="h-4 w-4" />
                <span>Nota Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setTabMobile("pratinjau")}
                className="inline-flex items-center gap-2 rounded-xl border border-forest/30 bg-forest-soft px-4 py-2.5 font-body text-sm font-semibold text-forest lg:hidden"
              >
                <Eye className="h-4 w-4" />
                <span>Pratinjau &amp; Unduh</span>
              </button>
            </div>
          </div>
        </form>

        {/* Kolom Kanan: Pratinjau Nota + Ekspor PDF/PNG + Bagikan WhatsApp */}
        <div
          className={`space-y-4 lg:sticky lg:top-20 lg:col-span-5 ${
            tabMobile === "editor" ? "hidden lg:block" : ""
          }`}
        >
          {/* Lembar Nota Resmi untuk Dicetak / Diunduh */}
          <div
            id="nota-pratinjau"
            className="rounded-2xl border border-ink/15 bg-white p-6 text-ink shadow-card"
          >
            {/* Header Nota */}
            <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
              <div className="flex items-start gap-3">
                {form.storeLogoData && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.storeLogoData}
                      alt={form.storeName || "Logo Toko"}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold leading-snug text-ink">
                    {form.storeName.trim() || "Nama Toko Anda"}
                  </h3>
                  {form.storePhone && (
                    <p className="mt-0.5 font-mono text-[11px] text-muted">
                      {form.storePhone}
                    </p>
                  )}
                  {form.storeAddress && (
                    <p className="mt-0.5 max-w-[220px] font-body text-[11px] leading-snug text-muted">
                      {form.storeAddress}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-forest">
                  NOTA PENJUALAN
                </p>
                <p className="mt-1 font-mono text-xs font-semibold text-ink">
                  {form.invoiceNumber || "-"}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {form.issueDate}
                </p>
              </div>
            </div>

            {/* Info Pelanggan */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3 text-xs">
              <div>
                <span className="text-muted">Kepada: </span>
                <span className="font-semibold text-ink">
                  {form.customerName.trim() || "Pelanggan"}
                </span>
                {form.customerPhone && (
                  <span className="ml-1.5 font-mono text-[11px] text-muted">
                    ({form.customerPhone})
                  </span>
                )}
              </div>
              <span
                className={`font-mono text-[11px] font-bold uppercase ${
                  form.paymentStatus === "lunas"
                    ? "text-forest"
                    : form.paymentStatus === "dp"
                    ? "text-brass"
                    : "text-ledger"
                }`}
              >
                {LABEL_STATUS_BAYAR[form.paymentStatus]}
              </span>
            </div>

            {/* Tabel Item */}
            <div className="mt-4">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/15 text-[11px] uppercase tracking-wide text-muted">
                    <th className="pb-2 font-semibold">Item</th>
                    <th className="pb-2 text-right font-semibold">Qty</th>
                    <th className="pb-2 text-right font-semibold">Harga</th>
                    <th className="pb-2 text-right font-semibold">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {form.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 pr-2 font-medium text-ink">
                        {item.nama.trim() || `Barang #${idx + 1}`}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums text-muted">
                        {item.qty}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums text-muted">
                        {formatRupiah(item.harga)}
                      </td>
                      <td className="py-2 text-right font-mono font-semibold tabular-nums text-ink">
                        {formatRupiah(
                          Math.max(0, item.qty) * Math.max(0, item.harga)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ringkasan Total */}
            <div className="mt-4 space-y-1.5 border-t border-ink/15 pt-3.5 font-body text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-ink">
                  {formatRupiah(ringkasan.subtotalAmount)}
                </span>
              </div>
              {form.discountAmount > 0 && (
                <div className="flex justify-between text-ledger">
                  <span>Diskon</span>
                  <span className="font-mono tabular-nums">
                    -{formatRupiah(form.discountAmount)}
                  </span>
                </div>
              )}
              {form.shippingFee > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Ongkir / Biaya Lain</span>
                  <span className="font-mono tabular-nums text-ink">
                    {formatRupiah(form.shippingFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-ink/10 pt-2 text-sm font-bold text-ink">
                <span>Total Tagihan</span>
                <span className="font-mono tabular-nums text-forest">
                  {formatRupiah(ringkasan.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Dibayar ({LABEL_METODE_BAYAR[form.paymentMethod]})</span>
                <span className="font-mono tabular-nums text-ink">
                  {formatRupiah(form.paidAmount)}
                </span>
              </div>
              {ringkasan.sisaTagihan > 0 && (
                <div className="flex justify-between font-semibold text-ledger">
                  <span>Sisa Tagihan</span>
                  <span className="font-mono tabular-nums">
                    {formatRupiah(ringkasan.sisaTagihan)}
                  </span>
                </div>
              )}
              {ringkasan.kembalian > 0 && (
                <div className="flex justify-between font-semibold text-forest">
                  <span>Kembalian</span>
                  <span className="font-mono tabular-nums">
                    {formatRupiah(ringkasan.kembalian)}
                  </span>
                </div>
              )}
            </div>

            {/* Catatan & Footer Nota */}
            {form.notes.trim() && (
              <p className="mt-4 border-t border-dashed border-ink/15 pt-3 font-body text-[11px] leading-relaxed text-muted">
                Catatan: {form.notes.trim()}
              </p>
            )}

            {plan === "gratis" && (
              <p className="mt-4 text-center font-mono text-[10px] text-muted/75">
                Dibuat dengan CuanKit.id
              </p>
            )}
          </div>

          {/* Aksi Ekspor & Share */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card print:hidden">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Unduh &amp; Bagikan ke Pelanggan
            </p>

            <TombolUnduh
              elementId="nota-pratinjau"
              namaFile={namaFileEkspor}
            />

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Kirim via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => void salinTeksNota()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-paperDark"
              >
                {copiedText ? (
                  <>
                    <Check className="h-4 w-4 text-forest" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Salin Teks Nota</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Nota Tersimpan (Cloud Firestore) */}
      <section className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-7 shadow-card print:hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Riwayat Nota Tersimpan
            </h2>
            <p className="mt-1 font-body text-xs text-muted">
              {user
                ? "Daftar nota yang sudah disimpan ke akun Anda dan siap dibuka dari perangkat mana saja."
                : "Masuk dengan akun Google di atas untuk menyimpan dan mengelola riwayat nota Anda."}
            </p>
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <label htmlFor="cari-nota-input" className="sr-only">
                  Cari nomor nota atau nama pelanggan
                </label>
                <input
                  id="cari-nota-input"
                  type="search"
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  placeholder="Cari nomor / pelanggan..."
                  className="rounded-xl border border-ink/15 bg-paper py-2 pl-8 pr-3 font-body text-xs text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <label htmlFor="filter-status-nota" className="sr-only">
                Filter status nota
              </label>
              <select
                id="filter-status-nota"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "semua" | StatusPembayaranNota | "batal"
                  )
                }
                className="rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-medium text-ink focus:border-forest focus:outline-none"
              >
                <option value="semua">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="dp">DP / Sebagian</option>
                <option value="belum_lunas">Belum Lunas</option>
                <option value="batal">Dibatalkan</option>
              </select>
            </div>
          )}
        </div>

        {!user ? (
          <div className="py-10 text-center">
            <p className="font-body text-sm text-muted">
              Belum ada riwayat tersinkronisasi karena Anda belum masuk akun.
            </p>
          </div>
        ) : loadingRiwayat ? (
          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
            <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
          </div>
        ) : riwayatTersaring.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-body text-sm text-muted">
              {riwayat.length === 0
                ? "Belum ada nota tersimpan. Buat nota pertama Anda lalu klik Simpan Nota ke Cloud."
                : "Tidak ada nota yang cocok dengan pencarian Anda."}
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {riwayatTersaring.map((inv) => {
              const dibatalkan = inv.recordStatus === "batal";
              const linkWA = buatTautanWhatsAppNota(inv);
              const sedangKonfirmasi = konfirmasiAksi?.id === inv.id;

              return (
                <div
                  key={inv.id}
                  className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                    dibatalkan
                      ? "border-ink/10 bg-paper/50 opacity-75"
                      : "border-ink/10 bg-paper/70 hover:border-forest/30"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs font-semibold text-ink">
                          {inv.invoiceNumber} · {inv.issueDate}
                        </p>
                        <h3 className="mt-0.5 font-display text-base font-semibold text-ink">
                          {inv.customerName}
                        </h3>
                      </div>
                      <p className="font-mono text-sm font-bold tabular-nums text-forest">
                        {formatRupiah(inv.totalAmount)}
                      </p>
                    </div>

                    <p className="mt-1.5 font-body text-xs text-muted">
                      {inv.items.length} item · {LABEL_METODE_BAYAR[inv.paymentMethod]} ·{" "}
                      <span
                        className={`font-semibold ${
                          dibatalkan
                            ? "text-ledger"
                            : inv.paymentStatus === "lunas"
                            ? "text-forest"
                            : inv.paymentStatus === "dp"
                            ? "text-brass"
                            : "text-ledger"
                        }`}
                      >
                        {dibatalkan
                          ? "Dibatalkan"
                          : LABEL_STATUS_BAYAR[inv.paymentStatus]}
                      </span>
                    </p>
                  </div>

                  {sedangKonfirmasi ? (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-ledger/20 bg-ledger/5 px-3 py-2 text-xs">
                      <span className="font-medium text-ledger">
                        {konfirmasiAksi.jenis === "batal"
                          ? "Batalkan nota ini?"
                          : "Hapus permanen?"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void jalankanKonfirmasiAksi()}
                          className="font-semibold text-ledger underline"
                        >
                          Ya, lanjutkan
                        </button>
                        <button
                          type="button"
                          onClick={() => setKonfirmasiAksi(null)}
                          className="font-medium text-muted hover:text-ink"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
                      <button
                        type="button"
                        onClick={() => muatNotaKeEditor(inv)}
                        className="inline-flex items-center gap-1 rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-body text-xs font-semibold text-ink transition hover:border-forest hover:text-forest"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>{dibatalkan ? "Salin ke Baru" : "Buka / Edit"}</span>
                      </button>

                      {!dibatalkan && inv.paymentStatus !== "lunas" && (
                        <button
                          type="button"
                          onClick={() => void handleTandaiLunas(inv)}
                          className="inline-flex items-center gap-1 rounded-lg border border-forest/25 bg-forest-soft px-2.5 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Tandai Lunas</span>
                        </button>
                      )}

                      <a
                        href={linkWA}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest-soft"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>WA</span>
                      </a>

                      {!dibatalkan && (
                        <button
                          type="button"
                          onClick={() =>
                            setKonfirmasiAksi({ id: inv.id, jenis: "batal" })
                          }
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-body text-xs text-muted transition hover:text-brass"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Batalkan</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setKonfirmasiAksi({ id: inv.id, jenis: "hapus" })
                        }
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
        )}

        {plan === "gratis" && (
          <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-brass/30 bg-brass-soft px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-ink">
              <Sparkles className="h-4 w-4 shrink-0 text-brass" />
              <span>
                Butuh nota tanpa batas bulanan dan tanpa watermark? Lihat rincian{" "}
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
