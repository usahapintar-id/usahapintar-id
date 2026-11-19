# Security Specification — CuanKit.id Firestore (Prioritas 2)

## 1. Data Invariants

1. **Isolasi Kepemilikan Mutlak (Zero-Trust Multi-Tenancy)**:
   - Dokumen `users/{userId}` hanya boleh dibaca (`get`), dibuat (`create`), dan diperbarui (`update`) oleh pemilik akun (`request.auth.uid == userId`). `list` pada `users` dilarang mutlak untuk mencegah kebocoran PII (`email`, `businessPhone`, `businessAddress`).
   - Dokumen `invoices/{invoiceId}` hanya boleh dibaca (`get`, `list`), dibuat (`create`), diperbarui (`update`), dan dihapus (`delete`) oleh pemiliknya (`ownerId == request.auth.uid`).
   - Dokumen `transactions/{transactionId}` (Buku Kas Harian) hanya boleh diakses, dibuat, diubah, dan dihapus oleh pemiliknya (`ownerId == request.auth.uid`) dengan validasi `amount > 0`, format tanggal `YYYY-MM-DD`, kategori dibatasi 1..50 karakter, serta `createdAt`/`updatedAt` berbasis `request.time`.
2. **Keamanan Paket & Kuota (Anti-Privilege Escalation)**:
   - Pembuatan profil baru `users/{userId}` wajib memiliki `plan == 'gratis'` dan `invoiceCountThisMonth == 0`.
   - Pengguna tidak boleh mengubah field `plan`, `uid`, `email`, atau `createdAt` miliknya sendiri.
   - Kenaikan kuota nota bulanan (`invoiceCountThisMonth`) harus dilakukan secara berurutan (+1 pada bulan yang sama, atau reset ke 1 jika `invoiceMonthKey` berubah ke bulan baru), dan untuk pengguna `gratis` dibatasi maksimal `15` nota per bulan.
   - Pembuatan dokumen `invoices/{invoiceId}` wajib dilakukan dalam satu transaksi/batch atomik bersama pembaruan kuota pada `users/{ownerId}` (`getAfter`).
3. **Integritas Skema, Anti-Shadow-Field, & Batas Ukuran (Denial of Wallet Guard)**:
   - Setiap ID dokumen (`userId`, `invoiceId`) wajib lolos `isValidId()` (`^[a-zA-Z0-9_\\-]+$`, panjang `1..128`).
   - Semua field string wajib memiliki batas panjang eksplisit (`.size() <= max`), daftar item nota dibatasi `1..25` item dan divalidasi strukturnya.
   - Seluruh timestamp (`createdAt`, `updatedAt`) wajib menggunakan `request.time`.
4. **Action-Based Update & Terminal State Locking**:
   - Dokumen nota dengan `recordStatus == 'batal'` berada dalam status terminal dan tidak dapat diubah lagi.
   - Pembaruan nota dipisahkan berdasarkan aksi yang sah (`edit_detail`, `update_pembayaran`, `batalkan_nota`) dengan daftar `affectedKeys().hasOnly(...)` yang ketat.
5. **Pengguna Terverifikasi untuk Operasi Tulis**:
   - Seluruh operasi `create`, `update`, dan `delete` mewajibkan `request.auth.token.email_verified == true`.

## 2. "Dirty Dozen" Payloads (12 Payload Serangan)

1. **D01 — Self-Upgrade Paket ke Premium**: `create` atau `update` `users/{uid}` dengan `plan: "premium"`. Harus ditolak (`PERMISSION_DENIED`).
2. **D02 — Shadow / Ghost Field Injection**: `create` `invoices/{id}` atau `users/{uid}` menyisipkan field ekstra `isAdmin: true` atau `bypassQuota: true`. Harus ditolak oleh `.keys().hasOnly(...)`.
3. **D03 — ID Poisoning (1.5KB Document ID)**: `create` `/invoices/<1500 karakter>` atau ID berkarakter ilegal `../admin`. Harus ditolak oleh `isValidId()`.
4. **D04 — Identity Spoofing pada Nota**: `create` `invoices/{id}` saat login sebagai `userA` tetapi mengirim `ownerId: "userB"`. Harus ditolak oleh `ownerId == request.auth.uid`.
5. **D05 — Client Timestamp Spoofing**: `create` `invoices/{id}` dengan `createdAt` tanggal palsu di masa lalu/depan (bukan `serverTimestamp()` / `request.time`). Harus ditolak.
6. **D06 — Email Tidak Terverifikasi (`email_verified: false`)**: Aksi tulis dari akun dengan klaim `email_verified == false`. Harus ditolak.
7. **D07 — Blanket List / Scrape PII Users**: Melakukan query `list` pada koleksi `/users` atau `get` pada `/users/{otherUid}`. Harus ditolak.
8. **D08 — Unbounded / Oversized Array Item Nota**: Mengirim `items` dengan `0` elemen atau `26` elemen (melebihi batas `<= 25`), atau elemen pertama bertipe string bukan map. Harus ditolak.
9. **D09 — Bypass Kuota Gratis (Create Nota Tanpa Update Kuota Batch)**: Membuat `/invoices/{id}` langsung tanpa memperbarui `invoiceMonthKey` / `invoiceCountThisMonth` pada `/users/{uid}` secara atomik, atau melewati batas `15` nota pada paket `gratis`. Harus ditolak oleh `getAfter` & quota gate.
10. **D10 — Reset Kuota Bulanan di Bulan yang Sama**: `update` `/users/{uid}` mengubah `invoiceCountThisMonth` dari `15` menjadi `0` tanpa mengganti `invoiceMonthKey`. Harus ditolak.
11. **D11 — Edit Nota Setelah Status Terminal (`batal`)**: `update` `/invoices/{id}` yang sudah memiliki `recordStatus == "batal"` untuk mengubah kembali `recordStatus` ke `"aktif"` atau mengubah `totalAmount`. Harus ditolak oleh terminal state lock.
12. **D12 — Query List Nota Tanpa Filter Pemilik**: User B mencoba `list` `/invoices` milik User A (tanpa filter `where("ownerId", "==", userB)`). Harus ditolak oleh `allow list: if isSignedIn() && existing().ownerId == request.auth.uid`.
