const steps = [
  ["01", "Hitung HPP", "Catat bahan baku dan biaya produksi."],
  ["02", "Tentukan harga jual", "Pilih harga minimum, aman, atau rekomendasi."],
  ["03", "Cek keuntungan", "Pahami untung dan margin per produk."],
  ["04", "Hitung BEP", "Lihat kapan biaya mulai tertutup."],
  ["05", "Tentukan target cuan", "Ubah target keuntungan menjadi jumlah produk."],
  ["06", "Simulasikan risiko", "Coba perubahan bahan, harga, dan penjualan."],
  ["07", "Analisis usaha", "Tentukan langkah yang paling masuk akal."],
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
          {steps.map(([n, title, desc]) => (
            <div key={n} className="relative pl-4">
              <span className="font-mono text-4xl font-semibold text-ink/10">
                {n}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
