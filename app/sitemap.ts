import type { MetadataRoute } from "next";
import { artikelList } from "@/lib/artikel";

const baseUrl = "https://www.cuankit.id";
// Tanggal tetap (bukan new Date()) supaya lastModified tidak berubah di setiap build.
// Perbarui saat konten benar-benar berubah.
const TERAKHIR_DIPERBARUI = new Date("2026-08-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1 },
    { path: "/analisis-usaha", priority: 0.9 },
    { path: "/alat", priority: 0.8 },
    { path: "/kalkulator-hpp", priority: 0.9 },
    { path: "/artikel", priority: 0.8 },
    { path: "/peta-musiman", priority: 0.7 },
    { path: "/kalkulator-bep", priority: 0.7 },
    { path: "/kalkulator-pinjaman", priority: 0.7 },
    { path: "/kalkulator-gaji", priority: 0.7 },
    { path: "/target-cuan", priority: 0.8 },
    { path: "/simulasi", priority: 0.8 },
    { path: "/template-usaha", priority: 0.9 },
    { path: "/usaha-saya", priority: 0.6 },
    { path: "/tentang", priority: 0.5 },
    { path: "/privasi", priority: 0.3 },
  ].map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: TERAKHIR_DIPERBARUI,
    priority: p.priority,
  }));

  const articlePages = artikelList.map((a) => ({
    url: `${baseUrl}/artikel/${a.slug}`,
    lastModified: TERAKHIR_DIPERBARUI,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
