"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { bacaJSON, simpanJSON } from "@/lib/storage";

// Mendaftarkan service worker dan menampilkan ajakan "Pasang CuanKit":
// - Android/Chrome/Edge: tombol Pasang yang membuka dialog pemasangan bawaan browser.
// - iPhone/iPad: petunjuk "Tambahkan ke Layar Utama" (iOS tidak punya dialog pemasangan).
// Ajakan muncul sekali, bisa ditutup, dan baru muncul lagi setelah 14 hari.

type EventPasang = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type Mode = "install" | "ios";
type Status = { tutupSampai?: number; terpasang?: boolean };

const KUNCI = "cuankit_ajak_pasang";
const JEDA_TAMPIL_MS = 10_000;
const JEDA_ULANG_MS = 14 * 24 * 60 * 60 * 1000;

function sudahDibukaSebagaiAplikasi(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function perangkatIOS(): boolean {
  const ua = window.navigator.userAgent;
  const iPadModern = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/i.test(ua) || iPadModern;
}

export default function PasangAplikasi() {
  const [mode, setMode] = useState<Mode | null>(null);
  const tertunda = useRef<EventPasang | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const status = bacaJSON<Status>(KUNCI, {});
    if (sudahDibukaSebagaiAplikasi() || status.terpasang || (status.tutupSampai ?? 0) > Date.now()) return;

    let timer: number | undefined;
    const jadwalkan = (m: Mode) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMode(m), JEDA_TAMPIL_MS);
    };
    const saatBisaDipasang = (e: Event) => {
      e.preventDefault(); // kita tampilkan ajakan sendiri, bukan mini-infobar bawaan
      tertunda.current = e as EventPasang;
      jadwalkan("install");
    };
    const saatTerpasang = () => {
      simpanJSON(KUNCI, { terpasang: true });
      tertunda.current = null;
      setMode(null);
    };

    window.addEventListener("beforeinstallprompt", saatBisaDipasang);
    window.addEventListener("appinstalled", saatTerpasang);
    if (perangkatIOS()) jadwalkan("ios");

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", saatBisaDipasang);
      window.removeEventListener("appinstalled", saatTerpasang);
    };
  }, []);

  function tutup() {
    simpanJSON(KUNCI, { tutupSampai: Date.now() + JEDA_ULANG_MS });
    setMode(null);
  }

  async function pasang() {
    const e = tertunda.current;
    if (!e) return;
    try {
      await e.prompt();
      const pilihan = await e.userChoice;
      tertunda.current = null;
      if (pilihan.outcome === "accepted") {
        simpanJSON(KUNCI, { terpasang: true });
        setMode(null);
      } else {
        tutup();
      }
    } catch {
      tutup();
    }
  }

  if (!mode) return null;

  return (
    <div
      role="region"
      aria-label="Pasang CuanKit"
      className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md rounded-2xl border border-ink/10 bg-surface p-4 shadow-stamp-lg md:bottom-4 print:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-start gap-3">
        <Image src="/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-ink">Pasang CuanKit di perangkatmu</p>
          {mode === "install" ? (
            <p className="mt-1 font-body text-xs text-muted">
              Buka lebih cepat dari layar utama dan tampil layar penuh seperti aplikasi, tanpa perlu mengunduh dari toko aplikasi.
            </p>
          ) : (
            <p className="mt-1 font-body text-xs text-muted">
              Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas), lalu pilih <b>Tambahkan ke Layar Utama</b>.
            </p>
          )}
        </div>
        <button
          onClick={tutup}
          aria-label="Tutup"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-paperDark hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        {mode === "install" ? (
          <>
            <button
              onClick={pasang}
              className="rounded-xl bg-forest px-4 py-2 font-body text-xs font-semibold text-white transition hover:bg-forest-light"
            >
              Pasang
            </button>
            <button
              onClick={tutup}
              className="rounded-xl border border-ink/15 px-4 py-2 font-body text-xs font-semibold text-ink transition hover:bg-paperDark"
            >
              Nanti saja
            </button>
          </>
        ) : (
          <button
            onClick={tutup}
            className="rounded-xl border border-ink/15 px-4 py-2 font-body text-xs font-semibold text-ink transition hover:bg-paperDark"
          >
            Mengerti
          </button>
        )}
      </div>
    </div>
  );
}
