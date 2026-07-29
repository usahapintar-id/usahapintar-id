const steps = [
  {
    n: "01",
    title: "Catat bahan baku",
    desc: "Masukkan setiap bahan dan biayanya — sistem menjumlahkan total modal bahan secara otomatis.",
  },
  {
    n: "02",
    title: "Tambahkan biaya lain",
    desc: "Isi tenaga kerja, overhead, dan jumlah unit yang dihasilkan dari satu kali produksi.",
  },
  {
    n: "03",
    title: "Atur margin, lihat harga jual",
    desc: "Geser persentase keuntungan yang diinginkan — harga jual per unit muncul seketika.",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Cara kerja
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
          Tiga langkah, dari bahan baku sampai harga jual.
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative pl-4">
              <span className="font-mono text-4xl font-semibold text-ink/10">
                {s.n}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
