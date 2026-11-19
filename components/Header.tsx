"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Briefcase,
  Calculator,
  CalendarRange,
  Compass,
  HandCoins,
  Landmark,
  LayoutGrid,
  LineChart,
  Menu,
  Receipt,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useFirebaseAuth } from "@/components/FirebaseProvider";

const navLinks = [
  { href: "/alat", label: "Alat Bisnis", match: (p: string) => p.startsWith("/alat") },
  {
    href: "/kalkulator-hpp#kalkulator",
    label: "Hitung HPP",
    match: (p: string) => p.startsWith("/kalkulator-hpp"),
  },
  { href: "/buku-kas", label: "Buku Kas", match: (p: string) => p.startsWith("/buku-kas") },
  { href: "/generator-nota", label: "Buat Nota", match: (p: string) => p.startsWith("/generator-nota") },
  { href: "/artikel", label: "Artikel", match: (p: string) => p.startsWith("/artikel") },
];

const mobileMenuGroups = [
  {
    title: "Mulai & Rencanakan",
    items: [
      { href: "/analisis-usaha", label: "Analisis Ide Usaha", icon: Compass },
      { href: "/template-usaha", label: "Template Usaha", icon: LayoutGrid },
      { href: "/peta-musiman", label: "Peta Musiman", icon: CalendarRange },
    ],
  },
  {
    title: "Kalkulator & Operasional",
    items: [
      { href: "/buku-kas", label: "Buku Kas Harian", icon: Wallet },
      { href: "/generator-nota", label: "Generator Nota & Invoice", icon: Receipt },
      { href: "/stok", label: "Manajemen Stok Barang", icon: Boxes },
      { href: "/utang-piutang", label: "Utang & Piutang", icon: HandCoins },
      { href: "/kalkulator-hpp#kalkulator", label: "Kalkulator HPP", icon: Calculator },
      { href: "/skala-produksi", label: "Kalkulator Skala Produksi", icon: SlidersHorizontal },
      { href: "/simulasi", label: "Simulasi Usaha", icon: LineChart },
      { href: "/kalkulator-bep", label: "Kalkulator BEP", icon: Scale },
      { href: "/target-cuan", label: "Target Cuan", icon: Target },
      { href: "/kalkulator-pinjaman", label: "Simulasi Pinjaman / KUR", icon: Landmark },
      { href: "/kalkulator-gaji", label: "Kalkulator Gaji", icon: Users },
    ],
  },
  {
    title: "Portofolio, Akun & Bacaan",
    items: [
      { href: "/usaha-saya", label: "Usaha Saya", icon: Briefcase },
      { href: "/paket", label: "Akun & Paket CuanKit", icon: Sparkles },
      { href: "/artikel", label: "Artikel UMKM", icon: BookOpen },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const { user, profile } = useFirebaseAuth();

  return (
    <header className="z-50 border-b border-ink/10 bg-surface/90 backdrop-blur-md md:sticky md:top-0 print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Zone 1: Single-line Brand wordmark */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap focus-visible:rounded-lg"
        >
          <Image
            src="/logo-mark.png"
            alt="CuanKit"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-ink whitespace-nowrap">
            Cuan<span className="text-brass">Kit</span>
          </span>
        </Link>

        {/* Zone 2: 5 clean single-line navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-6 lg:flex"
        >
          {navLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap shrink-0 py-1.5 font-body text-sm font-medium transition-colors ${
                  active ? "text-forest font-semibold" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-forest transition-all duration-150 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Akun + 1 primary action + mobile drawer button */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/paket"
            className="hidden items-center gap-1.5 whitespace-nowrap shrink-0 rounded-xl border border-ink/15 bg-paper px-3 py-2 font-body text-xs font-semibold text-ink transition hover:border-forest/30 hover:text-forest sm:inline-flex"
          >
            {user ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-forest" />
                <span className="max-w-[96px] truncate">
                  {profile?.displayName || user.displayName || "Akun"}
                </span>
              </>
            ) : (
              <span>Akun &amp; Paket</span>
            )}
          </Link>

          <Link
            href="/analisis-usaha"
            className="hidden items-center gap-1.5 whitespace-nowrap shrink-0 rounded-xl bg-forest px-4 py-2 font-body text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-forest-light active:scale-[0.98] sm:inline-flex"
          >
            <span>Cari Usaha</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 bg-paper text-ink transition hover:bg-paperDark lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive categorized mobile & tablet menu */}
      {open && (
        <nav
          aria-label="Menu lengkap"
          className="max-h-[75vh] overflow-y-auto border-t border-ink/10 bg-surface px-4 py-5 shadow-lg lg:hidden"
        >
          <div className="mx-auto max-w-2xl space-y-5">
            {mobileMenuGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {group.title}
                </p>
                <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-ink transition hover:bg-forest-soft hover:text-forest"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-forest" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="border-t border-ink/10 pt-4">
              <Link
                href="/analisis-usaha"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 font-body text-sm font-semibold text-white transition hover:bg-forest-light"
              >
                <span>Cari Usaha yang Cocok</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
