const steps = [
  ["01", "Cari atau pilih usaha", "Mulai dari Analisis Usaha atau template yang paling dekat dengan rencana Anda."],
  ["02", "Simulasikan usaha", "Lihat modal, HPP, harga jual, laba, dan BEP sebagai estimasi awal."],
  ["03", "Hitung HPP Anda", "Ganti bahan, biaya, jumlah produksi, dan margin dengan angka sebenarnya."],
  ["04", "Cek harga dan BEP", "Pahami laba per unit dan berapa produk yang perlu terjual tiap bulan untuk menutup biaya tetap."],
  ["05", "Tentukan target cuan", "Ubah target laba bulanan menjadi sasaran penjualan harian."],
  ["06", "Simpan usaha", "Simpan hasil perhitungan di perangkat agar mudah dipantau lagi."],
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-ink/10 bg-paperDark/60 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-widest text-brass">
          Cara Kerja CuanKit
        </div>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-bold text-ink sm:text-4xl text-balance">
          Cari &rarr; Hitung &rarr; Uji &rarr; Mulai
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([n, title, desc]) => (
            <div
              key={n}
              className="relative flex flex-col justify-between rounded-lg border-2 border-ink/15 bg-paper p-6 shadow-stamp transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-stamp-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <span className="font-mono text-xl font-bold text-brass">
                    {n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Langkah
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
