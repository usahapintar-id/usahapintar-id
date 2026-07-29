export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-md border-2 border-ink bg-forest px-8 py-14 text-center shadow-[6px_6px_0_0_#1E2A1F]">
        <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">
          Mulai hitung harga jual usahamu hari ini.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm text-paper/80">
          Gratis, tanpa perlu daftar. Cukup isi bahan baku dan biayamu, hasil
          langsung keluar.
        </p>
        <a
          href="#kalkulator"
          className="mt-8 inline-block rounded-sm bg-brass px-7 py-3 font-body text-sm font-semibold text-ink transition hover:brightness-95"
        >
          Buka Kalkulator HPP
        </a>
      </div>
    </section>
  );
}
