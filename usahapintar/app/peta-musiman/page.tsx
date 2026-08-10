import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PetaMusiman from "@/components/PetaMusiman";

export const metadata: Metadata = {
  title: "Peta Musiman Usaha — CuanKit",
  description:
    "Pola musiman harga bahan dan permintaan usaha sepanjang tahun di Indonesia — panduan untuk calon usahawan melihat peta pasar.",
};

export default function Page() {
  return (
    <main>
      <Header />
      <PetaMusiman />
      <Footer />
    </main>
  );
}
