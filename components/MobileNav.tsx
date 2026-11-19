"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Home, LayoutGrid, Receipt, Wallet } from "lucide-react";

const mobileTabs = [
  { href: "/", label: "Beranda", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/kalkulator-hpp#kalkulator",
    label: "HPP",
    icon: Calculator,
    match: (p: string) => p.startsWith("/kalkulator-hpp"),
  },
  {
    href: "/buku-kas",
    label: "Buku Kas",
    icon: Wallet,
    match: (p: string) => p.startsWith("/buku-kas"),
  },
  {
    href: "/generator-nota",
    label: "Buat Nota",
    icon: Receipt,
    match: (p: string) => p.startsWith("/generator-nota"),
  },
  {
    href: "/alat",
    label: "Semua Alat",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/alat"),
  },
];

export default function MobileNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="Navigasi cepat mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-surface/95 backdrop-blur-md md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid h-14 max-w-md grid-cols-5 items-center px-1">
        {mobileTabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                active
                  ? "font-semibold text-forest"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? "text-forest" : "text-muted"}`}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span className="truncate max-w-full px-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
