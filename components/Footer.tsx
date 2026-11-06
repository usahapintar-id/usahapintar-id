import Link from "next/link";
import Image from "next/image";
import { mailtoKontak } from "@/lib/situs";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink/10 bg-paperDark/30 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-ink bg-paper shadow-[2px_2px_0_0_#1E2A1F]">
            <Image
              src="/logo-mark.png"
              alt="CuanKit"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <span className="font-display text-base font-bold text-ink">
              Cuan<span className="text-brass">Kit</span>
            </span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-muted">
              v1.0
            </span>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 font-body text-xs font-semibold text-muted">
          <Link href="/alat" className="transition hover:text-forest">
            Semua Alat
          </Link>
          <Link href="/artikel" className="transition hover:text-forest">
            Artikel &amp; Panduan
          </Link>
          <Link href="/tentang" className="transition hover:text-forest">
            Tentang Kami
          </Link>
          <Link href="/privasi" className="transition hover:text-forest">
            Kebijakan Privasi
          </Link>
          <a href={mailtoKontak("Halo CuanKit")} className="transition hover:text-forest">
            Kontak Tim
          </a>
        </nav>

        <p className="font-mono text-xs text-muted/80 text-center sm:text-right">
          © {new Date().getFullYear()} CuanKit &middot; Bebas Pakai, Bebas Cuan
        </p>
      </div>
    </footer>
  );
}
