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
              className="group flex flex-col justify-between rounded-lg border-2 border-ink/20 bg-paper p-6 shadow-stamp transition-all duration-200 hover:-translate-y-1.5 hover:border-ink hover:shadow-stamp-md"
            >
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                  {a.date} &middot; {a.readTime}
                </p>
                <h3 className="mt-2.5 font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                  {a.title}
                </h3>
                <p className="mt-2.5 font-body text-sm leading-relaxed text-muted line-clamp-3">
                  {a.excerpt}
                </p>
              </div>
              <div className="mt-6 border-t border-ink/10 pt-4 flex items-center justify-between">
                <span className="font-body text-xs font-bold text-forest group-hover:underline decoration-brass decoration-2 underline-offset-4">
                  Baca selengkapnya
                </span>
                <span className="text-forest font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
