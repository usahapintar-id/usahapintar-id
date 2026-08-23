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
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Fitur
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
          Semua yang dibutuhkan untuk menetapkan harga dengan percaya diri.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="bg-paper p-8">
              <h3 className="font-display text-lg font-semibold text-forest">
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
