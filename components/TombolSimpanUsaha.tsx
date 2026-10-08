"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { simpanUsahaSaya, type UsahaTersimpan } from "@/lib/usahaSaya";

// Satu cara menyimpan ke Usaha Saya untuk Simulasi, BEP, dan Target Cuan.
export default function TombolSimpanUsaha({
  namaAwal,
  buatEntri,
}: {
  namaAwal: string;
  buatEntri: (nama: string) => UsahaTersimpan;
}) {
  const idNama = useId();
  const [nama, setNama] = useState(namaAwal);
  const [status, setStatus] = useState<{ ok: boolean; pesan: string } | null>(null);

  function simpan() {
    const bersih = nama.trim() || namaAwal;
    const hasil = simpanUsahaSaya(buatEntri(bersih));
    if (hasil === "gagal") {
      setStatus({ ok: false, pesan: "Gagal menyimpan. Browser kamu mungkin memblokir penyimpanan lokal." });
    } else {
      setStatus({
        ok: true,
        pesan: hasil === "baru" ? "Tersimpan di Usaha Saya (hanya di perangkat ini)." : "Data usaha dengan nama ini diperbarui di Usaha Saya.",
      });
    }
  }

  return (
    <div className="mt-6 rounded-md border-2 border-dashed border-ink/20 p-4 print:hidden">
      <label htmlFor={idNama} className="block font-body text-sm font-semibold text-ink">Simpan ke Usaha Saya</label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id={idNama}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama usaha atau produk"
          className="min-w-0 flex-1 rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest"
        />
        <button
          onClick={simpan}
          className="rounded-sm border border-brass bg-brass/10 px-3 py-2 font-body text-xs font-semibold text-ink hover:bg-brass/20"
        >
          Simpan
        </button>
      </div>
      {status && (
        <p role="status" className={`mt-2 font-body text-sm ${status.ok ? "text-forest" : "text-ledger"}`}>
          {status.pesan}{" "}
          {status.ok && (
            <Link href="/usaha-saya" className="font-semibold underline">
              Buka Usaha Saya
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
