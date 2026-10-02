"use client";

import { useState } from "react";
import { unduhSebagaiGambar, unduhSebagaiPDF } from "@/lib/exportHasil";

export default function TombolUnduh({
  elementId,
  namaFile,
}: {
  elementId: string;
  namaFile: string;
}) {
  const [loading, setLoading] = useState<"pdf" | "gambar" | null>(null);

  async function handlePDF() {
    setLoading("pdf");
    try {
      await unduhSebagaiPDF(elementId, namaFile);
    } finally {
      setLoading(null);
    }
  }

  async function handleGambar() {
    setLoading("gambar");
    try {
      await unduhSebagaiGambar(elementId, namaFile);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 print:hidden">
      <button
        onClick={handlePDF}
        disabled={loading !== null}
        className="flex items-center gap-2 rounded-sm border-2 border-ink bg-paper px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-forest hover:text-paper disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        {loading === "pdf" ? "Menyiapkan..." : "Unduh PDF"}
      </button>

      <button
        onClick={handleGambar}
        disabled={loading !== null}
        className="flex items-center gap-2 rounded-sm border-2 border-ink bg-paper px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-forest hover:text-paper disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        {loading === "gambar" ? "Menyiapkan..." : "Unduh Gambar"}
      </button>
    </div>
  );
}
