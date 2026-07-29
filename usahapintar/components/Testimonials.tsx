const testimonials = [
  {
    quote:
      "Dulu saya jual keripik cuma modal feeling. Sekarang tahu persis HPP-nya, jadi berani naikkan harga tanpa was-was pelanggan kabur.",
    name: "Sari Wulandari",
    biz: "Keripik Singkong Bu Sari, Magetan",
  },
  {
    quote:
      "Kalkulatornya gampang dipakai walau saya bukan orang akuntansi. Sekarang tiap pesanan konveksi sudah jelas untungnya berapa.",
    name: "Agus Prasetyo",
    biz: "Konveksi Berkah Jaya",
  },
  {
    quote:
      "Yang paling membantu itu bagian overhead — selama ini biaya listrik dan gas nggak pernah saya hitung ke harga jual.",
    name: "Dewi Anggraini",
    biz: "Katering Rumahan Dewi",
  },
];

export default function Testimonials() {
  return (
    <section id="testimoni" className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Testimoni
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
          Kata mereka yang sudah mulai menghitung.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-md border border-ink/10 bg-paper p-6"
            >
              <blockquote className="font-display text-base italic leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-dashed border-ink/20 pt-4">
                <p className="font-body text-sm font-semibold text-ink">
                  {t.name}
                </p>
                <p className="font-body text-xs text-muted">{t.biz}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
