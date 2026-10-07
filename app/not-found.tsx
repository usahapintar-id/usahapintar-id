import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

const tombolUtama = "rounded-sm bg-forest px-4 py-2.5 font-body text-sm font-semibold text-paper hover:bg-forest-dark";
const tombolLain =
  "rounded-sm border border-ink/20 px-4 py-2.5 font-body text-sm font-semibold text-ink hover:border-forest hover:text-forest";

export default function NotFound() {
  return (
    <main>
      <Header />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">Error 404</span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Halaman ini tidak ditemukan</h1>
          <p className="mt-3 font-body text-sm text-muted">
            Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan. Coba salah satu jalan pintas ini:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/" className={tombolUtama}>
              Ke Beranda
            </Link>
            <Link href="/analisis-usaha" className={tombolLain}>
              Cari Ide Usaha
            </Link>
            <Link href="/kalkulator-hpp#kalkulator" className={tombolLain}>
              Hitung HPP
            </Link>
            <Link href="/simulasi" className={tombolLain}>
              Simulasi Usaha
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
