import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — UsahaPintar.id",
  description: "Kebijakan privasi penggunaan situs UsahaPintar.id.",
};

export default function PrivasiPage() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Kebijakan
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 font-body text-sm text-muted">
            Terakhir diperbarui: Agustus 2026
          </p>

          <div className="mt-8 space-y-6 font-body text-base leading-relaxed text-ink/90">
            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Data yang kami proses
              </h2>
              <p className="mt-2">
                Perhitungan pada Kalkulator HPP di situs ini dilakukan
                sepenuhnya di perangkat Anda (browser), bukan dikirim atau
                disimpan di server kami. Data yang Anda masukkan — seperti
                nama bahan, harga, dan jumlah produksi — hilang begitu Anda
                menutup atau me-refresh halaman.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Cookie dan analitik
              </h2>
              <p className="mt-2">
                Kami dapat menggunakan layanan analitik pihak ketiga untuk
                memahami pola kunjungan secara umum (misalnya jumlah
                pengunjung dan halaman yang paling banyak dibuka), guna
                meningkatkan kualitas situs. Data ini bersifat agregat dan
                tidak digunakan untuk mengidentifikasi Anda secara pribadi.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Iklan pihak ketiga
              </h2>
              <p className="mt-2">
                Situs ini dapat menampilkan iklan dari penyedia pihak ketiga,
                termasuk Google AdSense. Penyedia iklan dapat menggunakan
                cookie untuk menampilkan iklan yang relevan berdasarkan
                kunjungan Anda ke situs ini maupun situs lain. Anda dapat
                mengatur preferensi iklan personalisasi melalui pengaturan
                iklan Google di{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest underline decoration-brass decoration-2 underline-offset-4"
                >
                  adssettings.google.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Perubahan kebijakan
              </h2>
              <p className="mt-2">
                Kebijakan privasi ini dapat diperbarui sewaktu-waktu.
                Perubahan akan ditampilkan di halaman ini dengan tanggal
                pembaruan terbaru.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Kontak
              </h2>
              <p className="mt-2">
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini,
                silakan hubungi kami melalui kontak yang tersedia di halaman
                Tentang Kami.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
