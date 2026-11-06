const features = [
  {
    title: "Kalkulator HPP otomatis",
    desc: "Masukkan bahan baku, tenaga kerja, dan overhead — HPP per unit dihitung otomatis, tanpa rumus manual.",
  },
  {
    title: "Simulasi margin keuntungan",
    desc: "Coba-coba persentase margin dan lihat langsung dampaknya ke harga jual sebelum diterapkan.",
  },
  {
    title: "Rincian biaya yang jelas",
    desc: "Setiap komponen biaya tercatat rapi seperti buku kas, gampang dicek ulang kapan saja.",
  },
  {
    title: "Bisa dipakai untuk usaha apa saja",
    desc: "Kuliner, kerajinan, konveksi, sampai jasa — logika HPP-nya sama, tinggal sesuaikan komponennya.",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass">
          Fitur Utama
        </div>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-ink sm:text-4xl text-balance">
          Semua yang dibutuhkan untuk menetapkan harga dengan percaya diri.
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative flex flex-col justify-between rounded-lg border-2 border-ink/20 bg-paper p-8 shadow-stamp transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-stamp-md"
            >
              <div>
                <span className="font-mono text-xs font-bold text-brass border-b-2 border-brass/40 pb-0.5">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink group-hover:text-forest transition-colors">
                  {f.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
