import { AlertCircle, CheckCircle2 } from "lucide-react";

const pains = [
  {
    kasus: "Masalah Harga",
    q: "\u201cHarga jual saya samain aja sama warung sebelah.\u201d",
    a: "Padahal biaya bahan baku, sewa tempat, dan tenaga kerja tiap usaha bisa jauh berbeda.",
  },
  {
    kasus: "Masalah Arus Kas",
    q: "\u201cRamai terus tapi kok modal nggak balik?\u201d",
    a: "Sering terjadi karena harga jual ternyata belum menutup biaya overhead dan susut bahan.",
  },
  {
    kasus: "Masalah Margin",
    q: "\u201cSaya nggak tahu untung saya sebenarnya berapa.\u201d",
    a: "Tanpa catatan HPP dan biaya tetap yang jelas, untung dan rugi hanya berdasarkan perkiraan.",
  },
];

export default function Problem() {
  return (
    <section className="border-y border-ink/[0.08] bg-paperDark/50 px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">Tantangan Harian UMKM</p>
        <h2 className="mt-2.5 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
          Pernah mengalami situasi seperti ini?
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pains.map((p) => (
            <article
              key={p.q}
              className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] font-medium text-ledger">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{p.kasus}</span>
                </div>
                <p className="mt-3 font-display text-lg font-medium italic leading-snug text-ink text-balance">
                  {p.q}
                </p>
              </div>
              <div className="mt-5 flex items-start gap-2.5 border-t border-ink/[0.07] pt-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <p className="font-body text-sm leading-relaxed text-muted">
                  {p.a}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
