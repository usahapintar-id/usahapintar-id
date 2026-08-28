import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
export const metadata: Metadata = { title: "CuanKit", description: "test" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="id"><body className="font-body paper-texture">{children}<Analytics /></body></html>);
}
