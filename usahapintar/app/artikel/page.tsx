import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { artikelList } from "@/lib/artikel";

export const metadata: Metadata = {
  title: "Artikel — CuanKit",
  description:
    "Panduan dan tips seputar HPP, harga jual, dan pengelolaan biaya produksi untuk UMKM Indonesia.",
};

export default function ArtikelPage() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Artikel
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Panduan seputar HPP dan harga jual
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm text-muted">
            Bacaan singkat untuk membantu Anda memahami perhitungan biaya
            produksi dan menetapkan harga yang tepat untuk usaha Anda.
          </p>

          <div className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
            {artikelList.map((a) => (
              <Link
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="group block py-8 transition"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {a.date} &middot; {a.readTime}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-forest">
                  {a.title}
                </h2>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-muted">
                  {a.excerpt}
                </p>
                <span className="mt-3 inline-block font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4">
                  Baca selengkapnya
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
