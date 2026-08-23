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

export type TingkatKecocokan = "kuat" | "sedang" | "lemah";

export type HasilPencocokan = {
  ide: IdeUsaha;
  skor: number;
  tingkat: TingkatKecocokan;
};

function getTingkat(skor: number): TingkatKecocokan {
  if (skor >= 65) return "kuat";
  if (skor >= 40) return "sedang";
  return "lemah";
}

export function hitungKecocokan(jawaban: JawabanKuesioner): HasilPencocokan[] {
  const pilihBelumAdaSaja =
    jawaban.keterampilan.length === 1 && jawaban.keterampilan[0] === "belumAda";

  const hasil: HasilPencocokan[] = ideUsahaList.map((ide) => {
    let skor = 0;

    // Modal (bobot 25)
    if (ide.modalCocok.includes(jawaban.modal)) skor += 25;

    // Waktu (bobot 15)
    if (ide.waktuCocok.includes(jawaban.waktu)) skor += 15;

    // Keterampilan (bobot 30) - proporsional, atau bonus pemula
    if (pilihBelumAdaSaja) {
      skor += ide.cocokPemula ? 30 : 8;
    } else {
      const keterampilanOverlap = ide.keterampilanKunci.filter((k) =>
        jawaban.keterampilan.includes(k)
      ).length;
      if (ide.keterampilanKunci.length > 0) {
        skor += (keterampilanOverlap / ide.keterampilanKunci.length) * 30;
      }
    }

    // Sumber daya (bobot 15) - proporsional
    const sumberDayaOverlap = ide.sumberDayaPendukung.filter((s) =>
      jawaban.sumberDaya.includes(s)
    ).length;
    if (ide.sumberDayaPendukung.length > 0) {
      skor += (sumberDayaOverlap / ide.sumberDayaPendukung.length) * 15;
    }

    // Preferensi (bobot 15) - proporsional
    const preferensiOverlap = ide.preferensiCocok.filter((p) =>
      jawaban.preferensi.includes(p)
    ).length;
    if (ide.preferensiCocok.length > 0) {
      skor += (preferensiOverlap / ide.preferensiCocok.length) * 15;
    }

    const persentase = Math.round(skor);
    return { ide, skor: persentase, tingkat: getTingkat(persentase) };
  });

  return hasil.sort((a, b) => b.skor - a.skor);
}

export function getTop3(jawaban: JawabanKuesioner): HasilPencocokan[] {
  return hitungKecocokan(jawaban).slice(0, 3);
}
