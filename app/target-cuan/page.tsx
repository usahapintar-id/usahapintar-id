import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TargetCuan from "@/components/TargetCuan";

export const metadata: Metadata = {
  alternates: { canonical: "/target-cuan" }, title: "Target Cuan", description: "Hitung target penjualan berdasarkan laba yang ingin dicapai." };
export default function Page() { return <main><Header /><TargetCuan /><Footer /></main>; }
