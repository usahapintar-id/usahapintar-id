import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { artikelList, getArtikelBySlug } from "@/lib/artikel";

export function generateStaticParams() {
  return artikelList.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const artikel = getArtikelBySlug(params.slug);
  if (!artikel) return {};
  return {
    title: `${artikel.title} — CuanKit`,
    description: artikel.excerpt,
  };
}

export default function ArtikelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const artikel = getArtikelBySlug(params.slug);
  if (!artikel) notFound();

  return (
    <main>
      <Header />
      <article className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/artikel"
            className="font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4"
          >
            &larr; Semua artikel
          </Link>

          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">
            {artikel.date} &middot; {artikel.readTime}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {artikel.title}
          </h1>

          <div className="prose-custom mt-10 space-y-5">
            {artikel.content.map((block, i) =>
              block.startsWith("## ") ? (
                <h2
                  key={i}
                  className="pt-4 font-display text-xl font-semibold text-forest"
                >
                  {block.replace("## ", "")}
                </h2>
              ) : (
                <p
                  key={i}
                  className="font-body text-base leading-relaxed text-ink/90"
                >
                  {block}
                </p>
              )
            )}
          </div>

          <div className="mt-12 rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <p className="font-display text-lg font-semibold text-ink">
              Sudah tahu HPP usaha Anda?
            </p>
            <p className="mt-1 font-body text-sm text-muted">
              Coba hitung langsung dengan Kalkulator HPP, gratis dan tanpa
              perlu daftar.
            </p>
            <Link
              href="/#kalkulator"
              className="mt-4 inline-block rounded-sm bg-forest px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark"
            >
              Buka Kalkulator HPP
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
