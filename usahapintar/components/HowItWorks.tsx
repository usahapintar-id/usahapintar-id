const steps = [
  ["01", "Cari atau pilih usaha", "Mulai dari Analisis Usaha atau template yang paling dekat dengan rencana Anda."],
  ["02", "Simulasikan usaha", "Lihat modal, HPP, harga jual, laba, dan BEP sebagai estimasi awal."],
  ["03", "Hitung HPP Anda", "Ganti bahan, biaya, jumlah produksi, dan margin dengan angka sebenarnya."],
  ["04", "Cek harga dan BEP", "Pahami laba per unit dan berapa produk yang perlu terjual untuk balik modal."],
  ["05", "Tentukan target cuan", "Ubah target laba bulanan menjadi sasaran penjualan harian."],
  ["06", "Simpan usaha", "Simpan hasil perhitungan di perangkat agar mudah dipantau lagi."],
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">
          Cara kerja
        </span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
          Satu perjalanan, dari pilihan usaha sampai target keuntungan.
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
