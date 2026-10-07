import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EMAIL_KONTAK, mailtoKontak } from "@/lib/situs";

export const metadata: Metadata = {
  alternates: { canonical: "/privasi" },
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi penggunaan situs CuanKit.",
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
                Perhitungan di semua kalkulator CuanKit dilakukan di perangkat
                Anda (browser), bukan dikirim ke server kami. Kami tidak
                meminta akun dan tidak menyimpan angka usaha Anda di server.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Penyimpanan di perangkat Anda
              </h2>
              <p className="mt-2">
                Agar pekerjaan Anda tidak hilang, CuanKit menyimpan sebagian
                data di penyimpanan lokal browser (localStorage): isian
                Kalkulator HPP, ringkasan HPP terakhir yang diteruskan ke alat
                lain, dan daftar di halaman Usaha Saya. Data ini tetap ada
                setelah halaman ditutup atau di-refresh, hanya di perangkat dan
                browser yang sama, dan tidak terkirim ke kami. Anda bisa
                menghapusnya lewat tombol Hapus di Usaha Saya atau dengan
                membersihkan data situs di pengaturan browser.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Cookie dan analitik
              </h2>
              <p className="mt-2">
                Kami menggunakan Vercel Analytics untuk memahami pola kunjungan
                secara umum (misalnya jumlah
                pengunjung dan halaman yang paling banyak dibuka), guna
                meningkatkan kualitas situs. Data ini bersifat agregat dan
                tidak digunakan untuk mengidentifikasi Anda secara pribadi.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Tautan afiliasi
              </h2>
              <p className="mt-2">
                Sebagian rekomendasi alat dan bahan berisi tautan afiliasi
                (ditandai di halaman terkait). Jika Anda membeli lewat tautan
                tersebut, kami dapat menerima komisi tanpa biaya tambahan untuk
                Anda. Penyedia tautan dapat menyetel cookie mereka sendiri
                setelah Anda berpindah ke situs mereka.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest">
                Iklan pihak ketiga
              </h2>
              <p className="mt-2">
                Jika diaktifkan, situs ini dapat menampilkan iklan dari penyedia pihak ketiga,
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
                silakan hubungi kami melalui email{" "}
                <a href={mailtoKontak("Pertanyaan kebijakan privasi CuanKit")} className="font-semibold text-forest underline">
                  {EMAIL_KONTAK}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
