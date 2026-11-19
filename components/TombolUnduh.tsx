"use client";

import { useState } from "react";
import { FileText, ImageDown } from "lucide-react";
import { unduhSebagaiGambar, unduhSebagaiPDF } from "@/lib/exportHasil";

export default function TombolUnduh({
  elementId,
  namaFile,
}: {
  elementId: string;
  namaFile: string;
}) {
  const [loading, setLoading] = useState<"pdf" | "gambar" | null>(null);
  const [gagal, setGagal] = useState(false);

  async function jalankan(
    jenis: "pdf" | "gambar",
    unduh: (id: string, nama: string) => Promise<void>
  ) {
    setGagal(false);
    setLoading(jenis);
    try {
      await unduh(elementId, namaFile);
    } catch (e) {
      console.error(e);
      setGagal(true);
    } finally {
      setLoading(null);
    }
  }

  const handlePDF = () => jalankan("pdf", unduhSebagaiPDF);
  const handleGambar = () => jalankan("gambar", unduhSebagaiGambar);

  return (
    <div className="mt-4 flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={handlePDF}
        disabled={loading !== null}
        className="flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-forest hover:bg-forest hover:text-white disabled:opacity-50"
      >
        <FileText className="h-4 w-4" />
        <span>{loading === "pdf" ? "Menyiapkan..." : "Unduh PDF"}</span>
      </button>

      <button
        type="button"
        onClick={handleGambar}
        disabled={loading !== null}
        className="flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-forest hover:bg-forest hover:text-white disabled:opacity-50"
      >
        <ImageDown className="h-4 w-4" />
        <span>{loading === "gambar" ? "Menyiapkan..." : "Unduh Gambar"}</span>
      </button>

      {gagal && (
        <p role="alert" className="w-full font-body text-xs text-ledger">
          Gagal membuat file. Coba lagi, atau ambil tangkapan layar halaman ini.
        </p>
      )}
    </div>
  );
}
