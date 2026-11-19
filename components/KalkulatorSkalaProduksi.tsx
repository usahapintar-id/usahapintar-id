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
  ArrowRight,
  BookmarkCheck,
  Calculator,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
  Trash2,
} from "lucide-react";
import AuthAkunPanel from "@/components/AuthAkunPanel";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import TombolUnduh from "@/components/TombolUnduh";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { angkaNonNegatif, formatRupiah } from "@/lib/hitung";
import { tanggalHariIniISO } from "@/lib/paket";
import {
  bacaResepLokal,
  buatTautanWhatsAppBelanjaProduksi,
  CONTOH_RESEP_UMKM,
  formatAngkaTakaran,
  hapusResepFirestore,
  hitungSkalaProduksi,
  perbaruiResepFirestore,
  SATUAN_BAHAN_RESEP,
  SATUAN_HASIL_PRODUKSI,
  simpanResepFirestore,
  simpanResepLokal,
  type ProductionRecipeInput,
  type ProductionRecipeRecord,
  type RecipeIngredient,
} from "@/lib/skalaProduksi";

const PENGALI_CEPAT = [0.5, 2, 3, 5, 10];

export default function KalkulatorSkalaProduksi() {
  const { user, authReady } = useFirebaseAuth();

  // Resep tersimpan (Cloud atau Lokal)
  const [recipesCloud, setRecipesCloud] = useState<ProductionRecipeRecord[]>([]);
  const [recipesTamu, setRecipesTamu] = useState<ProductionRecipeRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // State Kalkulator Aktif (mulai dari contoh 1 agar langsung interaktif)
  const [namaResep, setNamaResep] = useState<string>(CONTOH_RESEP_UMKM[0].name);
  const [yieldUnit, setYieldUnit] = useState<string>(CONTOH_RESEP_UMKM[0].yieldUnit);
  const [baseYield, setBaseYield] = useState<number>(CONTOH_RESEP_UMKM[0].baseYield);
  const [targetYield, setTargetYield] = useState<number>(
    CONTOH_RESEP_UMKM[0].baseYield * 3
  );
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    CONTOH_RESEP_UMKM[0].ingredients
  );
  const [extraCost, setExtraCost] = useState<number>(
    CONTOH_RESEP_UMKM[0].extraCost
  );
  const [note, setNote] = useState<string>(CONTOH_RESEP_UMKM[0].note);

  const [hapusKonfirmasiId, setHapusKonfirmasiId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  useEffect(() => {
    setRecipesTamu(bacaResepLokal());
  }, []);

  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setRecipesCloud([]);
      return;
    }

    const q = query(
      collection(db, "productionRecipes"),
      where("ownerId", "==", user.uid),
      limit(100)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ProductionRecipeRecord, "id">),
        }));
        rows.sort((a, b) => a.name.localeCompare(b.name, "id"));
        setRecipesCloud(rows);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "productionRecipes");
      }
    );

    return () => unsub();
  }, [authReady, user]);

  const recipesAktif = user ? recipesCloud : recipesTamu;

  const hasil = useMemo(
    () =>
      hitungSkalaProduksi({
        baseYield,
        targetYield,
        ingredients,
        extraCost,
      }),
    [baseYield, targetYield, ingredients, extraCost]
  );

  function muatResepKeEditor(
    resep: ProductionRecipeInput,
    idResep: string | null = null
  ) {
    setEditingId(idResep);
    setNamaResep(resep.name);
    setYieldUnit(resep.yieldUnit);
    setBaseYield(resep.baseYield);
    setTargetYield(resep.baseYield * 2);
    setIngredients(resep.ingredients.map((b) => ({ ...b })));
    setExtraCost(resep.extraCost);
    setNote(resep.note);
    setFeedback(null);
  }

  function resetKosong() {
    setEditingId(null);
    setNamaResep("");
    setYieldUnit("porsi");
    setBaseYield(10);
    setTargetYield(20);
    setIngredients([{ nama: "", jumlah: 100, satuan: "gram", hargaSatuan: 0 }]);
    setExtraCost(0);
    setNote("");
    setFeedback(null);
  }

  function tambahBarisBahan() {
    if (ingredients.length >= 40) return;
    setIngredients((prev) => [
      ...prev,
      { nama: "", jumlah: 100, satuan: "gram", hargaSatuan: 0 },
    ]);
  }

  function ubahBarisBahan(
    idx: number,
    patch: Partial<RecipeIngredient>
  ) {
    setIngredients((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );
  }

  function hapusBarisBahan(idx: number) {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSimpanResep(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const payload: ProductionRecipeInput = {
      name: namaResep,
      yieldUnit,
      baseYield,
      ingredients,
      extraCost,
      note,
    };

    if (!payload.name.trim()) {
      setFeedback({
        tipe: "error",
        teks: "Isi nama produk atau resep terlebih dahulu sebelum menyimpan.",
      });
      return;
    }

    const bahanValid = payload.ingredients.filter(
      (b) => b.nama.trim().length > 0 && b.jumlah > 0
    );
    if (bahanValid.length === 0) {
      setFeedback({
        tipe: "error",
        teks: "Minimal isi 1 bahan baku dengan nama dan takaran lebih dari 0.",
      });
      return;
    }

    if (!user) {
      if (editingId) {
        const updated = recipesTamu.map((r) =>
          r.id === editingId ? { ...r, ...payload, ingredients: bahanValid } : r
        );
        setRecipesTamu(updated);
        simpanResepLokal(updated);
        setFeedback({
          tipe: "sukses",
          teks: `Resep "${payload.name.trim()}" diperbarui di perangkat ini.`,
        });
      } else {
        const baru: ProductionRecipeRecord = {
          id: `lokal-${Date.now()}`,
          ownerId: "tamu",
          ...payload,
          name: payload.name.trim(),
          ingredients: bahanValid,
        };
        const updated = [baru, ...recipesTamu];
        setRecipesTamu(updated);
        simpanResepLokal(updated);
        setEditingId(baru.id);
        setFeedback({
          tipe: "sukses",
          teks: "Resep disimpan di browser ini. Masuk akun Google untuk sinkronisasi antarperangkat.",
        });
      }
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await perbaruiResepFirestore(editingId, {
          ...payload,
          ingredients: bahanValid,
        });
        setFeedback({
          tipe: "sukses",
          teks: `Resep "${payload.name.trim()}" berhasil diperbarui di akun Anda.`,
        });
      } else {
        const idBaru = await simpanResepFirestore(user.uid, {
          ...payload,
          ingredients: bahanValid,
        });
        setEditingId(idBaru);
        setFeedback({
          tipe: "sukses",
          teks: `Resep "${payload.name.trim()}" tersimpan di akun Anda dan siap dipakai kapan saja.`,
        });
      }
    } catch (err) {
      setFeedback({
        tipe: "error",
        teks:
          err instanceof Error ? err.message : "Gagal menyimpan resep produksi.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function konfirmasiHapusResep(id: string) {
    setHapusKonfirmasiId(null);
    if (!user) {
      const updated = recipesTamu.filter((r) => r.id !== id);
      setRecipesTamu(updated);
      simpanResepLokal(updated);
      if (editingId === id) setEditingId(null);
      return;
    }

    try {
      await hapusResepFirestore(id);
      if (editingId === id) setEditingId(null);
      setFeedback({ tipe: "sukses", teks: "Resep dihapus." });
    } catch {
      setFeedback({ tipe: "error", teks: "Gagal menghapus resep." });
    }
  }

  const tautanWA = buatTautanWhatsAppBelanjaProduksi({
    namaResep,
    yieldUnit,
    hasil,
  });

  return (
    <div className="space-y-8">
      <AuthAkunPanel ringkas />

      {/* Pilihan Contoh Resep Cepat */}
      <div className="rounded-2xl border border-ink/10 bg-surface p-4 sm:p-5 shadow-card">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-forest">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Contoh Resep UMKM Siap Hitung:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CONTOH_RESEP_UMKM.map((contoh) => (
              <button
                key={contoh.name}
                type="button"
                onClick={() => muatResepKeEditor(contoh, null)}
                className="rounded-xl border border-ink/15 bg-paper px-3 py-1.5 font-body text-xs font-medium text-ink transition hover:border-forest hover:bg-forest-soft hover:text-forest"
              >
                {contoh.name}
              </button>
            ))}
            <button
              type="button"
              onClick={resetKosong}
              className="inline-flex items-center gap-1 rounded-xl border border-ink/15 bg-paper px-3 py-1.5 font-body text-xs font-medium text-muted transition hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Resep Kosong</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workspace 2 Kolom */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Kolom Kiri: Resep Awal & Komposisi Bahan */}
        <form
          onSubmit={handleSimpanResep}
          className="space-y-5 rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card lg:col-span-6"
        >
          <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                1. Komposisi Resep &amp; Target Produksi
              </h2>
              <p className="font-body text-xs text-muted">
                Masukkan takaran resep dasar lalu tentukan target produksi baru.
              </p>
            </div>
            {editingId && (
              <span className="font-mono text-[11px] font-semibold text-forest">
                Mode Edit
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="skala-nama-resep"
                className="block font-body text-xs font-semibold text-ink"
              >
                Nama Produk / Resep *
              </label>
              <input
                id="skala-nama-resep"
                type="text"
                required
                maxLength={120}
                value={namaResep}
                onChange={(e) => setNamaResep(e.target.value)}
                placeholder="Misal: Es Kopi Susu Gula Aren"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="skala-satuan-hasil"
                className="block font-body text-xs font-semibold text-ink"
              >
                Satuan Hasil *
              </label>
              <select
                id="skala-satuan-hasil"
                value={yieldUnit}
                onChange={(e) => setYieldUnit(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
              >
                {SATUAN_HASIL_PRODUKSI.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jumlah Produksi Awal vs Target Baru */}
          <div className="rounded-xl border border-forest/20 bg-forest-soft/50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="skala-awal"
                  className="block font-body text-xs font-semibold text-ink"
                >
                  Produksi Awal ({yieldUnit}) *
                </label>
                <input
                  id="skala-awal"
                  type="number"
                  min={0.1}
                  step="any"
                  required
                  value={baseYield || ""}
                  onChange={(e) =>
                    setBaseYield(Math.max(0.1, angkaNonNegatif(e.target.value)))
                  }
                  className="mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-3.5 py-2.5 font-mono text-base font-bold tabular-nums text-ink focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="skala-target"
                  className="block font-body text-xs font-semibold text-forest"
                >
                  Target Produksi Baru ({yieldUnit}) *
                </label>
                <input
                  id="skala-target"
                  type="number"
                  min={0}
                  step="any"
                  required
                  value={targetYield || ""}
                  onChange={(e) =>
                    setTargetYield(angkaNonNegatif(e.target.value))
                  }
                  className="mt-1.5 w-full rounded-xl border border-forest/40 bg-surface px-3.5 py-2.5 font-mono text-base font-bold tabular-nums text-forest focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-body text-[11px] font-medium text-muted mr-1">
                Kalikan cepat:
              </span>
              {PENGALI_CEPAT.map((kali) => (
                <button
                  key={kali}
                  type="button"
                  onClick={() =>
                    setTargetYield(Math.round(baseYield * kali * 100) / 100)
                  }
                  className="rounded-lg border border-forest/25 bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                >
                  {kali}x
                </button>
              ))}
            </div>
          </div>

          {/* Daftar Komposisi Bahan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-body text-xs font-semibold text-ink">
                Komposisi Bahan (untuk {formatAngkaTakaran(baseYield)}{" "}
                {yieldUnit} awal)
              </p>
              <button
                type="button"
                onClick={tambahBarisBahan}
                className="inline-flex items-center gap-1 rounded-lg bg-forest-soft px-2.5 py-1.5 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Bahan</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((bahan, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-ink/10 bg-paper/70 p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label
                        htmlFor={`bahan-nama-${idx}`}
                        className="sr-only"
                      >
                        Nama bahan {idx + 1}
                      </label>
                      <input
                        id={`bahan-nama-${idx}`}
                        type="text"
                        required
                        maxLength={100}
                        value={bahan.nama}
                        onChange={(e) =>
                          ubahBarisBahan(idx, { nama: e.target.value })
                        }
                        placeholder={`Nama bahan #${idx + 1} (misal: Tepung Terigu)`}
                        className="w-full rounded-lg border border-ink/15 bg-surface px-3 py-2 font-body text-xs text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => hapusBarisBahan(idx)}
                        aria-label={`Hapus bahan ${idx + 1}`}
                        className="rounded-lg p-1.5 text-muted transition hover:text-ledger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label
                        htmlFor={`bahan-jml-${idx}`}
                        className="block font-body text-[11px] text-muted"
                      >
                        Takaran Awal
                      </label>
                      <input
                        id={`bahan-jml-${idx}`}
                        type="number"
                        min={0.01}
                        step="any"
                        required
                        value={bahan.jumlah || ""}
                        onChange={(e) =>
                          ubahBarisBahan(idx, {
                            jumlah: angkaNonNegatif(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-mono text-xs tabular-nums text-ink focus:border-forest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`bahan-satuan-${idx}`}
                        className="block font-body text-[11px] text-muted"
                      >
                        Satuan
                      </label>
                      <select
                        id={`bahan-satuan-${idx}`}
                        value={bahan.satuan}
                        onChange={(e) =>
                          ubahBarisBahan(idx, { satuan: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-2 py-1.5 font-body text-xs text-ink focus:border-forest focus:outline-none"
                      >
                        {SATUAN_BAHAN_RESEP.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`bahan-harga-${idx}`}
                        className="block font-body text-[11px] text-muted"
                      >
                        Harga / {bahan.satuan}
                      </label>
                      <input
                        id={`bahan-harga-${idx}`}
                        type="number"
                        min={0}
                        step="any"
                        value={bahan.hargaSatuan || ""}
                        onChange={(e) =>
                          ubahBarisBahan(idx, {
                            hargaSatuan: angkaNonNegatif(e.target.value),
                          })
                        }
                        placeholder="Rp 0"
                        className="mt-1 w-full rounded-lg border border-ink/15 bg-surface px-2.5 py-1.5 font-mono text-xs tabular-nums text-ink focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="skala-biaya-tambahan"
                className="block font-body text-xs font-semibold text-ink"
              >
                Biaya Gas/Kemasan/Tenaga (Batch Awal, Rp)
              </label>
              <input
                id="skala-biaya-tambahan"
                type="number"
                min={0}
                value={extraCost || ""}
                onChange={(e) => setExtraCost(angkaNonNegatif(e.target.value))}
                placeholder="0"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-mono text-sm tabular-nums text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="skala-catatan"
                className="block font-body text-xs font-semibold text-ink"
              >
                Catatan Resep (opsional)
              </label>
              <input
                id="skala-catatan"
                type="text"
                maxLength={240}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tips suhu, lama masak, dll."
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
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
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>
              {saving
                ? "Menyimpan..."
                : editingId
                ? "Perbarui Resep Tersimpan"
                : "Simpan Resep Produksi"}
            </span>
          </button>
        </form>

        {/* Kolom Kanan: Hasil Perhitungan Skala & Daftar Resep Tersimpan */}
        <div className="space-y-6 lg:col-span-6">
          <div
            id="hasil-skala-produksi"
            className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-4">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-forest">
                  Hasil Konversi Takaran &amp; Biaya
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  {namaResep.trim() || "Resep Produksi"}
                </h2>
                <p className="mt-0.5 font-body text-xs text-muted">
                  Skala{" "}
                  <strong className="font-mono text-ink">
                    {formatAngkaTakaran(hasil.baseYield)} {yieldUnit}
                  </strong>{" "}
                  →{" "}
                  <strong className="font-mono text-forest">
                    {formatAngkaTakaran(hasil.targetYield)} {yieldUnit}
                  </strong>{" "}
                  ({formatAngkaTakaran(hasil.rasio)}x lipat)
                </p>
              </div>
              <div className="rounded-xl bg-forest-soft px-3.5 py-2 text-right">
                <p className="font-body text-[11px] font-medium text-forest">
                  Faktor Pengali
                </p>
                <p className="font-mono text-lg font-bold tabular-nums text-forest">
                  {formatAngkaTakaran(hasil.rasio)}x
                </p>
              </div>
            </div>

            {/* Tabel Takaran Baru */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-ink/10 text-muted">
                    <th className="py-2 pr-2 font-semibold">Bahan</th>
                    <th className="py-2 px-2 text-right font-semibold">Awal</th>
                    <th className="py-2 px-2 text-right font-semibold text-forest">
                      Kebutuhan Baru
                    </th>
                    <th className="py-2 pl-2 text-right font-semibold">
                      Est. Biaya
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {hasil.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 pr-2 font-medium text-ink">
                        {item.nama || `Bahan #${idx + 1}`}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-muted">
                        {formatAngkaTakaran(item.jumlahAwal)} {item.satuan}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className="font-mono font-bold tabular-nums text-forest">
                          {formatAngkaTakaran(item.jumlahBaru)} {item.satuan}
                        </span>
                        {item.konversiSatuanBaru && (
                          <span className="block font-mono text-[10px] text-muted">
                            ≈ {item.konversiSatuanBaru}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pl-2 text-right font-mono tabular-nums text-ink">
                        {item.biayaBaru > 0
                          ? formatRupiah(item.biayaBaru)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ringkasan Biaya Produksi */}
            <div className="mt-5 grid gap-3 rounded-xl border border-ink/10 bg-paper/80 p-4 sm:grid-cols-2">
              <div>
                <p className="font-body text-xs text-muted">
                  Total Biaya Bahan Baku Baru
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-ink">
                  {formatRupiah(hasil.totalBiayaBahanBaru)}
                </p>
                {hasil.biayaTambahanBaru > 0 && (
                  <p className="mt-0.5 font-body text-[11px] text-muted">
                    + Gas/Kemasan/Tenaga: {formatRupiah(hasil.biayaTambahanBaru)}
                  </p>
                )}
              </div>

              <div className="sm:text-right">
                <p className="font-body text-xs font-semibold text-forest">
                  Estimasi Total Modal Produksi
                </p>
                <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-forest">
                  {formatRupiah(hasil.totalBiayaProduksiBaru)}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  ≈ {formatRupiah(hasil.estimasiBiayaPerUnit)} / {yieldUnit}
                </p>
              </div>
            </div>

            {note.trim() && (
              <p className="mt-3 rounded-lg border border-ink/10 bg-paperDark/40 px-3 py-2 font-body text-xs text-muted">
                <strong className="text-ink">Catatan:</strong> {note}
              </p>
            )}
          </div>

          {/* Aksi Bagikan, Unduh & Lanjut HPP */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card space-y-4 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={tautanWA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-forest-light"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Kirim Daftar Belanja ke WA</span>
              </a>

              <Link
                href="/kalkulator-hpp#kalkulator"
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-xs font-semibold text-ink transition hover:border-forest hover:text-forest"
              >
                <Calculator className="h-3.5 w-3.5 text-forest" />
                <span>Hitung Harga Jual di Kalkulator HPP</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <TombolUnduh
              elementId="hasil-skala-produksi"
              namaFile={`Skala-Produksi-${tanggalHariIniISO()}`}
            />
          </div>

          {/* Daftar Resep Tersimpan */}
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-6 shadow-card print:hidden">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-forest" />
                <h2 className="font-display text-base font-semibold text-ink">
                  Resep Tersimpan ({recipesAktif.length})
                </h2>
              </div>
              <Scale className="h-4 w-4 text-muted" />
            </div>

            {recipesAktif.length === 0 ? (
              <p className="py-6 text-center font-body text-xs text-muted">
                Belum ada resep yang disimpan. Klik &ldquo;Simpan Resep Produksi&rdquo; di formulir sebelah kiri agar bisa langsung dipakai ulang kapan saja.
              </p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {recipesAktif.map((r) => {
                  const sedangKonfirmasi = hapusKonfirmasiId === r.id;
                  return (
                    <div
                      key={r.id}
                      className="rounded-xl border border-ink/10 bg-paper/70 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-sm font-semibold text-ink">
                            {r.name}
                          </h3>
                          <p className="mt-0.5 font-mono text-[11px] text-muted">
                            Resep dasar {formatAngkaTakaran(r.baseYield)}{" "}
                            {r.yieldUnit} · {r.ingredients.length} bahan
                          </p>
                        </div>

                        {sedangKonfirmasi ? (
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => void konfirmasiHapusResep(r.id)}
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
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => muatResepKeEditor(r, r.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-forest/25 bg-forest-soft px-2.5 py-1 font-body text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                            >
                              <Pencil className="h-3 w-3" />
                              <span>Pakai / Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setHapusKonfirmasiId(r.id)}
                              aria-label={`Hapus resep ${r.name}`}
                              className="rounded-lg p-1 text-muted transition hover:text-ledger"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
