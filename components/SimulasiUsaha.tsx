"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah as rupiah, hitungRingkasan } from "@/lib/hitung";
import TombolSimpanUsaha from "./TombolSimpanUsaha";
import { buatEntriUsaha } from "@/lib/usahaSaya";
import type { StateAwalSimulasi } from "@/lib/simulasiAwal";

type Scenario = {
  label: string;
  hpp: number;
  harga: number;
  units: number;
};

function InputAngka({
  label,
  value,
  onChange,
  bantuan,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  bantuan?: string;
}) {
  const id = "sim-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="mt-5 first:mt-0">
      <label htmlFor={id} className="block font-body text-sm font-semibold text-ink">{label}</label>
      {bantuan && <p className="mt-1 font-body text-xs text-muted">{bantuan}</p>}
      <input
        id={id}
        type="number"
        min={0}
        value={value === 0 ? "" : value}
        placeholder="0"
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-forest"
      />
    </div>
  );
}

// Satu desimal supaya usaha dengan penjualan 1-3 unit/hari tetap melihat perubahan skenario
// (1 x 0,8 dan 1 x 1,2 sebelumnya sama-sama dibulatkan kembali ke 1, jadi skenarionya tidak berubah).
const bulatSatuDesimal = (n: number) => Math.round(n * 10) / 10;

export default function SimulasiUsaha({ awal }: { awal: StateAwalSimulasi }) {
  const [modalAwal, setModalAwal] = useState(awal.modalAwal);
  const [biayaTetap, setBiayaTetap] = useState(awal.biayaTetap);
  const [hpp, setHpp] = useState(awal.hpp);
  const [harga, setHarga] = useState(awal.harga);
  const [penjualan, setPenjualan] = useState(awal.penjualan);
  const [scenario, setScenario] = useState("bahan20");

  const dasar = hitungRingkasan({ modalAwal, biayaTetap, hpp, harga, penjualanHarian: penjualan });

  const scenarios: Record<string, Scenario> = {
    bahan10: { label: "Harga bahan naik 10%", hpp: hpp * 1.1, harga, units: penjualan },
    bahan20: { label: "Harga bahan naik 20%", hpp: hpp * 1.2, harga, units: penjualan },
    hargaTurun: { label: "Harga jual diturunkan 10%", hpp, harga: harga * 0.9, units: penjualan },
    hargaNaik: { label: "Harga jual dinaikkan 10%", hpp, harga: harga * 1.1, units: penjualan },
    jualTurun: { label: "Penjualan turun 20%", hpp, harga, units: bulatSatuDesimal(penjualan * 0.8) },
    jualNaik: { label: "Penjualan naik 20%", hpp, harga, units: bulatSatuDesimal(penjualan * 1.2) },
  };
  const hasil = scenarios[scenario];
  const skenario = hitungRingkasan({
    modalAwal,
    biayaTetap,
    hpp: hasil.hpp,
    harga: hasil.harga,
    penjualanHarian: hasil.units,
  });
  const labaHarianSkenario = skenario.labaPerUnit * hasil.units;
  const hargaAgarUntungTetap = Math.ceil((hasil.hpp + dasar.labaPerUnit) / 100) * 100;
  // Berapa unit/hari yang dibutuhkan agar laba harian sama seperti kondisi awal.
  const unitAgarLabaSama =
    skenario.labaPerUnit > 0 ? Math.ceil((dasar.labaPerUnit * penjualan) / skenario.labaPerUnit) : 0;

  let pesanRingkas: string;
  if (dasar.labaPerUnit <= 0) {
    pesanRingkas = "Harga jual belum lebih tinggi dari HPP, jadi setiap produk yang terjual tidak menghasilkan laba.";
  } else if (biayaTetap <= 0) {
    pesanRingkas = `Setiap produk menghasilkan laba ${rupiah(dasar.labaPerUnit)}. Isi biaya tetap per bulan agar BEP bisa dihitung.`;
  } else {
    pesanRingkas = `Untuk menutup biaya tetap ${rupiah(biayaTetap)} per bulan, kamu perlu menjual sekitar ${dasar.bepUnitBulanan} produk per bulan (±${Math.ceil(dasar.bepUnitBulanan / 30)} per hari). Target ${penjualan} produk per hari menghasilkan laba kotor ${rupiah(dasar.labaPerUnit * penjualan)} per hari.`;
  }

  let saran: string;
  if (scenario.startsWith("bahan") && skenario.labaPerUnit < dasar.labaPerUnit) {
    saran = `Jika kenaikan bahan ini terjadi, naikkan harga jual menjadi sekitar ${rupiah(hargaAgarUntungTetap)} agar laba per produk tetap mendekati kondisi awal.`;
  } else if (scenario === "hargaTurun") {
    saran =
      skenario.labaPerUnit > 0
        ? `Dengan harga lebih rendah, kamu perlu menjual sekitar ${unitAgarLabaSama} produk per hari (bukan ${penjualan}) agar laba harian tetap sama. Pastikan diskon ini memang menambah pembeli.`
        : "Dengan harga ini produk tidak lagi menghasilkan laba. Jangan turunkan harga sebanyak ini.";
  } else if (scenario === "jualTurun") {
    saran = "Saat penjualan turun, prioritaskan produk dengan margin terbaik dan cek kembali apakah biaya tetap masih tertutup.";
  } else {
    saran = "Perubahan ini masih bisa dipantau. Bandingkan laba bulanan dengan target kamu sebelum menetapkannya.";
  }

  // Template (punya rincian bahan) membuka Kalkulator HPP dengan datanya sendiri, apa pun kategorinya.
  // Sebelumnya hanya kuliner; Jasa Desain, Konveksi, dan Reseller dilempar ke contoh generik.
  const hrefHPP = awal.usahaId
    ? !awal.catatan
      ? `/kalkulator-hpp?usaha=${encodeURIComponent(awal.usahaId)}#kalkulator`
      : `/kalkulator-hpp?jenis=${encodeURIComponent(awal.kategoriId)}#kalkulator`
    : "/kalkulator-hpp#kalkulator";

  const tampilBEP = (v: number) => (v > 0 ? `${v} produk/bln` : "-");

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Simulasi usaha</span>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
          {awal.namaUsaha ? `Simulasi ${awal.namaUsaha}` : "Simulasi Usaha"}
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-muted">
          Uji beberapa kemungkinan sebelum mengambil keputusan harga atau target penjualan.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ["Modal awal", rupiah(modalAwal)],
            ["HPP per produk", rupiah(hpp)],
            ["Harga jual", rupiah(harga)],
            ["Laba per produk", rupiah(dasar.labaPerUnit)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-sm border border-ink/15 bg-paper px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
              <p className="mt-1 font-display text-lg font-semibold text-forest">{value}</p>
            </div>
          ))}
        </div>

        {awal.catatan && (
          <div className="mt-3 rounded-sm border border-ledger/40 bg-ledger/10 px-4 py-3 font-body text-sm text-ink" role="note">
            {awal.catatan}
          </div>
        )}
        <div className="mt-3 rounded-sm border border-brass/40 bg-brass/10 px-4 py-3 font-body text-sm text-ink">
          <strong>{awal.sumberData}:</strong> {pesanRingkas} Semua angka bisa diedit sesuai kondisi sebenarnya.
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-md border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#1E2A1F]">
            <InputAngka label="Modal awal" value={modalAwal} onChange={setModalAwal} />
            <InputAngka
              label="Biaya tetap per bulan"
              value={biayaTetap}
              onChange={setBiayaTetap}
              bantuan="Sewa, listrik, kuota, cicilan alat, dan biaya lain yang keluar walau tidak ada penjualan."
            />
            <InputAngka label="HPP per produk" value={hpp} onChange={setHpp} />
            <InputAngka label="Harga jual per produk" value={harga} onChange={setHarga} />
            <InputAngka label="Penjualan saat ini per hari" value={penjualan} onChange={setPenjualan} />
            <label className="mt-6 block font-body text-sm font-semibold text-ink" htmlFor="scenario">
              Pilih kondisi yang ingin dicoba
            </label>
            <select
              id="scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-forest"
            >
              {Object.entries(scenarios).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md border-2 border-ink bg-paper shadow-[6px_6px_0_0_#1E2A1F]">
            <div className="border-b-2 border-ink px-6 py-3">
              <span className="font-display text-sm italic text-ink">Hasil simulasi</span>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted">kondisi awal → {hasil.label.toLowerCase()}</span>
            </div>
            <div className="bg-ledger-lines px-6 py-4 font-mono text-sm text-ink">
              <div className="flex justify-between py-1"><span className="text-muted">Modal awal</span><span>{rupiah(modalAwal)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">HPP</span><span>{rupiah(hpp)} → {rupiah(hasil.hpp)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Harga jual</span><span>{rupiah(harga)} → {rupiah(hasil.harga)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Untung per produk</span><span>{rupiah(dasar.labaPerUnit)} → {rupiah(skenario.labaPerUnit)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Margin</span><span>{dasar.marginPersen.toFixed(1)}% → {skenario.marginPersen.toFixed(1)}%</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">BEP (tutup biaya tetap)</span><span>{tampilBEP(dasar.bepUnitBulanan)} → {tampilBEP(skenario.bepUnitBulanan)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Penjualan per hari</span><span>{penjualan} → {hasil.units}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Laba kotor per bulan</span><span>{rupiah(dasar.labaKotorBulanan)} → {rupiah(skenario.labaKotorBulanan)}</span></div>
              <div className="flex justify-between border-t border-ink/10 py-2 font-semibold"><span>Laba bersih per bulan</span><span>{rupiah(dasar.labaBersihBulanan)} → {rupiah(skenario.labaBersihBulanan)}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted">Perkiraan laba harian</span><span>{rupiah(labaHarianSkenario)}</span></div>
              {skenario.balikModalBulan > 0 && (
                <div className="flex justify-between py-1"><span className="text-muted">Balik modal awal</span><span>± {skenario.balikModalBulan.toFixed(1)} bulan</span></div>
              )}
            </div>
            <div className="border-t-2 border-ink px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-brass">Saran keputusan</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">{saran}</p>
              {skenario.labaBersihBulanan < 0 && (
                <p className="mt-2 font-body text-sm font-semibold text-ledger">
                  Dengan kondisi ini usaha rugi sekitar {rupiah(-skenario.labaBersihBulanan)} per bulan setelah biaya tetap.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={hrefHPP} className="rounded-sm bg-forest px-3 py-2 font-body text-xs font-semibold text-paper hover:bg-forest-dark">Hitung HPP Saya →</Link>
          <Link
            href={`/kalkulator-bep?hpp=${Math.round(hpp)}&harga=${Math.round(harga)}&biayaTetap=${Math.round(biayaTetap)}&modalAwal=${Math.round(modalAwal)}&penjualan=${penjualan}`}
            className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest"
          >
            Lihat BEP →
          </Link>
          <Link href={`/target-cuan?hpp=${Math.round(hpp)}&harga=${Math.round(harga)}&biayaTetap=${Math.round(biayaTetap)}`} className="rounded-sm border border-forest px-3 py-2 font-body text-xs font-semibold text-forest hover:bg-forest/10">Hitung Target Cuan →</Link>
          <Link href="/analisis-usaha" className="rounded-sm border border-ink/20 px-3 py-2 font-body text-xs font-semibold text-ink hover:border-forest hover:text-forest">Analisis Usaha Saya →</Link>
        </div>
        <TombolSimpanUsaha
          key={awal.namaUsaha ?? "simulasi"}
          namaAwal={awal.namaUsaha ?? "Simulasi usaha"}
          buatEntri={(nama) =>
            buatEntriUsaha({
              nama,
              hpp,
              harga,
              penjualan,
              modalAwal,
              biayaTetap,
              usahaId: awal.usahaId && !awal.catatan ? awal.usahaId : undefined,
              jenis: awal.kategoriId,
            })
          }
        />
      </div>
    </section>
  );
}
