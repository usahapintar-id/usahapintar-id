// Pembungkus localStorage yang aman: tidak melempar error saat storage
// diblokir (mode privat, kuota penuh, cookie dinonaktifkan) atau data rusak.

export function bacaJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function simpanJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
