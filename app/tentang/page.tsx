import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EMAIL_KONTAK, mailtoKontak } from "@/lib/situs";

export const metadata: Metadata = {
  alternates: { canonical: "/tentang" },
  title: "Tentang Kami",
  description:
    "CuanKit adalah platform gratis untuk membantu UMKM Indonesia menghitung HPP dan menentukan harga jual yang tepat.",
};

export default function TentangPage() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Tentang kami
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Kenapa kami membuat CuanKit
          </h1>

          <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-ink/90">
            <p>
              CuanKit lahir dari pengamatan sederhana: banyak pelaku
              UMKM di Indonesia yang usahanya ramai pembeli, tapi kesulitan
              menjelaskan ke mana perginya keuntungan. Salah satu penyebab
              paling umum adalah harga jual yang ditentukan tanpa perhitungan
              biaya produksi yang jelas.
            </p>
            <p>
              Kami percaya bahwa alat bantu untuk menghitung Harga Pokok
              Produksi (HPP) seharusnya sederhana, gratis, dan bisa dipakai
              siapa saja tanpa latar belakang akuntansi. Karena itu,
              CuanKit dibangun sebagai kalkulator yang bisa langsung
              dipakai di browser, tanpa perlu instal aplikasi atau membuat
              akun.
            </p>
            <p>
              Selain kalkulator, kami juga menyediakan artikel-artikel
              praktis seputar penetapan harga dan pengelolaan biaya, ditulis
              dengan bahasa yang mudah dipahami untuk pelaku usaha kecil dan
              menengah.
            </p>
            <p>
              CuanKit dikembangkan secara independen dan terus
              disempurnakan berdasarkan masukan dari pengguna. Jika Anda
              punya saran atau pertanyaan, kami senang mendengarnya.
            </p>
            <h2 className="pt-2 font-display text-lg font-semibold text-forest">Hubungi kami</h2>
            <p>
              Punya saran, menemukan bug, atau butuh bantuan? Kirim email ke{" "}
              <a href={mailtoKontak("Masukan untuk CuanKit")} className="font-semibold text-forest underline">
                {EMAIL_KONTAK}
              </a>
              . Untuk laporan bug, sertakan halaman yang bermasalah dan tangkapan layarnya agar lebih cepat kami periksa.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
