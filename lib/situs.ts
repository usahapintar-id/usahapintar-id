// Informasi kontak publik situs. Ubah di sini, semua halaman ikut berubah.
export const EMAIL_KONTAK = "cuankitadmin@gmail.com";
export const mailtoKontak = (subjek: string) => `mailto:${EMAIL_KONTAK}?subject=${encodeURIComponent(subjek)}`;
