"use client";

import { useState } from "react";
import Link from "next/link";
import TombolUnduh from "./TombolUnduh";
import {
  hitungKecocokan,
  type JawabanKuesioner,
} from "@/lib/matchingUsaha";
import type {
  ModalRange,
  Waktu,
  Keterampilan,
  SumberDaya,
  Preferensi,
  Pengalaman,
} from "@/lib/ideUsaha";

function rupiah(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

const modalOptions: { value: ModalRange; label: string }[] = [
  { value: "kecil", label: "Di bawah Rp 500.000" },
  { value: "sedang", label: "Rp 500.000 – Rp 2.000.000" },
  { value: "besar", label: "Rp 2.000.000 – Rp 5.000.000" },
  { value: "sangatBesar", label: "Di atas Rp 10.000.000" },
];

const waktuOptions: {
  value: Waktu;
  label: string;
  desc: string;
}[] = [
  {
    value: "sampingan",
    label: "Sampingan",
    desc: "Beberapa jam seminggu, di luar kesibukan utama",
  },
  {
    value: "paruhWaktu",
    label: "Paruh waktu",
    desc: "Beberapa jam per hari",
  },
  {
    value: "penuhWaktu",
    label: "Penuh waktu",
    desc: "Fokus penuh ke usaha ini",
  },
];

const keterampilanOptions: {
  value: Keterampilan;
  label: string;
}[] = [
  {
    value: "memasak",
    label: "Memasak / mengolah makanan",
  },
  {
    value: "menjahit",
    label: "Menjahit / kerajinan tangan",
  },
  {
    value: "desain",
    label: "Desain grafis / visual",
  },
  {
    value: "menulis",
    label: "Menulis / membuat konten",
  },
  {
    value: "jualan",
    label: "Jualan & negosiasi",
  },
  {
    value: "mengajar",
    label: "Mengajar / menjelaskan ke orang lain",
  },
  {
    value: "teknis",
    label: "Teknis / reparasi",
  },
  {
    value: "fotografi",
    label: "Fotografi / videografi",
  },
  {
    value: "berkebun",
    label: "Berkebun / bertani",
  },
  {
    value: "kecantikan",
    label: "Merias / kecantikan",
  },
  {
    value: "belumAda",
    label:
      "Belum ada keterampilan khusus, masih mau belajar",
  },
];

const sumberDayaOptions: {
  value: SumberDaya;
  label: string;
}[] = [
  {
    value: "lokasiStrategis",
    label: "Lokasi strategis (rumah/toko ramai)",
  },
  {
    value: "kendaraan",
    label: "Kendaraan (motor/mobil)",
  },
  {
    value: "alatMasak",
    label: "Alat masak/dapur memadai",
  },
  {
    value: "jaringanLuas",
    label: "Jaringan/relasi luas",
  },
  {
    value: "medsosBesar",
    label: "Media sosial dengan pengikut lumayan",
  },
  {
    value: "tidakAda",
    label: "Belum ada yang spesifik",
  },
];

const preferensiOptions: {
  value: Preferensi;
  label: string;
}[] = [
  {
    value: "interaksiLangsung",
    label:
      "Suka ketemu & interaksi langsung dengan orang",
  },
  {
    value: "kerjaMandiri",
    label:
      "Suka kerja mandiri / di belakang layar",
  },
  {
    value: "buatSendiri",
    label: "Suka bikin produk sendiri",
  },
  {
    value: "jualBarangOrang",
    label:
      "Suka jual produk orang lain (reseller/dagang)",
  },
];

const pengalamanOptions: { value: Pengalaman; label: string; desc: string }[] = [
  { value: "belumPernah", label: "Belum pernah usaha", desc: "Saya baru mulai belajar." },
  { value: "pernahSedikit", label: "Pernah mencoba", desc: "Saya pernah berjualan atau menjalankan usaha kecil." },
  { value: "sudahBerpengalaman", label: "Sudah berpengalaman", desc: "Saya sudah pernah menjalankan usaha secara rutin." },
];

const targetOptions = [
  { value: 1000000, label: "Sekitar Rp 1 juta / bulan" },
  { value: 3000000, label: "Sekitar Rp 3 juta / bulan" },
  { value: 5000000, label: "Sekitar Rp 5 juta / bulan" },
  { value: 10000000, label: "Di atas Rp 10 juta / bulan" },
];

const totalSteps = 7;

export default function AnalisisUsahaKuesioner() {
  const [step, setStep] = useState(1);

  const [modal, setModal] =
    useState<ModalRange | null>(null);

  const [waktu, setWaktu] =
    useState<Waktu | null>(null);

  const [keterampilan, setKeterampilan] =
    useState<Keterampilan[]>([]);

  const [sumberDaya, setSumberDaya] =
    useState<SumberDaya[]>([]);

  const [preferensi, setPreferensi] =
    useState<Preferensi[]>([]);
  const [pengalaman, setPengalaman] = useState<Pengalaman | null>(null);
  const [targetLabaBulanan, setTargetLabaBulanan] = useState(3000000);

  const [selesai, setSelesai] = useState(false);

  function toggle<T>(
    list: T[],
    value: T,
    setter: (v: T[]) => void
  ) {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  }

  function bisaLanjut() {
    if (step === 1) return modal !== null;
    if (step === 2) return waktu !== null;
    if (step === 3)
      return keterampilan.length > 0;
    if (step === 4)
      return sumberDaya.length > 0;
    if (step === 5)
      return preferensi.length > 0;
    if (step === 6)
      return pengalaman !== null;

    if (step === 7) return targetLabaBulanan > 0;
    return false;
  }

  function submit() {
    setSelesai(true);
  }

  function ulangi() {
    setStep(1);
    setModal(null);
    setWaktu(null);
    setKeterampilan([]);
    setSumberDaya([]);
    setPreferensi([]);
    setPengalaman(null);
    setTargetLabaBulanan(3000000);
    setSelesai(false);
  }

  if (selesai && modal && waktu && pengalaman) {
    const jawaban: JawabanKuesioner = {
      modal,
      waktu,
      keterampilan,
      sumberDaya,
      preferensi,
      pengalaman,
      targetLabaBulanan,
    };

    const hasil = hitungKecocokan(
      jawaban
    ).slice(0, 3);

    const semuaLemah =
      hasil.length > 0 &&
      hasil.every(
        (h) => h.tingkat === "kurang-cocok"
      );

    return (
      <div className="mt-10" id="hasil-analisis-usaha">
        {/* HEADER HASIL */}
        <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
          <span className="font-mono text-xs uppercase tracking-widest text-brass">
            Hasil Analisis Anda
          </span>

          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            3 Usaha Paling Realistis untuk Anda Mulai
          </h2>

          <p className="mt-2 font-body text-sm text-muted">
            Berdasarkan modal, waktu,
            keterampilan, sumber daya, tujuan,
            dan cara kerja yang Anda pilih.
            Hasil ini memprioritaskan kelayakan
            realistis sebelum peringkat akhir.
          </p>

          {semuaLemah && (
            <p className="mt-3 rounded-sm border border-brass/30 bg-brass/10 px-3 py-2 font-body text-xs leading-relaxed text-ink/80">
              Belum ada ide usaha yang sangat
              cocok dengan kombinasi jawaban Anda
              di basis data kami saat ini. Berikut
              3 ide yang paling mendekati.
            </p>
          )}
        </div>

        {/* HASIL TOP 3 */}
        <div className="mt-6 space-y-6">
          {hasil.map((h, i) => {
            const badgeStyle =
              h.tingkat === "sangat-cocok"
                ? "bg-forest/10 text-forest"
                : h.tingkat === "cocok"
                ? "bg-forest/10 text-forest"
                : h.tingkat === "cukup-cocok"
                ? "bg-brass/15 text-ink/70"
                : h.tingkat ===
                  "perlu-dipertimbangkan"
                ? "bg-orange-100 text-orange-800"
                : "bg-ink/5 text-muted";

            const labelTingkat =
              h.tingkat === "sangat-cocok"
                ? "Sangat cocok"
                : h.tingkat === "cocok"
                ? "Cocok"
                : h.tingkat === "cukup-cocok"
                ? "Cukup cocok"
                : h.tingkat ===
                  "perlu-dipertimbangkan"
                ? "Perlu dipertimbangkan"
                : "Kurang cocok";

            const statusLabel =
              h.status === "layak"
                ? "Layak mulai"
                : h.status === "perlu-persiapan"
                ? "Perlu persiapan"
                : "Tidak layak saat ini";

            const medali =
              h.tingkat === "kurang-cocok"
                ? "•"
                : i === 0
                ? "🥇"
                : i === 1
                ? "🥈"
                : "🥉";

            return (
              <div
                key={h.ide.id}
                className="rounded-md border-2 border-ink bg-paper shadow-[5px_5px_0_0_#1E2A1F]"
              >
                {/* JUDUL */}
                <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl">
                      {medali}
                    </span>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        {h.ide.kategori}
                      </p>

                      <h3 className="font-display text-lg font-semibold text-ink">
                        {h.ide.nama}
                      </h3>
                    </div>
                  </div>

                  {/* SKOR */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${badgeStyle}`}
                    >
                      {h.skor}%
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {labelTingkat}
                    </span>
                  </div>
                </div>

                {/* ISI */}
                <div className="px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-body text-sm leading-relaxed text-ink/90">
                      {h.ide.alasanTemplate}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                        h.status === "layak"
                          ? "border-forest/30 bg-forest/10 text-forest"
                          : h.status === "perlu-persiapan"
                          ? "border-brass/40 bg-brass/10 text-ink/80"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-forest/30 bg-forest/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-forest">
                      {h.ide.tingkatKesulitan ?? "Menengah"}
                    </span>
                    <span className="rounded-full border border-brass/30 bg-brass/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/70">
                      Potensi pasar {h.ide.potensiPasar ?? "Sedang"}
                    </span>
                  </div>

                  {/* BREAKDOWN SKOR */}
                  <div className="mt-4 rounded-sm border border-ink/10 bg-ink/5 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Mengapa usaha ini cocok?
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5">
                      <div>
                        <p className="font-mono text-[10px] text-muted">
                          Modal
                        </p>

                        <p className="font-display text-lg font-semibold text-forest">
                          {h.breakdown.modal}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] text-muted">
                          Skill
                        </p>

                        <p className="font-display text-lg font-semibold text-forest">
                          {h.breakdown.keterampilan}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] text-muted">
                          Waktu
                        </p>

                        <p className="font-display text-lg font-semibold text-forest">
                          {h.breakdown.waktu}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] text-muted">
                          Sumber daya
                        </p>

                        <p className="font-display text-lg font-semibold text-forest">
                          {h.breakdown.sumberDaya}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] text-muted">
                          Preferensi
                        </p>

                        <p className="font-display text-lg font-semibold text-forest">
                          {h.breakdown.preferensi}
                        </p>
                      </div>
                    </div>

                    {/* ALASAN PERSONAL */}
                    <div className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                      {h.alasanPersonal.map(
                        (alasan, idx) => (
                          <div
                            key={idx}
                            className="flex gap-2 font-body text-xs leading-relaxed text-ink/80"
                          >
                            <span className="font-semibold text-forest">
                              ✓
                            </span>

                            <span>{alasan}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {h.alasanFilter.length > 0 && (
                    <div className="mt-4 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700">
                        Peringatan bahaya
                      </p>
                      <ul className="mt-2 space-y-1.5 font-body text-xs leading-relaxed text-ink/80">
                        {h.alasanFilter.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="font-semibold text-amber-700">!</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* MODAL */}
                  <div className="mt-4 rounded-sm bg-ledger-lines px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Estimasi modal awal
                    </p>

                    <p className="font-display text-lg font-semibold text-forest">
                      {rupiah(h.ide.modalMin)} – {rupiah(h.ide.modalMax)}
                    </p>

                    <p className="mt-1 font-body text-xs text-muted">
                      {h.ide.rincianModal}
                    </p>
                    {h.ide.potensiKeuntungan && (
                      <p className="mt-2 font-body text-xs font-semibold text-forest">
                        Potensi laba: Rp {h.ide.potensiKeuntungan} per unit
                      </p>
                    )}
                  </div>

                  {/* POTENSI PENGEMBANGAN */}
                  {Array.isArray(h.ide.potensiPengembangan) && h.ide.potensiPengembangan.length > 0 && (
                    <div className="mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        Potensi pengembangan
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {h.ide.potensiPengembangan.map((item, idx) => (
                          <span key={idx} className="rounded-full bg-ink/5 px-2.5 py-1 font-body text-xs text-ink/80">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LANGKAH AWAL */}
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Langkah pertama yang realistis
                    </p>

                    <ol className="mt-2 space-y-1.5">
                      {h.ide.langkahAwal.map(
                        (l, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2 font-body text-sm text-ink/90"
                          >
                            <span className="font-mono text-forest">
                              {idx + 1}.
                            </span>

                            {l}
                          </li>
                        )
                      )}
                    </ol>
                  </div>

                  {/* TANTANGAN */}
                  <div className="mt-4 border-t border-dashed border-ink/20 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Yang perlu diperhatikan
                    </p>

                    <p className="mt-1 font-body text-sm text-ink/80">
                      {h.ide.tantangan}
                    </p>
                  </div>

                  {/* KOMBINASI */}
                  {h.ide.kombinasi && (
                    <div className="mt-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        Cocok dikombinasikan dengan
                      </p>

                      <p className="mt-1 font-body text-sm text-ink/80">
                        {h.ide.kombinasi}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/simulasi?usaha=${encodeURIComponent(h.ide.id)}`}
                      className="inline-block rounded-sm bg-forest px-4 py-2.5 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark"
                    >
                      Simulasikan Usaha Ini →
                    </Link>
                    <Link
                      href="/#kalkulator"
                      className="inline-block rounded-sm border border-ink/20 px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-forest hover:text-forest"
                    >
                      Hitung Harga Jual →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <TombolUnduh
            elementId="hasil-analisis-usaha"
            namaFile="Analisis-Ide-Usaha-CuanKit"
          />
        </div>

        {/* ULANGI */}
        <div className="mt-8 text-center">
          <button
            onClick={ulangi}
            className="font-body text-sm font-semibold text-forest underline decoration-brass decoration-2 underline-offset-4"
          >
            Ulangi kuesioner dengan jawaban
            berbeda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* PROGRESS BAR */}
      <div className="flex items-center gap-2">
        {Array.from({
          length: totalSteps,
        }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < step
                ? "bg-forest"
                : "bg-ink/10"
            }`}
          />
        ))}
      </div>

      <p className="mt-2 font-mono text-xs text-muted">
        Langkah {step} dari {totalSteps}
      </p>

      {/* KARTU PERTANYAAN */}
      <div className="mt-6 rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Berapa modal yang tersedia
              untuk memulai usaha?
            </h2>

            <div className="mt-5 space-y-2">
              {modalOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() =>
                    setModal(o.value)
                  }
                  className={`w-full rounded-sm border-2 px-4 py-3 text-left font-body text-sm transition ${
                    modal === o.value
                      ? "border-forest bg-forest/10 font-semibold text-forest"
                      : "border-ink/15 text-ink/80 hover:border-forest/40"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Berapa waktu yang bisa Anda
              alokasikan?
            </h2>

            <div className="mt-5 space-y-2">
              {waktuOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() =>
                    setWaktu(o.value)
                  }
                  className={`w-full rounded-sm border-2 px-4 py-3 text-left transition ${
                    waktu === o.value
                      ? "border-forest bg-forest/10"
                      : "border-ink/15 hover:border-forest/40"
                  }`}
                >
                  <p
                    className={`font-body text-sm font-semibold ${
                      waktu === o.value
                        ? "text-forest"
                        : "text-ink"
                    }`}
                  >
                    {o.label}
                  </p>

                  <p className="mt-0.5 font-body text-xs text-muted">
                    {o.desc}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Keterampilan apa yang sudah
              Anda miliki?
            </h2>

            <p className="mt-1 font-body text-xs text-muted">
              Boleh pilih lebih dari satu.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {keterampilanOptions.map(
                (o) => (
                  <button
                    key={o.value}
                    onClick={() =>
                      toggle(
                        keterampilan,
                        o.value,
                        setKeterampilan
                      )
                    }
                    className={`rounded-sm border-2 px-4 py-3 text-left font-body text-sm transition ${
                      keterampilan.includes(
                        o.value
                      )
                        ? "border-forest bg-forest/10 font-semibold text-forest"
                        : "border-ink/15 text-ink/80 hover:border-forest/40"
                    }`}
                  >
                    {o.label}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Sumber daya apa yang sudah
              Anda miliki?
            </h2>

            <p className="mt-1 font-body text-xs text-muted">
              Boleh pilih lebih dari satu.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {sumberDayaOptions.map(
                (o) => (
                  <button
                    key={o.value}
                    onClick={() =>
                      toggle(
                        sumberDaya,
                        o.value,
                        setSumberDaya
                      )
                    }
                    className={`rounded-sm border-2 px-4 py-3 text-left font-body text-sm transition ${
                      sumberDaya.includes(
                        o.value
                      )
                        ? "border-forest bg-forest/10 font-semibold text-forest"
                        : "border-ink/15 text-ink/80 hover:border-forest/40"
                    }`}
                  >
                    {o.label}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Bagaimana cara kerja yang
              Anda sukai?
            </h2>

            <p className="mt-1 font-body text-xs text-muted">
              Boleh pilih lebih dari satu.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {preferensiOptions.map(
                (o) => (
                  <button
                    key={o.value}
                    onClick={() =>
                      toggle(
                        preferensi,
                        o.value,
                        setPreferensi
                      )
                    }
                    className={`rounded-sm border-2 px-4 py-3 text-left font-body text-sm transition ${
                      preferensi.includes(
                        o.value
                      )
                        ? "border-forest bg-forest/10 font-semibold text-forest"
                        : "border-ink/15 text-ink/80 hover:border-forest/40"
                    }`}
                  >
                    {o.label}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Seberapa jauh pengalaman usaha Anda?
            </h2>
            <div className="mt-5 space-y-2">
              {pengalamanOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setPengalaman(o.value)}
                  className={`w-full rounded-sm border-2 px-4 py-3 text-left transition ${
                    pengalaman === o.value
                      ? "border-forest bg-forest/10"
                      : "border-ink/15 hover:border-forest/40"
                  }`}
                >
                  <p className={`font-body text-sm font-semibold ${pengalaman === o.value ? "text-forest" : "text-ink"}`}>
                    {o.label}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-muted">{o.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Berapa target laba per bulan Anda?
            </h2>
            <p className="mt-1 font-body text-xs text-muted">
              Target ini membantu memprioritaskan usaha yang potensinya paling mendekati tujuan Anda.
            </p>
            <div className="mt-5 space-y-2">
              {targetOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setTargetLabaBulanan(o.value)}
                  className={`w-full rounded-sm border-2 px-4 py-3 text-left font-body text-sm transition ${
                    targetLabaBulanan === o.value
                      ? "border-forest bg-forest/10 font-semibold text-forest"
                      : "border-ink/15 text-ink/80 hover:border-forest/40"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* NAVIGASI */}
        <div className="mt-6 flex items-center justify-between border-t border-dashed border-ink/20 pt-4">
          <button
            onClick={() =>
              setStep((s) =>
                Math.max(1, s - 1)
              )
            }
            disabled={step === 1}
            className="font-body text-sm font-semibold text-ink/60 transition hover:text-ink disabled:opacity-0"
          >
            ← Kembali
          </button>

          {step < totalSteps ? (
            <button
              onClick={() =>
                setStep((s) => s + 1)
              }
              disabled={!bisaLanjut()}
              className="rounded-sm bg-forest px-6 py-2.5 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Lanjut →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!bisaLanjut()}
              className="rounded-sm bg-forest px-6 py-2.5 font-body text-sm font-semibold text-paper transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Lihat Hasil →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
