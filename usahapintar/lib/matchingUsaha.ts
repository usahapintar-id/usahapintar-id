import {
  ideUsahaList,
  type IdeUsaha,
  type ModalRange,
  type Waktu,
  type Keterampilan,
  type SumberDaya,
  type Preferensi,
} from "./ideUsaha";

export type JawabanKuesioner = {
  modal: ModalRange;
  waktu: Waktu;
  keterampilan: Keterampilan[];
  sumberDaya: SumberDaya[];
  preferensi: Preferensi[];
};

export type TingkatKecocokan =
  | "sangat-cocok"
  | "cocok"
  | "cukup-cocok"
  | "perlu-dipertimbangkan"
  | "kurang-cocok";

export type KelayakanUsaha = "layak" | "perlu-persiapan" | "tidak-layak";

export type BreakdownSkor = {
  modal: number;
  keterampilan: number;
  waktu: number;
  sumberDaya: number;
  preferensi: number;
};

export type HasilPencocokan = {
  ide: IdeUsaha;
  skor: number;
  tingkat: TingkatKecocokan;
  status: KelayakanUsaha;
  breakdown: BreakdownSkor;
  alasanPersonal: string[];
  alasanFilter: string[];
};

const MODAL_ORDER: ModalRange[] = ["kecil", "sedang", "besar", "sangatBesar"];
const WAKTU_ORDER: Waktu[] = ["sampingan", "paruhWaktu", "penuhWaktu"];

function getTingkat(skor: number): TingkatKecocokan {
  if (skor >= 90) return "sangat-cocok";
  if (skor >= 80) return "cocok";
  if (skor >= 70) return "cukup-cocok";
  if (skor >= 60) return "perlu-dipertimbangkan";
  return "kurang-cocok";
}

function weightedScore(score: number, weight: number): number {
  return (score / 100) * weight;
}

function getUserModalNominal(modal: ModalRange): number {
  return {
    kecil: 500000,
    sedang: 2000000,
    besar: 5000000,
    sangatBesar: 10000000,
  }[modal];
}

function getUserWaktuIndex(waktu: Waktu): number {
  return WAKTU_ORDER.indexOf(waktu);
}

function getMinimalWaktu(ide: IdeUsaha): Waktu {
  if (ide.waktuCocok.includes("penuhWaktu")) return "penuhWaktu";
  if (ide.waktuCocok.includes("paruhWaktu")) return "paruhWaktu";
  return "sampingan";
}

function scoreModal(ide: IdeUsaha, modal: ModalRange): number {
  if (ide.modalCocok.includes(modal)) return 100;

  const target = MODAL_ORDER.indexOf(modal);
  const jarak = Math.min(
    ...ide.modalCocok.map((m) => Math.abs(MODAL_ORDER.indexOf(m) - target))
  );

  if (jarak === 1) return 65;
  if (jarak === 2) return 35;
  return 15;
}

function scoreWaktu(ide: IdeUsaha, waktu: Waktu): number {
  if (ide.waktuCocok.includes(waktu)) return 100;

  const target = getUserWaktuIndex(waktu);
  const jarak = Math.min(
    ...ide.waktuCocok.map((w) => Math.abs(WAKTU_ORDER.indexOf(w) - target))
  );

  if (jarak === 1) return 60;
  if (jarak === 2) return 30;
  return 10;
}

function scoreKeterampilan(ide: IdeUsaha, keterampilan: Keterampilan[]): number {
  const pilihBelumAdaSaja =
    keterampilan.length === 1 && keterampilan[0] === "belumAda";

  if (pilihBelumAdaSaja) {
    return ide.cocokPemula ? 100 : 35;
  }

  if (ide.keterampilanKunci.length === 0) {
    return 70;
  }

  const overlap = ide.keterampilanKunci.filter((k) => keterampilan.includes(k)).length;
  if (overlap === 0) return 20;

  return Math.min(100, Math.round((overlap / ide.keterampilanKunci.length) * 100));
}

function scoreSumberDaya(ide: IdeUsaha, sumberDaya: SumberDaya[]): number {
  if (sumberDaya.includes("tidakAda")) {
    return ide.sumberDayaPendukung.length === 0 ? 100 : 60;
  }

  if (ide.sumberDayaPendukung.length === 0) {
    return 80;
  }

  const overlap = ide.sumberDayaPendukung.filter((s) => sumberDaya.includes(s)).length;
  if (overlap === 0) return 25;

  return Math.min(100, Math.round((overlap / ide.sumberDayaPendukung.length) * 100));
}

function scorePreferensi(ide: IdeUsaha, preferensi: Preferensi[]): number {
  if (ide.preferensiCocok.length === 0) {
    return 70;
  }

  const overlap = ide.preferensiCocok.filter((p) => preferensi.includes(p)).length;
  if (overlap === 0) return 25;

  return Math.min(100, Math.round((overlap / ide.preferensiCocok.length) * 100));
}

function cekKelayakan(
  ide: IdeUsaha,
  jawaban: JawabanKuesioner
): { status: KelayakanUsaha; alasan: string[] } {
  const alasan: string[] = [];
  const modalUser = getUserModalNominal(jawaban.modal);
  const waktuUser = getUserWaktuIndex(jawaban.waktu);
  const waktuMin = getUserWaktuIndex(getMinimalWaktu(ide));

  const modalIsi = modalUser >= ide.modalMin;
  if (!modalIsi) {
    alasan.push("Modal Anda belum cukup untuk memulai usaha ini di skala realistis.");
  }

  const waktuIsi = waktuUser >= waktuMin;
  if (!waktuIsi) {
    alasan.push("Waktu yang Anda punya belum cukup untuk menjalankan usaha ini secara konsisten.");
  }

  const keterampilanWajib = ide.keterampilanWajib ?? [];
  const keterampilanIsi =
    keterampilanWajib.length === 0 ||
    keterampilanWajib.every((k) => jawaban.keterampilan.includes(k) || jawaban.keterampilan.includes("belumAda"));

  if (!keterampilanIsi) {
    alasan.push("Keterampilan utama usaha ini belum sepenuhnya tersedia, sehingga perlu persiapan belajar.");
  }

  const sumberDayaWajib = ide.sumberDayaWajib ?? [];
  const sumberDayaIsi =
    sumberDayaWajib.length === 0 ||
    sumberDayaWajib.every((s) => jawaban.sumberDaya.includes(s));

  if (!sumberDayaIsi) {
    alasan.push("Beberapa aset atau fasilitas yang dibutuhkan usaha ini belum dimiliki.");
  }

  if (alasan.length === 0) {
    return { status: "layak", alasan: ["Semua syarat dasar usaha ini sudah sesuai dengan kondisi Anda."] };
  }

  const adaRintanganPotensial =
    (!modalIsi && modalUser >= ide.modalMin * 0.8) ||
    (!waktuIsi && waktuUser >= waktuMin - 1) ||
    (!keterampilanIsi && ide.cocokPemula) ||
    (!sumberDayaIsi && ide.sumberDayaPendukung.length <= 2);

  return {
    status: adaRintanganPotensial ? "perlu-persiapan" : "tidak-layak",
    alasan,
  };
}

function buatAlasanPersonal(
  ide: IdeUsaha,
  breakdown: BreakdownSkor,
  jawaban: JawabanKuesioner
): string[] {
  const alasan: string[] = [];

  if (breakdown.modal >= 90) {
    alasan.push("Modal Anda sesuai dengan kebutuhan awal usaha ini.");
  } else if (breakdown.modal >= 60) {
    alasan.push("Modal Anda masih cukup dekat dengan kebutuhan usaha ini.");
  } else {
    alasan.push("Modal perlu disesuaikan agar usaha dimulai lebih realistis.");
  }

  if (breakdown.keterampilan >= 90) {
    alasan.push("Keterampilan yang Anda miliki sangat cocok dengan usaha ini.");
  } else if (breakdown.keterampilan >= 60) {
    alasan.push("Sebagian keterampilan Anda sudah mendukung usaha ini.");
  } else {
    alasan.push("Anda mungkin perlu belajar keterampilan tambahan sebelum memulai.");
  }

  if (breakdown.waktu >= 90) {
    alasan.push("Waktu yang Anda miliki cukup untuk menjalankan usaha ini.");
  } else if (breakdown.waktu >= 60) {
    alasan.push("Waktu Anda masih cukup memungkinkan usaha ini berjalan.");
  } else {
    alasan.push("Ketersediaan waktu perlu dikelola agar usaha tidak terlalu berat.");
  }

  if (breakdown.sumberDaya >= 90) {
    alasan.push("Sumber daya yang Anda punya sangat mendukung operasional awal.");
  } else if (breakdown.sumberDaya >= 60) {
    alasan.push("Sebagian sumber daya Anda sudah cukup untuk memulai.");
  }

  if (breakdown.preferensi >= 90) {
    alasan.push("Model kerja usaha ini sesuai dengan gaya Anda.");
  } else if (breakdown.preferensi >= 60) {
    alasan.push("Cara kerja usaha ini cukup sesuai dengan preferensi Anda.");
  }

  return alasan.slice(0, 5);
}

export function hitungKecocokan(jawaban: JawabanKuesioner): HasilPencocokan[] {
  const hasil = ideUsahaList.map((ide) => {
    const modalRaw = scoreModal(ide, jawaban.modal);
    const keterampilanRaw = scoreKeterampilan(ide, jawaban.keterampilan);
    const waktuRaw = scoreWaktu(ide, jawaban.waktu);
    const sumberDayaRaw = scoreSumberDaya(ide, jawaban.sumberDaya);
    const preferensiRaw = scorePreferensi(ide, jawaban.preferensi);

    const breakdown: BreakdownSkor = {
      modal: Math.round(weightedScore(modalRaw, 20)),
      keterampilan: Math.round(weightedScore(keterampilanRaw, 25)),
      waktu: Math.round(weightedScore(waktuRaw, 15)),
      sumberDaya: Math.round(weightedScore(sumberDayaRaw, 20)),
      preferensi: Math.round(weightedScore(preferensiRaw, 10)),
    };

    const skorMentah =
      breakdown.modal +
      breakdown.keterampilan +
      breakdown.waktu +
      breakdown.sumberDaya +
      breakdown.preferensi;

    const { status, alasan } = cekKelayakan(ide, jawaban);
    const gapModalBesar = modalRaw <= 35;
    const skor = gapModalBesar ? Math.max(0, skorMentah - 20) : skorMentah;

    return {
      ide,
      skor: Math.min(100, skor),
      tingkat: getTingkat(Math.min(100, skor)),
      status,
      breakdown,
      alasanPersonal: buatAlasanPersonal(ide, breakdown, jawaban),
      alasanFilter: alasan,
    };
  });

  const layak = hasil.filter((item) => item.status === "layak");
  const perluPersiapan = hasil.filter((item) => item.status === "perlu-persiapan");
  const sisa = [...layak, ...perluPersiapan].sort((a, b) => b.skor - a.skor);

  return sisa.length > 0 ? sisa : hasil.sort((a, b) => b.skor - a.skor);
}

export function getTop3(jawaban: JawabanKuesioner): HasilPencocokan[] {
  return hitungKecocokan(jawaban).slice(0, 3);
}
