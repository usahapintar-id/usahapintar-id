"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Info,
  LogIn,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useFirebaseAuth } from "@/components/FirebaseProvider";
import { formatRupiah } from "@/lib/hitung";
import { kompresLogoGambar, kuotaTerpakaiBulanBerjalan } from "@/lib/nota";
import {
  BATAS_NOTA_GRATIS_BULANAN,
  DAFTAR_FITUR_PAKET,
  HARGA_PREMIUM_BULANAN,
  HARGA_PREMIUM_TAHUNAN,
  hitungStatusKuotaNota,
  METODE_PEMBAYARAN_INDONESIA,
  type SiklusLangganan,
} from "@/lib/paket";
import { mailtoKontak } from "@/lib/situs";

export default function PaketLanggananClient() {
  const {
    user,
    profile,
    authReady,
    authBusy,
    loginDenganGoogle,
    simpanProfilToko,
  } = useFirebaseAuth();

  const [siklus, setSiklus] = useState<SiklusLangganan>("bulanan");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessLogoData, setBusinessLogoData] = useState("");
  const [savingProfil, setSavingProfil] = useState(false);
  const [pesanProfil, setPesanProfil] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || "");
    setBusinessName(profile.businessName || "");
    setBusinessPhone(profile.businessPhone || "");
    setBusinessAddress(profile.businessAddress || "");
    setBusinessLogoData(profile.businessLogoData || "");
  }, [profile]);

  const plan = profile?.plan ?? "gratis";
  const terpakai = kuotaTerpakaiBulanBerjalan(
    profile?.invoiceMonthKey,
    profile?.invoiceCountThisMonth
  );
  const kuota = hitungStatusKuotaNota(plan, terpakai);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPesanProfil(null);
    try {
      const dataUrl = await kompresLogoGambar(file);
      setBusinessLogoData(dataUrl);
    } catch (err) {
      setPesanProfil({
        tipe: "error",
        teks: err instanceof Error ? err.message : "Gagal memproses gambar logo.",
      });
    }
  }

  async function handleSimpanProfil(e: React.FormEvent) {
    e.preventDefault();
    setPesanProfil(null);
    setSavingProfil(true);
    try {
      await simpanProfilToko({
        displayName,
        businessName,
        businessPhone,
        businessAddress,
        businessLogoData,
      });
      setPesanProfil({
        tipe: "sukses",
        teks: "Identitas usaha berhasil disimpan ke akun Anda dan otomatis terisi saat membuat nota baru.",
      });
    } catch (err) {
      setPesanProfil({
        tipe: "error",
        teks:
          err instanceof Error
            ? err.message
            : "Gagal menyimpan profil usaha.",
      });
    } finally {
      setSavingProfil(false);
    }
  }

  const hargaTampil =
    siklus === "bulanan"
      ? HARGA_PREMIUM_BULANAN
      : Math.round(HARGA_PREMIUM_TAHUNAN / 12);

  return (
    <div className="space-y-10">
      {/* Status Akun & Profil Usaha Default */}
      <div className="rounded-2xl border border-ink/10 bg-surface p-6 sm:p-8 shadow-card">
        {!authReady ? (
          <div className="h-24 animate-pulse rounded-xl bg-paperDark" />
        ) : !user ? (
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                <ShieldCheck className="h-4 w-4" />
                <span>Akun &amp; Sinkronisasi Cloud</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                Masuk untuk menyimpan identitas toko &amp; riwayat usaha
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                Semua kalkulator tetap bisa langsung dipakai tanpa login. Dengan akun Google, data nota, buku kas, dan profil toko Anda tersimpan rapi dan dapat diakses dari perangkat mana saja.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loginDenganGoogle()}
              disabled={authBusy}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{authBusy ? "Menghubungkan..." : "Masuk dengan Google"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                  Akun Terhubung · {plan === "premium" ? "CuanKit Pro" : "Paket Gratis"}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {profile?.displayName || user.displayName || "Pemilik Usaha"}
                </h2>
                <p className="font-body text-xs text-muted">{user.email}</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-paper px-4 py-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Kuota Nota Bulan Ini
                </p>
                <p className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                  {kuota.batas === null
                    ? `${kuota.terpakai} / Tanpa Batas`
                    : `${kuota.terpakai} / ${kuota.batas} Nota`}
                </p>
                {kuota.batas !== null && (
                  <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-paperDark">
                    <div
                      className="h-full rounded-full bg-forest transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((kuota.terpakai / kuota.batas) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSimpanProfil} className="space-y-5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-forest" />
                <h3 className="font-display text-lg font-semibold text-ink">
                  Identitas Toko Default (Otomatis Terisi di Generator Nota)
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profil-nama-pemilik"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Nama Pemilik / Akun
                  </label>
                  <input
                    id="profil-nama-pemilik"
                    type="text"
                    maxLength={100}
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Misal: Budi Santoso"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profil-nama-toko"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Nama Toko / Usaha
                  </label>
                  <input
                    id="profil-nama-toko"
                    type="text"
                    maxLength={120}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Misal: Warung Mbak Sari"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profil-telp-toko"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Nomor WhatsApp / Telepon Toko
                  </label>
                  <input
                    id="profil-telp-toko"
                    type="tel"
                    maxLength={32}
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="Misal: 081234567890"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profil-alamat-toko"
                    className="block font-body text-xs font-semibold text-ink"
                  >
                    Alamat Toko
                  </label>
                  <input
                    id="profil-alamat-toko"
                    type="text"
                    maxLength={240}
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Misal: Jl. Merdeka No. 14, Bandung"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 font-body text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-ink/15 bg-paper">
                  {businessLogoData ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={businessLogoData}
                      alt="Logo toko"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="profil-upload-logo"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/15 bg-paper px-3.5 py-2 font-body text-xs font-semibold text-ink transition hover:bg-paperDark"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Unggah Logo Toko</span>
                  </label>
                  <input
                    id="profil-upload-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => void handleLogoChange(e)}
                    className="sr-only"
                  />
                  {businessLogoData && (
                    <button
                      type="button"
                      onClick={() => setBusinessLogoData("")}
                      className="ml-2 inline-flex items-center gap-1 font-body text-xs font-medium text-ledger hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus logo</span>
                    </button>
                  )}
                  <p className="font-body text-[11px] text-muted">
                    PNG, JPG, atau WebP — otomatis dikompres agar ringan di PDF.
                  </p>
                </div>
              </div>

              {pesanProfil && (
                <p
                  role={pesanProfil.tipe === "error" ? "alert" : "status"}
                  className={`rounded-xl px-4 py-2.5 font-body text-xs font-medium ${
                    pesanProfil.tipe === "error"
                      ? "border border-ledger/20 bg-ledger/5 text-ledger"
                      : "border border-forest/20 bg-forest-soft text-forest"
                  }`}
                >
                  {pesanProfil.teks}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={savingProfil}
                  className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-forest-light disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {savingProfil ? "Menyimpan..." : "Simpan Identitas Toko"}
                  </span>
                </button>
                <Link
                  href="/generator-nota"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-paperDark"
                >
                  <span>Buka Generator Nota</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Perbandingan Paket Gratis vs Premium */}
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Transparansi Paket</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Mulai gratis, kembangkan saat usaha makin ramai
            </h2>
          </div>

          <div
            role="group"
            aria-label="Pilih siklus tagihan"
            className="inline-flex rounded-xl border border-ink/10 bg-paperDark/80 p-1"
          >
            <button
              type="button"
              onClick={() => setSiklus("bulanan")}
              className={`rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition ${
                siklus === "bulanan"
                  ? "bg-surface text-forest shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setSiklus("tahunan")}
              className={`rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition ${
                siklus === "tahunan"
                  ? "bg-surface text-forest shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Tahunan (Hemat 20%)
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Paket Gratis */}
          <div className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-6 sm:p-8 shadow-card">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-ink">
                  CuanKit Gratis
                </h3>
                {plan === "gratis" && (
                  <span className="font-mono text-xs font-semibold text-forest">
                    Paket Aktif
                  </span>
                )}
              </div>
              <p className="mt-2 font-body text-sm text-muted">
                Cocok untuk pemula, warung rumahan, dan usaha yang baru merapikan hitungan modal.
              </p>
              <div className="mt-5 border-y border-ink/10 py-4">
                <p className="font-mono text-3xl font-bold tabular-nums text-ink">
                  Rp 0
                  <span className="ml-1.5 font-body text-xs font-normal text-muted">
                    / selamanya
                  </span>
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {DAFTAR_FITUR_PAKET.map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        f.tersediaGratis ? "text-forest" : "text-muted/40"
                      }`}
                    />
                    <div>
                      <span
                        className={`font-body font-medium ${
                          f.tersediaGratis ? "text-ink" : "text-muted line-through"
                        }`}
                      >
                        {f.nama}
                      </span>
                      <p className="font-mono text-xs text-muted">{f.gratis}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 pt-4">
              <Link
                href="/generator-nota"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-forest bg-forest-soft px-4 py-3 font-body text-sm font-semibold text-forest transition hover:bg-forest hover:text-white"
              >
                <span>Gunakan Fitur Gratis Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Paket Pro */}
          <div className="flex flex-col justify-between rounded-2xl border border-brass/40 bg-surface p-6 sm:p-8 shadow-card">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brass" />
                  <h3 className="font-display text-xl font-semibold text-ink">
                    CuanKit Pro (UMKM Bertumbuh)
                  </h3>
                </div>
                {plan === "premium" && (
                  <span className="font-mono text-xs font-semibold text-forest">
                    Paket Aktif
                  </span>
                )}
              </div>
              <p className="mt-2 font-body text-sm text-muted">
                Untuk usaha dengan transaksi harian rutin yang butuh laporan lengkap, stok tak terbatas, dan analisis AI.
              </p>
              <div className="mt-5 border-y border-ink/10 py-4">
                <p className="font-mono text-3xl font-bold tabular-nums text-ink">
                  {formatRupiah(hargaTampil)}
                  <span className="ml-1.5 font-body text-xs font-normal text-muted">
                    / bulan {siklus === "tahunan" ? `(${formatRupiah(HARGA_PREMIUM_TAHUNAN)}/thn)` : ""}
                  </span>
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {DAFTAR_FITUR_PAKET.map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                    <div>
                      <span className="font-body font-medium text-ink">
                        {f.nama}
                      </span>
                      <p className="font-mono text-xs text-forest">{f.premium}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 space-y-3 border-t border-ink/10 pt-5">
              <div className="rounded-xl border border-brass/30 bg-brass-soft p-4">
                <div className="flex items-start gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                  <div className="space-y-1 font-body text-xs leading-relaxed text-ink">
                    <p className="font-semibold">
                      Pembayaran Otomatis Sedang Dalam Tahap Integrasi
                    </p>
                    <p className="text-muted">
                      CuanKit menyiapkan kanal pembayaran lokal Indonesia (QRIS, Virtual Account, &amp; Dompet Digital) agar aktivasi paket Pro aman dan otomatis tanpa konfirmasi manual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {METODE_PEMBAYARAN_INDONESIA.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-ink/10 bg-paper px-3 py-2.5"
                  >
                    <div className="flex items-center gap-1.5 font-body text-xs font-semibold text-ink">
                      <CreditCard className="h-3.5 w-3.5 text-forest" />
                      <span>{m.label}</span>
                    </div>
                    <p className="mt-0.5 font-body text-[11px] text-muted">
                      {m.contoh}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href={mailtoKontak(
                  `Pendaftaran Akses Awal CuanKit Pro (${siklus}) - ${user?.email || "UMKM"}`
                )}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-body text-sm font-semibold text-white transition hover:bg-forest"
              >
                <span>Ajukan Akses Awal CuanKit Pro</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="font-body text-xs text-muted">
        Catatan kuota: Paket Gratis mencakup {BATAS_NOTA_GRATIS_BULANAN} nota tersimpan per bulan kalender dan diperbarui otomatis setiap tanggal 1.
      </p>
    </div>
  );
}
