// Service worker CuanKit: konservatif, tidak menyimpan halaman atau data pengguna.
// Fungsinya: memenuhi syarat pemasangan aplikasi dan menampilkan halaman offline
// bila perangkat tidak punya koneksi. Semua halaman lain selalu diambil dari jaringan,
// jadi pengguna tidak akan melihat versi lama setelah situs diperbarui.
const VERSI = "cuankit-pwa-v1";
const HALAMAN_OFFLINE = "/offline.html";
const ASET_OFFLINE = [HALAMAN_OFFLINE, "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSI).then((cache) => cache.addAll(ASET_OFFLINE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nama) => Promise.all(nama.filter((n) => n !== VERSI).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(HALAMAN_OFFLINE)));
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin && ASET_OFFLINE.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((hasil) => hasil || fetch(request)));
  }
});
