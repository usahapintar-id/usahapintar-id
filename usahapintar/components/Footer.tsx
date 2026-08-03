import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt="CuanKit"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-display text-sm font-semibold text-ink">
            Cuan<span className="text-brass">Kit</span>
          </span>
        </div>

        <nav className="flex items-center gap-5 font-body text-xs text-muted">
          <a href="/artikel" className="transition hover:text-forest">
            Artikel
          </a>
          <a href="/tentang" className="transition hover:text-forest">
            Tentang Kami
          </a>
          <a href="/privasi" className="transition hover:text-forest">
            Kebijakan Privasi
          </a>
        </nav>

        <p className="font-body text-xs text-muted">
          © {new Date().getFullYear()} CuanKit — Tools Cerdas, Usaha Makin
          Cuan.
        </p>
      </div>
    </footer>
  );
}
