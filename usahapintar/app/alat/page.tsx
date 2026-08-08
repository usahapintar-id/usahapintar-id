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
    icon: (
      <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 4h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
    ),
  },
  {
    href: "/kalkulator-bep",
    nama: "Kalkulator BEP (Titik Impas)",
    deskripsi:
      "Cari tahu berapa unit yang harus terjual supaya usaha balik modal.",
    icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  },
  {
    href: "/kalkulator-pinjaman",
    nama: "Simulasi Pinjaman / KUR",
    deskripsi:
      "Perkirakan cicilan bulanan dan total bunga sebelum mengajukan pinjaman modal.",
    icon: (
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    href: "/kalkulator-gaji",
    nama: "Kalkulator Gaji Karyawan",
    deskripsi: "Hitung gaji bersih karyawan, termasuk lembur dan potongan.",
    icon: (
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    ),
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
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-forest text-forest transition group-hover:bg-forest group-hover:text-paper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {a.icon}
                  </svg>
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-forest">
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
