"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/hitung";
import type { TitikGrafikKas } from "@/lib/bukuKas";

export default function GrafikBukuKas({
  data,
  judul,
}: {
  data: TitikGrafikKas[];
  judul: string;
}) {
  const [terpilih, setTerpilih] = useState<string | null>(null);

  const nilaiMaks = Math.max(
    1,
    ...data.flatMap((d) => [d.masuk, d.keluar])
  );

  const aktif =
    data.find((d) => d.key === terpilih) ?? data[data.length - 1] ?? null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
            Grafik Arus Kas
          </p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-ink">
            {judul}
          </h3>
        </div>

        <div className="flex items-center gap-4 font-body text-xs">
          <span className="inline-flex items-center gap-1.5 text-ink">
            <span className="h-2.5 w-2.5 rounded-sm bg-forest" />
            Pemasukan
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink">
            <span className="h-2.5 w-2.5 rounded-sm bg-ledger" />
            Pengeluaran
          </span>
        </div>
      </div>

      {/* Ringkasan Titik Aktif */}
      {aktif && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/10 bg-surface px-3.5 py-2 font-body text-xs">
          <span className="font-semibold text-ink">{aktif.label}</span>
          <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
            <span className="text-forest">
              Masuk: {formatRupiah(aktif.masuk)}
            </span>
            <span className="text-ledger">
              Keluar: {formatRupiah(aktif.keluar)}
            </span>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div className="mt-5 grid grid-cols-7 gap-2 items-end h-44 sm:gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(1, data.length)}, minmax(0, 1fr))` }}>
        {data.map((titik) => {
          const hMasuk =
            titik.masuk > 0
              ? Math.max(8, Math.round((titik.masuk / nilaiMaks) * 100))
              : 2;
          const hKeluar =
            titik.keluar > 0
              ? Math.max(8, Math.round((titik.keluar / nilaiMaks) * 100))
              : 2;
          const isSelected = aktif?.key === titik.key;

          return (
            <button
              key={titik.key}
              type="button"
              onClick={() => setTerpilih(titik.key)}
              className={`group flex h-full flex-col items-center justify-end gap-2 rounded-xl p-1.5 transition ${
                isSelected ? "bg-surface shadow-sm ring-1 ring-ink/10" : "hover:bg-surface/60"
              }`}
              title={`${titik.label} — Masuk: ${formatRupiah(
                titik.masuk
              )}, Keluar: ${formatRupiah(titik.keluar)}`}
            >
              <div className="flex h-32 w-full items-end justify-center gap-1">
                <div
                  className={`w-2.5 sm:w-3.5 rounded-t-md transition-all ${
                    titik.masuk > 0 ? "bg-forest" : "bg-ink/10"
                  }`}
                  style={{ height: `${hMasuk}%` }}
                />
                <div
                  className={`w-2.5 sm:w-3.5 rounded-t-md transition-all ${
                    titik.keluar > 0 ? "bg-ledger" : "bg-ink/10"
                  }`}
                  style={{ height: `${hKeluar}%` }}
                />
              </div>
              <span className="w-full truncate text-center font-mono text-[10px] font-medium text-muted">
                {titik.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
