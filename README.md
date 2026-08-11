# pipilines-rm-funding

Demo mobile-first untuk monitoring pipeline, kunjungan harian, bukti foto, dan manajemen data RM Funding BRI Jatinegara.

## Fitur demo

- dashboard pipeline dan kinerja RM Funding;
- pencatatan kunjungan dari mobile web;
- unggah bukti foto dan status review atasan;
- tampilan berdasarkan peran RM, Lead RM, Pemimpin Cabang, dan Super Admin;
- kalkulator kapasitas foto, backup, retensi, dan penghapusan terkendali;
- simulasi login email, CAPTCHA, dan OTP.

Demo ini masih frontend-only. Unggah foto, OTP, penyimpanan database, backup, dan penghapusan data belum terhubung ke layanan produksi.

## Menjalankan secara lokal

Prasyarat: Node.js 22.13 atau yang lebih baru.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build untuk Vercel

```bash
npm run build
npm run start
```

Repository dapat dihubungkan langsung ke Vercel dengan framework preset **Next.js**. Vercel akan menggunakan `npm install` dan `npm run build` secara otomatis.

## Catatan penyimpanan produksi

- Metadata kunjungan dan pipeline disimpan pada database relasional.
- Foto disimpan pada private object storage, bukan di dalam tabel database.
- Foto dikompresi di perangkat sebelum upload: WebP, sisi terpanjang 1.600 px, target 400 KB dan maksimal 1 MB.
- Penghapusan data memerlukan backup tervalidasi, persetujuan ganda, dan masa pemulihan.

## Build alternatif untuk OpenAI Sites

Konfigurasi Vinext lama tetap tersedia sebagai opsi tambahan:

```bash
npm run sites:dev
npm run sites:build
```
