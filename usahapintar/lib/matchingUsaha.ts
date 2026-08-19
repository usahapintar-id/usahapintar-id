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

export type HasilPencocokan = {
  ide: IdeUsaha;
  skor: number;
};

export function hitungKecocokan(jawaban: JawabanKuesioner): HasilPencocokan[] {
  const hasil: HasilPencocokan[] = ideUsahaList.map((ide) => {
    let skor = 0;
    let maksimalSkor = 0;

    // Modal (bobot 30)
    maksimalSkor += 30;
    if (ide.modalCocok.includes(jawaban.modal)) skor += 30;

    // Waktu (bobot 20)
    maksimalSkor += 20;
    if (ide.waktuCocok.includes(jawaban.waktu)) skor += 20;

    // Keterampilan (bobot 30) - proporsional dengan overlap
    maksimalSkor += 30;
    const keterampilanOverlap = ide.keterampilanKunci.filter((k) =>
      jawaban.keterampilan.includes(k)
    ).length;
    if (ide.keterampilanKunci.length > 0) {
      skor += (keterampilanOverlap / ide.keterampilanKunci.length) * 30;
    }

    // Sumber daya (bobot 10)
    maksimalSkor += 10;
    const sumberDayaOverlap = ide.sumberDayaPendukung.filter((s) =>
      jawaban.sumberDaya.includes(s)
    ).length;
    if (ide.sumberDayaPendukung.length > 0 && sumberDayaOverlap > 0) {
      skor += 10;
    }

    // Preferensi (bobot 10)
    maksimalSkor += 10;
    const preferensiOverlap = ide.preferensiCocok.filter((p) =>
      jawaban.preferensi.includes(p)
    ).length;
    if (preferensiOverlap > 0) {
      skor += 10;
    }

    const persentase = Math.round((skor / maksimalSkor) * 100);
    return { ide, skor: persentase };
  });

  return hasil.sort((a, b) => b.skor - a.skor);
}

export function getTop3(jawaban: JawabanKuesioner): HasilPencocokan[] {
  return hitungKecocokan(jawaban).slice(0, 3);
}
