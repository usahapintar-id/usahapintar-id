import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tentang Kami — UsahaPintar.id",
  description:
    "UsahaPintar.id adalah platform gratis untuk membantu UMKM Indonesia menghitung HPP dan menentukan harga jual yang tepat.",
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
            Kenapa kami membuat UsahaPintar.id
          </h1>

          <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-ink/90">
            <p>
              UsahaPintar.id lahir dari pengamatan sederhana: banyak pelaku
              UMKM di Indonesia yang usahanya ramai pembeli, tapi kesulitan
              menjelaskan ke mana perginya keuntungan. Salah satu penyebab
              paling umum adalah harga jual yang ditentukan tanpa perhitungan
              biaya produksi yang jelas.
            </p>
            <p>
              Kami percaya bahwa alat bantu untuk menghitung Harga Pokok
              Produksi (HPP) seharusnya sederhana, gratis, dan bisa dipakai
              siapa saja tanpa latar belakang akuntansi. Karena itu,
              UsahaPintar.id dibangun sebagai kalkulator yang bisa langsung
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
              UsahaPintar.id dikembangkan secara independen dan terus
              disempurnakan berdasarkan masukan dari pengguna. Jika Anda
              punya saran atau pertanyaan, kami senang mendengarnya.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
