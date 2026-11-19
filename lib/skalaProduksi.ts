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

export interface RecipeIngredient {
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
}

export interface ProductionRecipeInput {
  name: string;
  yieldUnit: string;
  baseYield: number;
  ingredients: RecipeIngredient[];
  extraCost: number;
  note: string;
}

export interface ProductionRecipeRecord extends ProductionRecipeInput {
  id: string;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const SATUAN_BAHAN_RESEP = [
  "gram",
  "kg",
  "ml",
  "liter",
  "pcs",
  "butir",
  "sdm",
  "sdt",
  "bungkus",
  "lembar",
];

export const SATUAN_HASIL_PRODUKSI = [
  "porsi",
  "cup",
  "pcs",
  "botol",
  "loyang",
  "box",
  "bungkus",
];

export const CONTOH_RESEP_UMKM: ProductionRecipeInput[] = [
  {
    name: "Es Kopi Susu Gula Aren",
    yieldUnit: "cup",
    baseYield: 10,
    ingredients: [
      { nama: "Kopi Espresso / Kopi Hitam Pekat", jumlah: 400, satuan: "ml", hargaSatuan: 45 },
      { nama: "Susu UHT Full Cream", jumlah: 1200, satuan: "ml", hargaSatuan: 20 },
      { nama: "Gula Aren Cair", jumlah: 300, satuan: "ml", hargaSatuan: 35 },
      { nama: "Es Batu Kristal", jumlah: 1500, satuan: "gram", hargaSatuan: 3 },
      { nama: "Cup + Tutup + Sedotan", jumlah: 10, satuan: "pcs", hargaSatuan: 900 },
    ],
    extraCost: 5000,
    note: "Gunakan susu dingin dari kulkas agar rasa lebih creamy.",
  },
  {
    name: "Risol Mayo Frozen",
    yieldUnit: "pcs",
    baseYield: 25,
    ingredients: [
      { nama: "Tepung Terigu Protein Sedang", jumlah: 500, satuan: "gram", hargaSatuan: 14 },
      { nama: "Telur Ayam", jumlah: 3, satuan: "butir", hargaSatuan: 2200 },
      { nama: "Mayones", jumlah: 350, satuan: "gram", hargaSatuan: 42 },
      { nama: "Smoked Beef / Sosis", jumlah: 250, satuan: "gram", hargaSatuan: 95 },
      { nama: "Tepung Panir", jumlah: 300, satuan: "gram", hargaSatuan: 24 },
      { nama: "Minyak & Kemasan Box", jumlah: 5, satuan: "pcs", hargaSatuan: 1800 },
    ],
    extraCost: 12000,
    note: "Isian bisa ditambah telur rebus potong 1/4 per risol.",
  },
  {
    name: "Roti Sobek Cokelat Keju",
    yieldUnit: "loyang",
    baseYield: 4,
    ingredients: [
      { nama: "Tepung Terigu Protein Tinggi", jumlah: 1000, satuan: "gram", hargaSatuan: 16 },
      { nama: "Gula Pasir", jumlah: 180, satuan: "gram", hargaSatuan: 18 },
      { nama: "Ragi Instan", jumlah: 15, satuan: "gram", hargaSatuan: 450 },
      { nama: "Mentega / Margarin", jumlah: 150, satuan: "gram", hargaSatuan: 45 },
      { nama: "Susu Cair UHT", jumlah: 500, satuan: "ml", hargaSatuan: 20 },
      { nama: "Isian Cokelat & Keju", jumlah: 400, satuan: "gram", hargaSatuan: 65 },
    ],
    extraCost: 15000,
    note: "Proofing kedua sekitar 45 menit sebelum masuk oven.",
  },
];

export function formatAngkaTakaran(nilai: number): string {
  if (!isFinite(nilai) || isNaN(nilai) || nilai <= 0) return "0";
  if (Number.isInteger(nilai)) return nilai.toLocaleString("id-ID");
  const dibulatkan = nilai >= 100 ? Math.round(nilai * 10) / 10 : Math.round(nilai * 100) / 100;
  return dibulatkan.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

export function formatKonversiSatuan(jumlah: number, satuan: string): string | null {
  const s = satuan.toLowerCase();
  if (s === "gram" && jumlah >= 1000) {
    return `${formatAngkaTakaran(jumlah / 1000)} kg`;
  }
  if (s === "ml" && jumlah >= 1000) {
    return `${formatAngkaTakaran(jumlah / 1000)} liter`;
  }
  return null;
}

export interface HasilSkalaItem {
  nama: string;
  satuan: string;
  jumlahAwal: number;
  jumlahBaru: number;
  konversiSatuanBaru: string | null;
  hargaSatuan: number;
  biayaAwal: number;
  biayaBaru: number;
}

export interface HasilSkalaProduksi {
  rasio: number;
  baseYield: number;
  targetYield: number;
  items: HasilSkalaItem[];
  totalBiayaBahanAwal: number;
  totalBiayaBahanBaru: number;
  biayaTambahanAwal: number;
  biayaTambahanBaru: number;
  totalBiayaProduksiAwal: number;
  totalBiayaProduksiBaru: number;
  estimasiBiayaPerUnit: number;
}

export function hitungSkalaProduksi(params: {
  baseYield: number;
  targetYield: number;
  ingredients: RecipeIngredient[];
  extraCost: number;
}): HasilSkalaProduksi {
  const baseYield = Math.max(0.01, Number(params.baseYield) || 1);
  const targetYield = Math.max(0, Number(params.targetYield) || 0);
  const rasio = targetYield / baseYield;
  const biayaTambahanAwal = Math.max(0, Number(params.extraCost) || 0);

  const items: HasilSkalaItem[] = params.ingredients.map((b) => {
    const jumlahAwal = Math.max(0, Number(b.jumlah) || 0);
    const hargaSatuan = Math.max(0, Number(b.hargaSatuan) || 0);
    const jumlahBaru = jumlahAwal * rasio;
    const biayaAwal = jumlahAwal * hargaSatuan;
    const biayaBaru = jumlahBaru * hargaSatuan;
    return {
      nama: b.nama.trim(),
      satuan: b.satuan.trim() || "pcs",
      jumlahAwal,
      jumlahBaru,
      konversiSatuanBaru: formatKonversiSatuan(jumlahBaru, b.satuan),
      hargaSatuan,
      biayaAwal,
      biayaBaru,
    };
  });

  const totalBiayaBahanAwal = items.reduce((s, i) => s + i.biayaAwal, 0);
  const totalBiayaBahanBaru = items.reduce((s, i) => s + i.biayaBaru, 0);
  const biayaTambahanBaru = biayaTambahanAwal * rasio;
  const totalBiayaProduksiAwal = totalBiayaBahanAwal + biayaTambahanAwal;
  const totalBiayaProduksiBaru = totalBiayaBahanBaru + biayaTambahanBaru;
  const estimasiBiayaPerUnit =
    targetYield > 0 ? totalBiayaProduksiBaru / targetYield : 0;

  return {
    rasio,
    baseYield,
    targetYield,
    items,
    totalBiayaBahanAwal,
    totalBiayaBahanBaru,
    biayaTambahanAwal,
    biayaTambahanBaru,
    totalBiayaProduksiAwal,
    totalBiayaProduksiBaru,
    estimasiBiayaPerUnit,
  };
}

export function buatTautanWhatsAppBelanjaProduksi(params: {
  namaResep: string;
  yieldUnit: string;
  hasil: HasilSkalaProduksi;
}): string {
  const { namaResep, yieldUnit, hasil } = params;
  const barisBahan = hasil.items
    .filter((i) => i.nama)
    .map((item, idx) => {
      const utama = `${formatAngkaTakaran(item.jumlahBaru)} ${item.satuan}`;
      const konv = item.konversiSatuanBaru ? ` (${item.konversiSatuanBaru})` : "";
      const harga =
        item.biayaBaru > 0 ? ` — ${formatRupiah(item.biayaBaru)}` : "";
      return `${idx + 1}. ${item.nama}: *${utama}*${konv}${harga}`;
    })
    .join("\n");

  const pesan = [
    `*KEBUTUHAN PRODUKSI — ${namaResep || "Resep Usaha"}*`,
    `Target Produksi: *${formatAngkaTakaran(hasil.targetYield)} ${yieldUnit}* (${formatAngkaTakaran(hasil.rasio)}x dari resep awal ${formatAngkaTakaran(hasil.baseYield)} ${yieldUnit})`,
    "------------------------------",
    barisBahan,
    "------------------------------",
    `Biaya Bahan: ${formatRupiah(hasil.totalBiayaBahanBaru)}`,
    hasil.biayaTambahanBaru > 0
      ? `Biaya Tambahan (Gas/Kemasan/Tenaga): ${formatRupiah(hasil.biayaTambahanBaru)}`
      : null,
    `*Total Estimasi Produksi: ${formatRupiah(hasil.totalBiayaProduksiBaru)}*`,
    `Estimasi Modal per ${yieldUnit}: ${formatRupiah(hasil.estimasiBiayaPerUnit)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/?text=${encodeURIComponent(pesan)}`;
}

function sanitasiResepInput(input: ProductionRecipeInput): ProductionRecipeInput {
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new Error("Nama produk atau resep wajib diisi.");
  const yieldUnit = input.yieldUnit.trim().slice(0, 30) || "porsi";
  const baseYield = Math.min(
    1000000,
    Math.max(0.01, Number(input.baseYield) || 0)
  );
  if (baseYield <= 0) {
    throw new Error("Jumlah produksi awal harus lebih dari 0.");
  }

  const ingredients = input.ingredients
    .map((b) => ({
      nama: b.nama.trim().slice(0, 100),
      jumlah: Math.min(1000000, Math.max(0.001, Number(b.jumlah) || 0)),
      satuan: b.satuan.trim().slice(0, 20) || "gram",
      hargaSatuan: Math.min(1000000000, Math.max(0, Number(b.hargaSatuan) || 0)),
    }))
    .filter((b) => b.nama.length > 0 && b.jumlah > 0)
    .slice(0, 40);

  if (ingredients.length === 0) {
    throw new Error("Minimal harus ada 1 bahan dengan nama dan takaran > 0.");
  }

  return {
    name,
    yieldUnit,
    baseYield,
    ingredients,
    extraCost: Math.min(1000000000, Math.max(0, Number(input.extraCost) || 0)),
    note: input.note.trim().slice(0, 240),
  };
}

export async function simpanResepFirestore(
  uid: string,
  input: ProductionRecipeInput
): Promise<string> {
  const clean = sanitasiResepInput(input);
  const ref = doc(collection(db, "productionRecipes"));
  const batch = writeBatch(db);

  batch.set(ref, {
    ownerId: uid,
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
    return ref.id;
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `productionRecipes/${ref.id}`
    );
  }
}

export async function perbaruiResepFirestore(
  recipeId: string,
  input: ProductionRecipeInput
): Promise<void> {
  const clean = sanitasiResepInput(input);
  const path = `productionRecipes/${recipeId}`;
  try {
    await updateDoc(doc(db, "productionRecipes", recipeId), {
      name: clean.name,
      yieldUnit: clean.yieldUnit,
      baseYield: clean.baseYield,
      ingredients: clean.ingredients,
      extraCost: clean.extraCost,
      note: clean.note,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function hapusResepFirestore(recipeId: string): Promise<void> {
  const path = `productionRecipes/${recipeId}`;
  try {
    await deleteDoc(doc(db, "productionRecipes", recipeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

const LOCAL_RESEP_KEY = "cuankit_resep_produksi_tamu_v1";

export function bacaResepLokal(): ProductionRecipeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_RESEP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProductionRecipeRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function simpanResepLokal(recipes: ProductionRecipeRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_RESEP_KEY,
      JSON.stringify(recipes.slice(0, 30))
    );
  } catch {
    // Abaikan kuota penuh
  }
}
