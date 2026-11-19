import { Calculator, FileSpreadsheet, Layers, SlidersHorizontal } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Kalkulator HPP otomatis",
    desc: "Masukkan bahan baku, tenaga kerja, dan biaya overhead — HPP per unit langsung dihitung otomatis tanpa rumus rumit.",
  },
  {
    icon: SlidersHorizontal,
    title: "Simulasi margin keuntungan",
    desc: "Uji persentase markup dan lihat langsung dampaknya ke harga jual serta laba bersih sebelum diterapkan ke pelanggan.",
  },
  {
    icon: FileSpreadsheet,
    title: "Rincian biaya yang rapi",
    desc: "Setiap komponen biaya tercatat terstruktur layaknya buku kas, mudah ditinjau ulang maupun diekspor ke PDF atau gambar.",
  },
  {
    icon: Layers,
    title: "Cocok untuk berbagai jenis UMKM",
    desc: "Kuliner rumahan, minuman kekinian, dagang online, konveksi, hingga jasa — tinggal pilih template atau buat dari nol.",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">Keunggulan Utama</p>
        <h2 className="mt-2.5 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl text-balance">
          Semua yang dibutuhkan untuk menetapkan harga dengan percaya diri.
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex gap-4 rounded-2xl border border-ink/10 bg-surface p-6 shadow-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-soft text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-muted">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
