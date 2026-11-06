"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/analisis-usaha", label: "Analisis Usaha" },
  { href: "/template-usaha", label: "Template Usaha" },
  { href: "/simulasi", label: "Simulasi" },
  { href: "/alat", label: "Alat Bisnis" },
  { href: "/target-cuan", label: "Target Cuan" },
  { href: "/usaha-saya", label: "Usaha Saya" },
  { href: "/artikel", label: "Artikel" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/10 bg-paper/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5 transition">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-paperDark/60 shadow-[2px_2px_0_0_#1E2A1F] transition group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0_0_#1E2A1F]">
            <Image
              src="/logo-mark.png"
              alt="CuanKit"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Cuan<span className="text-brass">Kit</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted sm:block">
              Hitung Cerdas
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 font-body text-sm font-medium text-ink/85 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-1 text-ink/80 transition-colors hover:text-forest"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brass transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/analisis-usaha"
            className="hidden rounded-sm border-2 border-ink bg-forest px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-paper shadow-stamp transition-all hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-stamp-md active:translate-x-0.5 active:translate-y-0.5 sm:inline-block"
          >
            Cari Usaha &rarr;
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_0_#1E2A1F] transition hover:bg-paperDark active:translate-x-0.5 active:translate-y-0.5 xl:hidden"
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
        <nav className="border-t border-ink/10 bg-paper px-6 py-4 xl:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 font-body text-sm font-medium text-ink/80 transition hover:bg-paperDark hover:text-forest"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/analisis-usaha"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-forest px-4 py-2.5 text-center font-body text-sm font-semibold text-paper transition hover:bg-forest-dark"
            >
              Cari Usaha
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
