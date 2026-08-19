"use client";

import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#kalkulator", label: "Kalkulator HPP" },
  { href: "/alat", label: "Alat Bisnis" },
  { href: "/peta-musiman", label: "Peta Musiman" },
  { href: "/analisis-usaha", label: "Analisis Usaha" },
  { href: "/artikel", label: "Artikel" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt="CuanKit"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Cuan<span className="text-brass">Kit</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 font-body text-sm font-medium text-ink/80 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-forest"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/#kalkulator"
            className="hidden rounded-sm bg-forest px-4 py-2 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark sm:inline-block"
          >
            Coba Kalkulator
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-ink/20 text-ink lg:hidden"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 font-body text-sm font-medium text-ink/80 transition hover:bg-paperDark hover:text-forest"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#kalkulator"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-forest px-4 py-2.5 text-center font-body text-sm font-semibold text-paper transition hover:bg-forest-dark"
            >
              Coba Kalkulator
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
