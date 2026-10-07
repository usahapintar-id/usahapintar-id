"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EMAIL_KONTAK } from "@/lib/situs";

export default function HalamanError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Terjadi kesalahan</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Halaman ini gagal dimuat</h1>
        <p className="mt-3 font-body text-sm text-muted">
          Ada masalah di sisi kami. Data yang sudah kamu simpan di Usaha Saya tetap aman di perangkat ini. Coba muat ulang halamannya.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={reset} className="rounded-sm bg-forest px-4 py-2.5 font-body text-sm font-semibold text-paper hover:bg-forest-dark">
            Coba lagi
          </button>
          <Link href="/" className="rounded-sm border border-ink/20 px-4 py-2.5 font-body text-sm font-semibold text-ink hover:border-forest hover:text-forest">
            Ke Beranda
          </Link>
        </div>
        <p className="mt-6 font-body text-xs text-muted">
          Kalau masalahnya terus muncul, kabari kami di{" "}
          <a href={`mailto:${EMAIL_KONTAK}`} className="font-semibold text-forest underline">
            {EMAIL_KONTAK}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
