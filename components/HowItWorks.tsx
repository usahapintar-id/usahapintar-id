const steps = [
  ["01", "Cari atau pilih usaha", "Mulai dari kuesioner Analisis Usaha atau pilih template yang paling dekat dengan rencanamu."],
  ["02", "Simulasikan angkanya", "Lihat estimasi modal, HPP, harga jual, laba, dan BEP sebagai gambaran awal."],
  ["03", "Hitung HPP sebenarnya", "Masukkan harga bahan baku, tenaga kerja, dan biaya produksi sesuai kondisi usahamu."],
  ["04", "Cek harga & titik impas", "Pastikan harga jual memberi margin sehat dan ketahui target penjualan minimum bulanan."],
  ["05", "Susun target cuan", "Ubah target keuntungan bulanan menjadi target penjualan harian yang terukur."],
  ["06", "Simpan & pantau usaha", "Simpan hasil perhitungan di perangkatmu agar mudah dievaluasi kapan saja."],
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-ink/[0.08] bg-paperDark/50 px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">Alur Kerja CuanKit</p>
        <h2 className="mt-2.5 max-w-lg font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
          Dari ide mentah sampai hitungan yang masuk akal.
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([n, title, desc]) => (
            <div
              key={n}
              className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
            >
              <div className="flex items-center justify-between border-b border-ink/[0.07] pb-3">
                <span className="font-mono text-sm font-semibold text-forest">
                  {n}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  Tahap {Number(n)}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
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
