"use client";

import { useState } from "react";
import { polaMusiman } from "@/lib/musiman";

const arahConfig = {
  naik: { label: "Cenderung naik", color: "text-ledger", bg: "bg-ledger/10", border: "border-ledger/30" },
  turun: { label: "Cenderung turun", color: "text-forest", bg: "bg-forest/10", border: "border-forest/30" },
  campuran: { label: "Bervariasi", color: "text-brass", bg: "bg-brass/10", border: "border-brass/30" },
};

function ArrowIcon({ arah }: { arah: "naik" | "turun" | "campuran" }) {
  if (arah === "naik") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    );
  }
  if (arah === "turun") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M7 7 17 17M16 7v9H7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 12h18M14 6l6 6-6 6" />
    </svg>
  );
}

export default function PetaMusiman() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Peta Musiman
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Pola Musiman Usaha Sepanjang Tahun
        </h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-muted">
          Gambaran umum kapan biasanya harga bahan dan permintaan usaha
          bergerak, berdasarkan pola yang berulang setiap tahun di Indonesia.
          Berguna untuk calon usahawan yang ingin melihat peta pasar sebelum
          memulai.
        </p>

        <div className="mt-4 rounded-md border border-brass/30 bg-brass/10 px-4 py-3 font-body text-xs leading-relaxed text-ink/80">
          <strong>Catatan:</strong> Ramadan, Idulfitri, dan Iduladha mengikuti
          kalender Hijriah, jadi tanggalnya bergeser tiap tahun. Ini pola
          umum yang berulang, bukan prediksi harga pasti. Untuk harga
          terkini, cek{" "}
          <a
            href="https://www.bi.go.id/hargapangan"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-brass decoration-2 underline-offset-2"
          >
            PIHPS Bank Indonesia
          </a>
          .
        </div>

        {/* Timeline */}
        <div className="relative mt-10">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-ink/15" aria-hidden="true" />

          <div className="space-y-4">
            {polaMusiman.map((p, i) => {
              const cfg = arahConfig[p.arah];
              const isOpen = openIndex === i;
              return (
                <div key={p.nama} className="relative pl-12">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full border-2 ${cfg.border} ${cfg.bg} ${cfg.color} bg-paper`}
                  >
                    <ArrowIcon arah={p.arah} />
                  </div>

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={`w-full rounded-md border-2 border-ink bg-paper text-left transition ${
                      isOpen ? "shadow-[5px_5px_0_0_#1E2A1F]" : "shadow-[3px_3px_0_0_#1E2A1F]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                          {p.periode}
                        </p>
                        <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">
                          {p.nama}
                        </h2>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="border-t border-dashed border-ink/20 px-5 py-4">
                        <p className="font-body text-sm leading-relaxed text-ink/90">
                          {p.penjelasan}
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                              Komoditas terdampak
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {p.komoditas.map((k) => (
                                <span
                                  key={k}
                                  className="rounded-full border border-ink/15 bg-paperDark/50 px-2.5 py-1 font-body text-xs text-ink/80"
                                >
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                              Jenis usaha terdampak
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {p.usahaTerdampak.map((u) => (
                                <span
                                  key={u}
                                  className="rounded-full border border-forest/30 bg-forest/10 px-2.5 py-1 font-body text-xs text-forest"
                                >
                                  {u}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-md border-2 border-ink bg-forest px-6 py-6 text-center shadow-[5px_5px_0_0_#1E2A1F]">
          <p className="font-display text-lg font-semibold text-paper">
            Sudah tahu momentumnya, sekarang hitung untung-nya
          </p>
          <a
            href="/#kalkulator"
            className="mt-3 inline-block rounded-sm bg-brass px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:brightness-95"
          >
            Buka Kalkulator HPP
          </a>
        </div>
      </div>
    </section>
  );
}
