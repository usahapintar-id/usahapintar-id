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
  breakdown: BreakdownSkor;
  alasanPersonal: string[];
};

function getTingkat(skor: number): TingkatKecocokan {
  if (skor >= 90) return "sangat-cocok";
  if (skor >= 80) return "cocok";
  if (skor >= 70) return "cukup-cocok";
  if (skor >= 60) return "perlu-dipertimbangkan";
  return "kurang-cocok";
}

/**
 * Mengubah skor 0-100 menjadi skor berbobot.
 */
function weightedScore(
  score: number,
  weight: number
): number {
  return (score / 100) * weight;
}

/**
 * Skor kecocokan modal.
 * Tidak lagi hanya cocok/tidak cocok.
 */
function scoreModal(
  ide: IdeUsaha,
  modal: ModalRange
): number {
  if (ide.modalCocok.includes(modal)) return 100;

  const urutan: ModalRange[] = [
    "kecil",
    "sedang",
    "besar",
    "sangatBesar",
  ];

  const target = urutan.indexOf(modal);

  if (target === -1) return 0;

  const jarak = Math.min(
    ...ide.modalCocok.map((m) =>
      Math.abs(urutan.indexOf(m) - target)
    )
  );

  if (jarak === 1) return 65;
  if (jarak === 2) return 35;

  return 15;
}

/**
 * Skor waktu.
 */
function scoreWaktu(
  ide: IdeUsaha,
  waktu: Waktu
): number {
  if (ide.waktuCocok.includes(waktu)) return 100;

  const urutan: Waktu[] = [
    "sampingan",
    "paruhWaktu",
    "penuhWaktu",
  ];

  const target = urutan.indexOf(waktu);

  const jarak = Math.min(
    ...ide.waktuCocok.map((w) =>
      Math.abs(urutan.indexOf(w) - target)
    )
  );

  if (jarak === 1) return 60;
  if (jarak === 2) return 30;

  return 10;
}

/**
 * Skor keterampilan.
 */
function scoreKeterampilan(
  ide: IdeUsaha,
  keterampilan: Keterampilan[]
): number {
  const pilihBelumAdaSaja =
    keterampilan.length === 1 &&
    keterampilan[0] === "belumAda";

  if (pilihBelumAdaSaja) {
    return ide.cocokPemula ? 100 : 35;
  }

  if (ide.keterampilanKunci.length === 0) {
    return 70;
  }

  const overlap = ide.keterampilanKunci.filter((k) =>
    keterampilan.includes(k)
  ).length;

  if (overlap === 0) return 20;

  return Math.min(
    100,
    Math.round(
      (overlap / ide.keterampilanKunci.length) * 100
    )
  );
}

/**
 * Skor sumber daya.
 */
function scoreSumberDaya(
  ide: IdeUsaha,
  sumberDaya: SumberDaya[]
): number {
  if (sumberDaya.includes("tidakAda")) {
    return ide.sumberDayaPendukung.length === 0
      ? 100
      : 60;
  }

  if (ide.sumberDayaPendukung.length === 0) {
    return 80;
  }

  const overlap = ide.sumberDayaPendukung.filter((s) =>
    sumberDaya.includes(s)
  ).length;

  if (overlap === 0) return 25;

  return Math.min(
    100,
    Math.round(
      (overlap / ide.sumberDayaPendukung.length) * 100
    )
  );
}

/**
 * Skor preferensi.
 */
function scorePreferensi(
  ide: IdeUsaha,
  preferensi: Preferensi[]
): number {
  if (ide.preferensiCocok.length === 0) {
    return 70;
  }

  const overlap = ide.preferensiCocok.filter((p) =>
    preferensi.includes(p)
  ).length;

  if (overlap === 0) return 25;

  return Math.min(
    100,
    Math.round(
      (overlap / ide.preferensiCocok.length) * 100
    )
  );
}

/**
 * Membuat alasan yang benar-benar berdasarkan
 * jawaban pengguna.
 */
function buatAlasanPersonal(
  ide: IdeUsaha,
  breakdown: BreakdownSkor,
  jawaban: JawabanKuesioner
): string[] {
  const alasan: string[] = [];

  if (breakdown.modal >= 90) {
    alasan.push(
      "Modal Anda sangat sesuai dengan kebutuhan awal usaha ini."
    );
  } else if (breakdown.modal >= 60) {
    alasan.push(
      "Modal Anda masih cukup dekat dengan kebutuhan usaha ini."
    );
  } else {
    alasan.push(
      "Modal perlu disesuaikan atau usaha dimulai dalam skala lebih kecil."
    );
  }

  if (breakdown.keterampilan >= 90) {
    alasan.push(
      "Keterampilan yang Anda miliki sangat mendukung usaha ini."
    );
  } else if (breakdown.keterampilan >= 60) {
    alasan.push(
      "Sebagian keterampilan Anda sudah sesuai dengan kebutuhan usaha ini."
    );
  } else {
    alasan.push(
      "Anda mungkin perlu belajar keterampilan tambahan sebelum memulai."
    );
  }

  if (breakdown.waktu >= 90) {
    alasan.push(
      "Waktu yang tersedia sangat sesuai dengan kebutuhan operasional usaha."
    );
  } else if (breakdown.waktu >= 60) {
    alasan.push(
      "Waktu yang Anda miliki masih cukup memungkinkan usaha ini dijalankan."
    );
  } else {
    alasan.push(
      "Ketersediaan waktu perlu diperhatikan karena usaha ini membutuhkan pengelolaan yang lebih konsisten."
    );
  }

  if (breakdown.sumberDaya >= 90) {
    alasan.push(
      "Sumber daya yang sudah Anda miliki dapat langsung mendukung usaha ini."
    );
  } else if (breakdown.sumberDaya >= 60) {
    alasan.push(
      "Sebagian sumber daya yang Anda miliki dapat dimanfaatkan untuk memulai usaha."
    );
  }

  if (breakdown.preferensi >= 90) {
    alasan.push(
      "Model kerja usaha ini sangat sesuai dengan cara kerja yang Anda sukai."
    );
  } else if (breakdown.preferensi >= 60) {
    alasan.push(
      "Cara kerja usaha ini cukup sesuai dengan preferensi Anda."
    );
  }

  return alasan.slice(0, 5);
}

export function hitungKecocokan(
  jawaban: JawabanKuesioner
): HasilPencocokan[] {
  const hasil: HasilPencocokan[] =
    ideUsahaList.map((ide) => {
      const modalRaw = scoreModal(
        ide,
        jawaban.modal
      );

      const keterampilanRaw =
        scoreKeterampilan(
          ide,
          jawaban.keterampilan
        );

      const waktuRaw = scoreWaktu(
        ide,
        jawaban.waktu
      );

      const sumberDayaRaw =
        scoreSumberDaya(
          ide,
          jawaban.sumberDaya
        );

      const preferensiRaw =
        scorePreferensi(
          ide,
          jawaban.preferensi
        );

      const breakdown: BreakdownSkor = {
        modal: Math.round(
          weightedScore(modalRaw, 25)
        ),

        keterampilan: Math.round(
          weightedScore(keterampilanRaw, 30)
        ),

        waktu: Math.round(
          weightedScore(waktuRaw, 15)
        ),

        sumberDaya: Math.round(
          weightedScore(sumberDayaRaw, 15)
        ),

        preferensi: Math.round(
          weightedScore(preferensiRaw, 15)
        ),
      };

      const skor = Math.min(
        100,
        breakdown.modal +
          breakdown.keterampilan +
          breakdown.waktu +
          breakdown.sumberDaya +
          breakdown.preferensi
      );

      const tingkat = getTingkat(skor);

      return {
        ide,
        skor,
        tingkat,
        breakdown,
        alasanPersonal:
          buatAlasanPersonal(
            ide,
            breakdown,
            jawaban
          ),
      };
    });

  return hasil.sort(
    (a, b) => b.skor - a.skor
  );
}

export function getTop3(
  jawaban: JawabanKuesioner
): HasilPencocokan[] {
  return hitungKecocokan(jawaban).slice(0, 3);
}
}

export function getTop3(jawaban: JawabanKuesioner): HasilPencocokan[] {
  return hitungKecocokan(jawaban).slice(0, 3);
}
