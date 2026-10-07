import type { Metadata } from "next";

// Next.js tidak menurunkan og:title / og:description dari title / description halaman.
// Tanpa ini, setiap link yang dibagikan (WhatsApp, Facebook, X) tampil dengan judul beranda.
// Fungsi ini mengisinya dari metadata halaman itu sendiri, lengkap dengan gambar pratinjau.
export function denganOG(m: Metadata, tipe: "website" | "article" = "website"): Metadata {
  const judul = typeof m.title === "string" ? `${m.title} | CuanKit` : undefined;
  const deskripsi = m.description ?? undefined;
  const url = typeof m.alternates?.canonical === "string" ? m.alternates.canonical : undefined;
  const alt = "CuanKit: dari ide usaha sampai angka yang masuk akal. Hitung modal, HPP, BEP, dan target cuan.";
  return {
    ...m,
    openGraph: {
      type: tipe,
      siteName: "CuanKit",
      locale: "id_ID",
      title: judul,
      description: deskripsi,
      url,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: judul,
      description: deskripsi,
      images: [{ url: "/twitter-image.png", width: 1200, height: 630, alt }],
    },
  };
}
