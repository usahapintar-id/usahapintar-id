import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UtangPiutangManager from "@/components/UtangPiutangManager";
import { denganOG } from "@/lib/metadata";

export const metadata: Metadata = denganOG({
  alternates: { canonical: "/utang-piutang" },
  title: "Pengelola Utang & Piutang UMKM",
  description:
    "Catat piutang pelanggan dan utang usaha ke supplier, pantau sisa tagihan otomatis, riwayat cicilan pembayaran, dan kirim pengingat WhatsApp.",
});

export default function UtangPiutangPage() {
  return (
    <main>
      <Header />
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Operasional &amp; Tagihan</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
              Pengelola Utang &amp; Piutang
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted sm:text-base">
              Catat kasbon pelanggan dan tagihan supplier agar tidak ada yang terlewat. Pantau sisa tagihan, riwayat cicilan, hingga pengingat WhatsApp.
            </p>
          </div>

          <div className="mt-8">
            <UtangPiutangManager />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
