const pains = [
  {
    q: "\u201cHarga jual saya samain aja sama warung sebelah.\u201d",
    a: "Padahal biaya bahan baku dan tenaga kerja bisa jauh beda.",
  },
  {
    q: "\u201cRamai terus tapi kok modal nggak balik?\u201d",
    a: "Karena harga jual belum menutup semua biaya produksi.",
  },
  {
    q: "\u201cSaya nggak tahu untung saya sebenarnya berapa.\u201d",
    a: "Tanpa hitungan HPP, untung dan rugi cuma perasaan.",
  },
];

export default function Problem() {
  return (
    <section className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass">
          Masalah Klasik UMKM
        </div>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-ink sm:text-4xl text-balance">
          Pernah mengalami hal seperti ini?
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pains.map((p, idx) => (
            <div
              key={p.q}
              className="relative flex flex-col justify-between rounded-lg border-2 border-ink/15 bg-paper p-7 shadow-stamp transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-stamp-md"
            >
              <div className="absolute -top-3.5 left-6 rounded border border-ink/20 bg-paperDark px-2 py-0.5 font-mono text-[10px] font-bold text-muted">
                Kasus #{idx + 1}
              </div>
              <p className="font-display text-lg font-semibold italic leading-snug text-ink text-balance">
                {p.q}
              </p>
              <div className="mt-5 border-t border-ink/10 pt-4">
                <p className="font-body text-sm leading-relaxed text-muted font-medium">
                  <span className="font-bold text-ledger">Solusi: </span>{p.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
