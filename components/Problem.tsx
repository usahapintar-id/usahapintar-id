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
    <section className="border-y border-ink/10 bg-paperDark/60 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
          Kedengaran familiar?
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.q}
              className="rounded-md border border-ink/10 bg-paper p-6"
            >
              <p className="font-display text-lg italic leading-snug text-ink">
                {p.q}
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                {p.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
