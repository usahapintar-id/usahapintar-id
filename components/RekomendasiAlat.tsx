import { getRekomendasiByJenisUsaha } from "@/lib/rekomendasi";

export default function RekomendasiAlat({
  jenisUsahaId,
}: {
  jenisUsahaId: string;
}) {
  const produk = getRekomendasiByJenisUsaha(jenisUsahaId).slice(0, 6);
  if (produk.length === 0) return null;

  return (
    <div className="mt-8 rounded-md border border-ink/10 bg-paperDark/40 p-6">
      <h3 className="font-display text-base font-semibold text-ink">
        Rekomendasi alat & bahan
      </h3>
      <p className="mt-1 font-body text-xs text-muted">
        Beberapa perlengkapan yang biasa dibutuhkan untuk jenis usaha ini.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {produk.map((p) => (
          <a
            key={p.nama}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center justify-between rounded-sm border border-ink/10 bg-paper px-4 py-3 transition hover:border-forest/40"
          >
            <div>
              <p className="font-body text-sm font-semibold text-ink group-hover:text-forest">
                {p.nama}
              </p>
              <p className="mt-0.5 font-body text-xs text-muted">
                {p.deskripsi}
              </p>
            </div>
            <span className="ml-3 shrink-0 font-body text-xs font-semibold text-forest">
              Lihat &rarr;
            </span>
          </a>
        ))}
      </div>

      <p className="mt-4 font-body text-[11px] leading-relaxed text-muted">
        Tautan di atas adalah tautan afiliasi. Kami bisa mendapat komisi dari
        pembelian Anda, tanpa menambah biaya apapun untuk Anda.
      </p>
    </div>
  );
}
