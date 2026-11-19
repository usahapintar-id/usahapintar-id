import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artikelList } from "@/lib/artikel";

export default function LatestArticles() {
  const latest = artikelList.slice(0, 3);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Edukasi Bisnis UMKM</p>
            <h2 className="mt-2.5 max-w-lg font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Panduan praktis seputar HPP dan keuangan usaha.
            </h2>
          </div>
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-forest transition hover:text-forest-light"
          >
            <span>Lihat semua artikel</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((a) => (
            <Link
              key={a.slug}
              href={`/artikel/${a.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-card-hover"
            >
              <div>
                <p className="font-mono text-[11px] font-medium text-muted">
                  {a.date} · {a.readTime}
                </p>
                <h3 className="mt-2.5 font-display text-lg font-semibold text-ink transition-colors group-hover:text-forest">
                  {a.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted line-clamp-3">
                  {a.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 border-t border-ink/[0.07] pt-4 font-body text-xs font-semibold text-forest">
                <span>Baca selengkapnya</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
