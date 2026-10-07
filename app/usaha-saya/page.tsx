import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UsahaSaya from "@/components/UsahaSaya";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/usaha-saya" }, title: "Usaha Saya", description: "Simpan HPP, harga jual, target, dan catatan usaha di perangkat Anda." });
export default function Page() { return <main><Header /><UsahaSaya /><Footer /></main>; }
