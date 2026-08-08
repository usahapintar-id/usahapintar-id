const features = [
  {
    title: "Kalkulator HPP otomatis",
    desc: "Masukkan bahan baku, tenaga kerja, dan overhead — HPP per unit dihitung otomatis, tanpa rumus manual.",
    icon: (
      <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 4h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
    ),
  },
  {
    title: "Simulasi margin keuntungan",
    desc: "Coba-coba persentase margin dan lihat langsung dampaknya ke harga jual sebelum diterapkan.",
    icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  },
  {
    title: "Rincian biaya yang jelas",
    desc: "Setiap komponen biaya tercatat rapi seperti buku kas, gampang dicek ulang kapan saja.",
    icon: (
      <path d="M4 6h16M4 6v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6M8 10h8M8 14h5" />
    ),
  },
  {
    title: "Bisa dipakai untuk usaha apa saja",
    desc: "Kuliner, kerajinan, konveksi, sampai jasa — logika HPP-nya sama, tinggal sesuaikan komponennya.",
    icon: (
      <path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 8l8 5 8-5" />
    ),
  },
];

export default function Features() {
  return (
    <section id="fitur" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Fitur
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
          Semua yang dibutuhkan untuk menetapkan harga dengan percaya diri.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-paper p-8 transition hover:bg-paperDark/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-forest text-forest">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest">
                {f.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
