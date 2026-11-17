# FaceShape AI — Frontend

React + TypeScript + Vite + Tailwind CSS v4 untuk klasifikasi bentuk wajah & rekomendasi gaya rambut.
Seluruh preprocessing (HOG) dan klasifikasi dilakukan backend; frontend hanya UI + pemanggilan API.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173 (proxy /api → http://127.0.0.1:8000)
npm run build      # tsc --noEmit && vite build → dist/
npm run preview
```

Backend lain? `VITE_PROXY_TARGET=http://host:port npm run dev`, atau bangun dengan `VITE_API_BASE=https://api.example.com npm run build`.

## Struktur

```
src/
  App.tsx                 state machine: landing → upload → processing → result
  data.ts                 SEMUA teks, deskripsi bentuk wajah, katalog rekomendasi cadangan
  types.ts                FaceShape, PredictionResult, Recommendation
  lib/api.ts              predict() + fetchRecommendations() + normalisasi respons
  components/
    Landing.tsx           hero, kategori bentuk wajah, panduan foto
    Uploader.tsx          KAMERA sebagai metode utama (auto-open dari CTA), unggah file sekunder
    Processing.tsx        indikator loading + tahap proses
    Result.tsx            bentuk wajah, confidence bar, keterangan, kartu rekomendasi
```

Alur: tombol "Mulai Klasifikasi" langsung membuka kamera; unggah file tetap tersedia di bawahnya.
Bila kamera tidak tersedia/ditolak, pengguna diarahkan ke unggah gambar.

## Kontrak API yang diharapkan

`POST /api/analysis/predict` — `multipart/form-data`, field `file`.

```json
{ "face_shape": "Oval", "confidence": 0.95 }
```

Diterima juga bentuk alternatif: `faceShape`, `shape`, `predicted_class`, `class`, `label`,
`confidence_score`, `score`, `probability`; `confidence` boleh `0.95` atau `95`; bentuk `oblong`,
`long`, `rectangle` dipetakan ke `oblong`; boleh dibungkus `{ "data": ... }` / `{ "result": ... }`.
`recommendations` / `styles` boleh ikut di respons prediksi.

`GET /api/recommendations/{face_shape}`

```json
{ "face_shape": "oval",
  "recommendations": [
    { "name": "Side Part", "description": "...", "reason": "...", "image_url": "..." }
  ] }
```

Bila endpoint tidak tersedia, frontend memakai katalog lokal di `data.ts` dan menandainya
"(sumber: katalog lokal)" pada halaman hasil.

## Batasan validasi klien

JPEG/PNG, maks 8 MB (`MAX_BYTES`, `ACCEPTED` di `src/data.ts`). Validasi sebenarnya tetap di backend.
