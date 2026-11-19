import Link from "next/link";
import Image from "next/image";
import { mailtoKontak } from "@/lib/situs";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-surface px-6 pb-24 pt-12 md:pb-12 print:hidden">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo-mark.png"
                alt="CuanKit"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-contain"
              />
              <span className="font-display text-lg font-semibold text-ink">
                Cuan<span className="text-brass">Kit</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs font-body text-xs leading-relaxed text-muted">
              Tools Cerdas, Usaha Makin Cuan. Bantu pelaku UMKM menghitung modal, HPP, dan strategi usaha secara praktis.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              Mulai &amp; Hitung
            </p>
            <ul className="mt-3 space-y-2 font-body text-xs text-muted">
              <li>
                <Link href="/analisis-usaha" className="transition hover:text-forest">
                  Analisis Ide Usaha
                </Link>
              </li>
              <li>
                <Link href="/template-usaha" className="transition hover:text-forest">
                  Template Usaha
                </Link>
              </li>
              <li>
                <Link href="/kalkulator-hpp#kalkulator" className="transition hover:text-forest">
                  Kalkulator HPP
                </Link>
              </li>
              <li>
                <Link href="/skala-produksi" className="transition hover:text-forest">
                  Skala Produksi
                </Link>
              </li>
              <li>
                <Link href="/simulasi" className="transition hover:text-forest">
                  Simulasi Usaha
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              Alat Keuangan
            </p>
            <ul className="mt-3 space-y-2 font-body text-xs text-muted">
              <li>
                <Link href="/kalkulator-bep" className="transition hover:text-forest">
                  Kalkulator BEP
                </Link>
              </li>
              <li>
                <Link href="/target-cuan" className="transition hover:text-forest">
                  Target Cuan
                </Link>
              </li>
              <li>
                <Link href="/kalkulator-pinjaman" className="transition hover:text-forest">
                  Simulasi Pinjaman / KUR
                </Link>
              </li>
              <li>
                <Link href="/buku-kas" className="transition hover:text-forest">
                  Buku Kas Harian
                </Link>
              </li>
              <li>
                <Link href="/generator-nota" className="transition hover:text-forest">
                  Generator Nota &amp; Invoice
                </Link>
              </li>
              <li>
                <Link href="/stok" className="transition hover:text-forest">
                  Manajemen Stok Barang
                </Link>
              </li>
              <li>
                <Link href="/utang-piutang" className="transition hover:text-forest">
                  Utang &amp; Piutang
                </Link>
              </li>
              <li>
                <Link href="/kalkulator-gaji" className="transition hover:text-forest">
                  Kalkulator Gaji
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              Informasi
            </p>
            <ul className="mt-3 space-y-2 font-body text-xs text-muted">
              <li>
                <Link href="/alat" className="transition hover:text-forest">
                  Semua Alat Bisnis
                </Link>
              </li>
              <li>
                <Link href="/paket" className="transition hover:text-forest">
                  Akun &amp; Paket
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="transition hover:text-forest">
                  Artikel &amp; Panduan
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="transition hover:text-forest">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="transition hover:text-forest">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <a href={mailtoKontak("Halo CuanKit")} className="transition hover:text-forest">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 font-body text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CuanKit.id — Tools Cerdas, Usaha Makin Cuan.</p>
          <p className="font-mono text-[11px]">Dirancang untuk UMKM Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
