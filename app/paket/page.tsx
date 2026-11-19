import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaketLanggananClient from "@/components/PaketLanggananClient";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/paket" },
  title: "Akun UMKM & Paket CuanKit",
  description:
    "Kelola akun usaha, identitas toko default untuk nota, pantau kuota bulanan, dan lihat perbandingan paket Gratis vs CuanKit Pro.",
});

export default function PaketPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Akun &amp; Langganan</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Akun Usaha &amp; Paket CuanKit
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Atur identitas toko agar otomatis muncul di setiap nota, sinkronkan riwayat usaha lintas perangkat, dan pantau kuota penggunaan bulanan.
            </p>
          </div>

          <div className="mt-8">
            <PaketLanggananClient />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
