"use client";

import Link from "next/link";
import { LogIn, LogOut, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import { BATAS_NOTA_GRATIS_BULANAN, hitungStatusKuotaNota } from "@/lib/paket";
import { kuotaTerpakaiBulanBerjalan } from "@/lib/nota";

export default function AuthAkunPanel({
  ringkas = false,
}: {
  ringkas?: boolean;
}) {
  const {
    user,
    profile,
    authReady,
    authBusy,
    authError,
    clearAuthError,
    loginDenganGoogle,
    logout,
  } = useFirebaseAuth();

  const terpakai = kuotaTerpakaiBulanBerjalan(
    profile?.invoiceMonthKey,
    profile?.invoiceCountThisMonth
  );
  const plan = profile?.plan ?? "gratis";
  const kuota = hitungStatusKuotaNota(plan, terpakai);

  if (!authReady) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-card">
        <div className="h-5 w-48 animate-pulse rounded bg-paperDark" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-surface p-4 sm:p-5 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-body text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-forest" />
              <span>Simpan &amp; Sinkronisasi Lintas Perangkat</span>
            </div>
            <p className="font-body text-xs leading-relaxed text-muted">
              Masuk dengan akun Google agar riwayat nota, identitas toko, dan kuota{" "}
              {BATAS_NOTA_GRATIS_BULANAN} nota/bulan tersimpan aman di cloud dan bisa dibuka dari HP maupun laptop.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loginDenganGoogle()}
            disabled={authBusy}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            <span>{authBusy ? "Menghubungkan..." : "Masuk dengan Google"}</span>
          </button>
        </div>

        {authError && (
          <div
            role="alert"
            className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-ledger/20 bg-ledger/5 px-3.5 py-2.5 font-body text-xs text-ledger"
          >
            <span>{authError}</span>
            <button
              type="button"
              onClick={clearAuthError}
              className="font-semibold underline"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-forest/20 bg-surface p-4 sm:p-5 shadow-card">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-ink">
              <UserCheck className="h-4 w-4 text-forest" />
              <span className="truncate">
                {profile?.displayName || user.displayName || "Pemilik Usaha"}
              </span>
            </span>
            <span className="text-muted">·</span>
            <span className="font-mono text-xs font-semibold text-forest">
              {plan === "premium" ? "Paket Pro" : "Paket Gratis"}
            </span>
            <span className="text-muted">·</span>
            <span className="font-mono text-xs tabular-nums text-muted">
              {kuota.batas === null
                ? `${kuota.terpakai} nota bulan ini (Tanpa batas)`
                : `Kuota bulan ini: ${kuota.terpakai}/${kuota.batas} nota`}
            </span>
          </div>
          {!ringkas && (
            <p className="truncate font-body text-xs text-muted">
              {user.email}
              {profile?.businessName ? ` · Toko: ${profile.businessName}` : ""}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/paket"
            className="inline-flex items-center gap-1.5 rounded-xl border border-brass/30 bg-brass-soft px-3.5 py-2 font-body text-xs font-semibold text-ink transition hover:border-brass"
          >
            <Sparkles className="h-3.5 w-3.5 text-brass" />
            <span>{plan === "premium" ? "Kelola Paket" : "Lihat Paket & Profil"}</span>
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={authBusy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-paper px-3.5 py-2 font-body text-xs font-semibold text-ink transition hover:bg-paperDark disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {authError && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-ledger/20 bg-ledger/5 px-3.5 py-2 font-body text-xs text-ledger"
        >
          {authError}
        </div>
      )}
    </div>
  );
}
