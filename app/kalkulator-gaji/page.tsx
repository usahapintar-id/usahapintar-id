import type { Metadata } from "next";
import { denganOG } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KalkulatorGaji from "@/components/KalkulatorGaji";
import RekomendasiAlat from "@/components/RekomendasiAlat";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/kalkulator-gaji" },
  title: "Kalkulator Gaji Karyawan",
  description:
    "Hitung gaji bersih karyawan usaha kecil, termasuk lembur dan potongan.",
});

export default function Page() {
  return (
    <main>
      <Header />
      <KalkulatorGaji />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <RekomendasiAlat jenisUsahaId="umum" />
      </div>
      <Footer />
    </main>
  );
}
