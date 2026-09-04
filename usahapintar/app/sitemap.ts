import type { MetadataRoute } from "next";
import { artikelList } from "@/lib/artikel";

const baseUrl = "https://cuankit.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1 },
    { path: "/alat", priority: 0.8 },
    { path: "/artikel", priority: 0.8 },
    { path: "/peta-musiman", priority: 0.7 },
    { path: "/kalkulator-bep", priority: 0.7 },
    { path: "/kalkulator-pinjaman", priority: 0.7 },
    { path: "/kalkulator-gaji", priority: 0.7 },
    { path: "/target-cuan", priority: 0.8 },
    { path: "/simulasi", priority: 0.8 },
    { path: "/template-usaha", priority: 0.9 },
    { path: "/usaha-saya", priority: 0.7 },
    { path: "/tentang", priority: 0.5 },
    { path: "/privasi", priority: 0.3 },
  ].map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: new Date(),
    priority: p.priority,
  }));

  const articlePages = artikelList.map((a) => ({
    url: `${baseUrl}/artikel/${a.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
