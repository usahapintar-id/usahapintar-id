import Link from "next/link";
import { artikelList } from "@/lib/artikel";

export default function LatestArticles() {
  const latest = artikelList.slice(0, 3);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass">
              Bacaan
            </span>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-ink">
              Artikel terbaru seputar HPP dan harga jual.
            </h2>
          </div>
          <Link
            href="/artikel"
            className="font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4"
          >
            Lihat semua artikel &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((a) => (
            <Link
              key={a.slug}
              href={`/artikel/${a.slug}`}
              className="group flex flex-col rounded-md border border-ink/10 bg-paper p-6 transition hover:border-forest/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {a.date} &middot; {a.readTime}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink group-hover:text-forest">
                {a.title}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-muted">
                {a.excerpt}
              </p>
              <span className="mt-4 font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4">
                Baca selengkapnya
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
