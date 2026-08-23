import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Alat Bisnis — CuanKit",
  description:
    "Kumpulan kalkulator gratis untuk bantu UMKM mengelola usaha: HPP, BEP, simulasi pinjaman, dan gaji karyawan.",
};

const alat = [
  {
    href: "/#kalkulator",
    nama: "Kalkulator HPP",
    deskripsi:
      "Hitung biaya produksi dan harga jual yang menguntungkan, sesuai jenis usaha Anda.",
  },
  {
    href: "/kalkulator-bep",
    nama: "Kalkulator BEP (Titik Impas)",
    deskripsi:
      "Cari tahu berapa unit yang harus terjual supaya usaha balik modal.",
  },
  {
    href: "/kalkulator-pinjaman",
    nama: "Simulasi Pinjaman / KUR",
    deskripsi:
      "Perkirakan cicilan bulanan dan total bunga sebelum mengajukan pinjaman modal.",
  },
  {
    href: "/kalkulator-gaji",
    nama: "Kalkulator Gaji Karyawan",
    deskripsi:
      "Hitung gaji bersih karyawan, termasuk lembur dan potongan.",
  },
];

export default function AlatPage() {
  return (
    <main>
      <Header />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Alat Bisnis
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Semua kalkulator, dalam satu tempat
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm text-muted">
            Semua tools di bawah gratis, tanpa perlu daftar akun.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {alat.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group rounded-md border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_#1E2A1F] transition hover:-translate-y-0.5"
              >
                <h2 className="font-display text-lg font-semibold text-ink group-hover:text-forest">
                  {a.nama}
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  {a.deskripsi}
                </p>
                <span className="mt-4 inline-block font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4">
                  Buka alat &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
