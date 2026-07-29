export default function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border-2 border-forest bg-forest font-mono text-xs font-semibold text-paper">
            Rp
          </span>
          <span className="font-display text-sm font-semibold text-ink">
            UsahaPintar<span className="text-brass">.id</span>
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
          © {new Date().getFullYear()} UsahaPintar.id — Dibuat untuk pelaku
          UMKM Indonesia.
        </p>
      </div>
    </footer>
  );
}
