import { hitungRingkasan, hitungPinjaman, hitungTargetLaba, formatRupiah } from "../lib/hitung";
import { ringkasanTemplate, databaseUsaha } from "../lib/databaseUsaha";
import { buatStateAwalSimulasi } from "../lib/simulasiAwal";
import { getRekomendasiByJenisUsaha } from "../lib/rekomendasi";
import { ideUsahaList } from "../lib/ideUsaha";
import { getTop3 } from "../lib/matchingUsaha";
import { readFileSync, existsSync } from "fs";
import { bacaUsahaSaya, buatEntriUsaha, simpanUsahaSaya, hrefSimulasi, hrefBEP, hrefTarget, hrefHPP } from "../lib/usahaSaya";

// localStorage tiruan supaya lib/usahaSaya bisa diuji di Node
const gudang: Record<string, string> = {};
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => (k in gudang ? gudang[k] : null),
    setItem: (k: string, v: string) => { gudang[k] = v; },
  },
};
let gagal = 0;
const ok = (nama: string, kondisi: boolean, info?: unknown) => { if (!kondisi) gagal++; console.log(kondisi ? "OK  " : "GAGAL", nama, info ?? ""); };

const e = ringkasanTemplate("es-teh-jumbo")!;
ok("es teh: laba/cup 3000", e.labaPerUnit === 3000);
ok("es teh: BEP bulanan 82", e.bepUnitBulanan === 82, e.bepUnitBulanan);
ok("es teh: laba kotor 1.8jt", e.labaKotorBulanan === 1800000);
ok("es teh: laba bersih 1.555.000", e.labaBersihBulanan === 1555000, e.labaBersihBulanan);
ok("es teh: balik modal 234 unit", e.balikModalUnit === 234, e.balikModalUnit);
ok("format rupiah", formatRupiah(1555000) === "Rp 1.555.000" && formatRupiah(-5000) === "-Rp 5.000", formatRupiah(-5000));
ok("harga <= HPP -> BEP 0", hitungRingkasan({modalAwal:1e6,biayaTetap:1e5,hpp:5000,harga:5000,penjualanHarian:10}).bepUnitBulanan === 0);

// pinjaman: 20jt, 6%, 24 bln
const flat = hitungPinjaman(20_000_000, 6, 24, "flat");
ok("pinjaman flat cicilan 933.333", Math.round(flat.cicilan) === 933333, Math.round(flat.cicilan));
const ef = hitungPinjaman(20_000_000, 6, 24, "efektif");
ok("pinjaman efektif cicilan 886.412 (hitung manual PMT)", Math.abs(ef.cicilan - 886412) < 2, Math.round(ef.cicilan));
ok("pinjaman efektif bunga 0% = pokok/n", Math.round(hitungPinjaman(12e6, 0, 12, "efektif").cicilan) === 1000000);
ok("efektif total bunga < flat", ef.totalBunga < flat.totalBunga);

// state awal simulasi
const a = buatStateAwalSimulasi({ usaha: "es-teh-jumbo" });
ok("simulasi ?usaha=es-teh-jumbo (server)", a.namaUsaha === "Es Teh Jumbo" && a.modalAwal === 700000 && a.hpp === 2000 && a.harga === 5000 && a.biayaTetap === 245000 && a.catatan === null, a);
const b = buatStateAwalSimulasi({});
ok("simulasi tanpa param: judul tidak 'Simulasi Simulasi'", b.namaUsaha === null && b.catatan !== null);
const c = buatStateAwalSimulasi({ hpp: "9000", harga: "15000", biayaTetap: "500000" });
ok("simulasi dari kalkulator HPP", c.hpp === 9000 && c.harga === 15000 && c.biayaTetap === 500000 && c.catatan !== null && c.catatan.includes("overhead"), c.sumberData);
const lama = ideUsahaList.find((i) => !databaseUsaha.some((u) => u.id === i.id))!;
const d = buatStateAwalSimulasi({ usaha: lama.id });
ok("ide non-template diberi peringatan estimasi kasar", d.catatan !== null && d.sumberData === "Estimasi kasar", d.namaUsaha);
ok("param array/ngawur aman", buatStateAwalSimulasi({ usaha: ["x", "y"], hpp: "abc" }).hpp === 8000);

// afiliasi
ok("tautan GANTI-LINK disembunyikan", getRekomendasiByJenisUsaha("kuliner").length === 0);

// template per kategori
const jasa = ideUsahaList.find((i) => i.id === "jasa-desain")!;
ok("jasa desain: langkah & tantangan sesuai kategori", !jasa.langkahAwal[0].includes("menu") && !jasa.tantangan.includes("rasa"), jasa.langkahAwal[0]);
ok("potensiPasar palsu 'Tinggi' dihapus", jasa.potensiPasar === undefined);

// matching: 'belumAda' tidak lagi meloloskan keterampilan wajib
const top = getTop3({ modal: "kecil", waktu: "sampingan", keterampilan: ["belumAda"], sumberDaya: ["tidakAda"], preferensi: ["kerjaMandiri"], pengalaman: "belumPernah", targetLabaBulanan: 2000000 });
ok("matching tetap menghasilkan 3 rekomendasi", top.length === 3, top.map((t) => t.ide.nama));

// target cuan: biaya tetap ikut dihitung, angka bulanan dan harian konsisten
const t0 = hitungTargetLaba(3000000, 0, 15000, 9000);
ok("target cuan tanpa biaya tetap: 500 unit/bulan, 17/hari", t0.unitBulanan === 500 && t0.unitHarian === 17, t0);
ok("target cuan: omzet bulanan = unit bulanan x harga (7.500.000)", t0.omzetBulanan === 7500000 && t0.omzetHarian === 250000, t0);
const t1 = hitungTargetLaba(3000000, 2000000, 15000, 9000);
ok("target cuan dengan biaya tetap 2jt: 834 unit/bulan", t1.unitBulanan === 834 && t1.labaBersihEstimasi >= 3000000, t1);
ok("target cuan: harga <= HPP tidak bisa dihitung", !hitungTargetLaba(3000000, 0, 9000, 9000).bisaHitung && hitungTargetLaba(3000000, 0, 9000, 9000).unitBulanan === 0);

// BEP contoh README: harga 20.000, HPP 12.000, biaya tetap 4.000.000 -> 500 unit
const bep = hitungRingkasan({ modalAwal: 0, biayaTetap: 4000000, hpp: 12000, harga: 20000, penjualanHarian: 20 });
ok("BEP contoh: 500 unit/bulan", bep.bepUnitBulanan === 500, bep.bepUnitBulanan);

// ---- alur antar halaman & Usaha Saya ----
const sim = buatEntriUsaha({ nama: "Kedai Z", hpp: 7000, harga: 12000, penjualan: 20, modalAwal: 700000, biayaTetap: 245000, usahaId: "es-teh-jumbo", jenis: "kuliner" });
ok("simpan baru -> 'baru'", simpanUsahaSaya(sim) === "baru" && bacaUsahaSaya().length === 1);
ok("balik modal tersimpan: 700.000 / 5.000 = 140 unit", bacaUsahaSaya()[0].bep === 140, bacaUsahaSaya()[0].bep);
// Target Cuan menyimpan dengan nama sama, tidak tahu modal -> modal lama dipertahankan, tidak dobel
const targetEntri = buatEntriUsaha({ nama: "Kedai Z", hpp: 7000, harga: 12000, penjualan: 25, targetLaba: 3000000 });
ok("simpan nama sama -> 'diperbarui' tanpa duplikat", simpanUsahaSaya(targetEntri) === "diperbarui" && bacaUsahaSaya().length === 1);
const gabung = bacaUsahaSaya()[0];
ok("modal & biaya tetap lama dipertahankan", gabung.modalAwal === 700000 && gabung.biayaTetap === 245000, gabung);
ok("target baru menimpa, usahaId tetap", gabung.targetPenjualan === 25 && gabung.targetLaba === 3000000 && gabung.usahaId === "es-teh-jumbo", gabung);
ok("balik modal dihitung ulang dari data gabungan", gabung.bep === 140, gabung.bep);
ok("nama berbeda -> entri kedua", simpanUsahaSaya(buatEntriUsaha({ nama: "Produk B", hpp: 5000, harga: 9000, penjualan: 10, modalAwal: 0 })) === "baru" && bacaUsahaSaya().length === 2);
ok("harga <= HPP -> balik modal 0", buatEntriUsaha({ nama: "X", hpp: 9000, harga: 9000, penjualan: 5, modalAwal: 1e6 }).bep === 0);

const link = hrefSimulasi({ nama: "Kedai Z & Co", hpp: 7000, harga: 12000, biayaTetap: 245000, modalAwal: 0, penjualan: 20 }, "bep");
ok("tautan Simulasi membawa angka, nama di-encode, nol dibuang", link.startsWith("/simulasi?dari=bep") && link.includes("nama=Kedai%20Z%20%26%20Co") && link.includes("hpp=7000") && link.includes("biayaTetap=245000") && !link.includes("modalAwal"), link);
ok("tautan BEP & Target membawa angka", hrefBEP({ hpp: 7000, harga: 12000, biayaTetap: 245000 }).includes("biayaTetap=245000") && hrefTarget({ hpp: 7000, harga: 12000 }).startsWith("/target-cuan?hpp=7000&harga=12000"));
ok("tautan HPP: template > jenis > polos", hrefHPP({ usahaId: "es-teh-jumbo" }).includes("usaha=es-teh-jumbo") && hrefHPP({ jenis: "kuliner" }).includes("jenis=kuliner") && hrefHPP({}) === "/kalkulator-hpp#kalkulator");

const dariBep = buatStateAwalSimulasi({ dari: "bep", nama: "Kedai Z", hpp: "7000", harga: "12000", biayaTetap: "1000000", penjualan: "15" });
ok("Simulasi dari BEP: angka, nama, tanpa catatan overhead", dariBep.sumberData === "Dari Kalkulator BEP" && dariBep.namaUsaha === "Kedai Z" && dariBep.catatan === null && dariBep.biayaTetap === 1000000 && dariBep.hpp === 7000 && dariBep.penjualan === 15, dariBep);
ok("Simulasi dari Usaha Saya & Target Cuan dikenali", buatStateAwalSimulasi({ dari: "usaha-saya", hpp: "1", harga: "2" }).sumberData === "Dari Usaha Saya" && buatStateAwalSimulasi({ dari: "target", hpp: "1", harga: "2" }).sumberData === "Dari Target Cuan");
ok("Simulasi dari HPP (tanpa 'dari') tetap memberi catatan overhead", (buatStateAwalSimulasi({ hpp: "7000", harga: "12000" }).catatan ?? "").includes("overhead"));

// ---- PWA: manifest, ikon, service worker ----
function ukuranPNG(path: string): [number, number] | null {
  if (!existsSync(path)) return null;
  const b = readFileSync(path);
  return b.readUInt32BE(1) === 0x504e47 || b.slice(1, 4).toString() === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null;
}
const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf-8"));
ok("manifest: nama, start_url, display standalone", !!manifest.name && !!manifest.short_name && manifest.start_url.startsWith("/") && manifest.display === "standalone", manifest.display);
const ikon: { src: string; sizes: string; purpose: string }[] = manifest.icons;
const semuaIkonSesuai = ikon.every((i) => { const u = ukuranPNG("public" + i.src); return !!u && i.sizes === `${u[0]}x${u[1]}`; });
ok("manifest: semua ikon ada dan ukurannya sama dengan yang ditulis", semuaIkonSesuai, ikon.map((i) => i.src));
ok("manifest: ada ikon 192, 512, dan maskable", ikon.some((i) => i.sizes === "192x192") && ikon.some((i) => i.sizes === "512x512" && i.purpose === "any") && ikon.some((i) => i.purpose === "maskable"));
ok("ikon layar utama iOS 180x180", JSON.stringify(ukuranPNG("public/apple-touch-icon.png")) === "[180,180]");
ok("service worker punya handler fetch + halaman offline ada", readFileSync("public/sw.js", "utf-8").includes('addEventListener("fetch"') && existsSync("public/offline.html"));
ok("shortcut manifest menuju halaman yang ada", manifest.shortcuts.every((x: { url: string }) => existsSync("app" + x.url.split("#")[0].replace(/\/$/, "") + "/page.tsx")), manifest.shortcuts.map((x: { url: string }) => x.url));
console.log(gagal === 0 ? "\nSEMUA TES LULUS" : `\n${gagal} TES GAGAL`);
process.exit(gagal ? 1 : 0);
