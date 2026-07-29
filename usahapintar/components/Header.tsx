export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-forest bg-forest font-mono text-sm font-semibold text-paper">
            Rp
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            UsahaPintar<span className="text-brass">.id</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 font-body text-sm font-medium text-ink/80 md:flex">
          <a href="/#fitur" className="transition hover:text-forest">
            Fitur
          </a>
          <a href="/#cara-kerja" className="transition hover:text-forest">
            Cara Kerja
          </a>
          <a href="/#kalkulator" className="transition hover:text-forest">
            Kalkulator HPP
          </a>
          <a href="/artikel" className="transition hover:text-forest">
            Artikel
          </a>
        </nav>

        <a
          href="/#kalkulator"
          className="rounded-sm bg-forest px-4 py-2 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark"
        >
          Coba Kalkulator
        </a>
      </div>
    </header>
  );
}
