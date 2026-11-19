/**
 * Test suite spesifikasi keamanan Firestore Rules (Dirty Dozen Payloads D01-D12).
 * Dirancang untuk dijalankan dengan @firebase/rules-unit-testing bila emulator tersedia,
 * serta memvalidasi kontrak skema aturan keamanan CuanKit.id.
 */

export interface SecurityTestCase {
  id: string;
  title: string;
  collection: "users" | "invoices";
  operation: "create" | "update" | "get" | "list" | "delete";
  expected: "PERMISSION_DENIED" | "ALLOW";
  payload?: Record<string, unknown>;
  reason: string;
}

export const dirtyDozenCases: SecurityTestCase[] = [
  {
    id: "D01",
    title: "Self-upgrade plan menjadi premium pada registrasi/update user",
    collection: "users",
    operation: "create",
    expected: "PERMISSION_DENIED",
    payload: {
      uid: "user-a",
      displayName: "Budi",
      email: "budi@example.com",
      businessName: "Warung Budi",
      businessPhone: "",
      businessAddress: "",
      businessLogoData: "",
      plan: "premium",
      invoiceMonthKey: "2026-11",
      invoiceCountThisMonth: 0,
    },
    reason: "Registrasi wajib plan == 'gratis' dan update plan dilarang untuk klien.",
  },
  {
    id: "D02",
    title: "Shadow / ghost field injection (isAdmin / bypassQuota)",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    payload: {
      ownerId: "user-a",
      isAdmin: true,
    },
    reason: "Ditolak oleh data.keys().hasOnly([...]).",
  },
  {
    id: "D03",
    title: "Document ID poisoning (> 128 karakter atau karakter ilegal)",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh isValidId(invoiceId).",
  },
  {
    id: "D04",
    title: "Identity spoofing ownerId milik pengguna lain",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    payload: {
      ownerId: "user-b",
    },
    reason: "Ditolak oleh data.ownerId == request.auth.uid.",
  },
  {
    id: "D05",
    title: "Client timestamp spoofing pada createdAt",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh incoming().createdAt == request.time.",
  },
  {
    id: "D06",
    title: "Penulisan dari akun email_verified == false",
    collection: "users",
    operation: "create",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh isVerifiedUser() (request.auth.token.email_verified == true).",
  },
  {
    id: "D07",
    title: "Blanket list koleksi users untuk mencuri PII",
    collection: "users",
    operation: "list",
    expected: "PERMISSION_DENIED",
    reason: "allow list dilarang sepenuhnya pada koleksi users.",
  },
  {
    id: "D08",
    title: "Array items kosong (0) atau melebihi batas (> 25) atau tipe tidak valid",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh items.size() >= 1 && items.size() <= 25 && isValidInvoiceItem(items[0]).",
  },
  {
    id: "D09",
    title: "Membuat nota melebihi kuota gratis (15/bulan) atau tanpa update kuota batch",
    collection: "invoices",
    operation: "create",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh validasi atomik getAfter() pada /users/{uid}.",
  },
  {
    id: "D10",
    title: "Mereset invoiceCountThisMonth menjadi 0 di bulan yang sama",
    collection: "users",
    operation: "update",
    expected: "PERMISSION_DENIED",
    reason: "Kenaikan kuota pada invoiceMonthKey yang sama wajib existing + 1.",
  },
  {
    id: "D11",
    title: "Mengubah nota yang sudah berstatus terminal 'batal'",
    collection: "invoices",
    operation: "update",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh terminal state lock existing().recordStatus != 'batal'.",
  },
  {
    id: "D12",
    title: "Query list invoices tanpa filter kepemilikan ownerId == request.auth.uid",
    collection: "invoices",
    operation: "list",
    expected: "PERMISSION_DENIED",
    reason: "Ditolak oleh allow list: if isSignedIn() && existing().ownerId == request.auth.uid.",
  },
];
