# FaceShapeHairstyle

Sistem Klasifikasi Bentuk Wajah & Rekomendasi Gaya Rambut berbasis Machine Learning (HOG + SVM) dan Web Application (FastAPI + React).

---

## Arsitektur Sistem

```
FaceShapeHairstyle/
├── backend/                  # Server REST API (FastAPI + scikit-learn + scikit-image)
│   ├── app/
│   │   ├── api/routes.py     # Endpoints: /upload, /analysis/predict, /recommendations
│   │   ├── services/
│   │   │   ├── image_service.py          # Validasi & preprocessing gambar
│   │   │   ├── feature_service.py        # Ekstraksi fitur HOG (skimage)
│   │   │   ├── model_service.py          # Klasifikasi SVM & kalkulasi confidence
│   │   │   └── recommendation_service.py # Mapping 5 kategori bentuk wajah & rekomendasi
│   │   ├── config.py         # Konfigurasi sistem & batas ukuran file
│   │   └── main.py           # Inisialisasi FastAPI & CORS middleware
│   ├── models/               # Model artifact (.pkl)
│   ├── tests/                # Test suite pytest
│   ├── requirements.txt
│   └── run.py                # Script runner backend
│
└── frontend/                 # Client UI (React + TypeScript + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/       # Landing, Uploader, Processing, Result
    │   ├── lib/api.ts        # Client API caller & normalizer
    │   ├── data.ts           # Katalog konten & fallback
    │   └── App.tsx           # State machine flow
    └── vite.config.ts        # Dev server proxy (/api -> http://127.0.0.1:8000)
```

---

## Panduan Menjalankan

### 1. Menjalankan Backend (Port 8000)

```bash
# Pastikan dependensi terpasang
pip install -r backend/requirements.txt

# Jalankan server
python backend/run.py
```
Server backend akan aktif di `http://127.0.0.1:8000` dengan Swagger docs di `http://127.0.0.1:8000/docs`.

### 2. Menjalankan Frontend (Port 5173)

```bash
cd frontend
npm install
npm run dev
```
Buka browser di `http://localhost:5173`. Frontend secara otomatis mem-proxy semua request `/api/*` ke backend `http://127.0.0.1:8000`.

### 3. Menjalankan Pengujian (Testing)

```bash
python -m pytest backend/tests/test_api.py -v
```

---

## Dataset

Dataset training (ZIP, 6 kelas) disimpan di Google Drive dan tidak disertakan di repository:

[Unduh dataset dari Google Drive](https://drive.google.com/drive/folders/1WR0Q5FObxYFLENd2W177GlChr94WNCqN?usp=sharing)

Unduh lalu ekstrak dataset ke folder `FaceShapeDataset/` di root repository. Folder dataset dan file ZIP diabaikan oleh Git.

---

## Referensi Jurnal

Jurnal terkait klasifikasi bentuk wajah, dikelompokkan berdasarkan kategori yang diteliti:

### Laki-Laki

1. [https://doi.org/10.37012/jtik.v9i1.1622](https://doi.org/10.37012/jtik.v9i1.1622)
2. [https://doi.org/10.33364/algoritma/v.21-2.2134](https://doi.org/10.33364/algoritma/v.21-2.2134)
3. [https://doi.org/10.62951/repeater.v2i3.139](https://doi.org/10.62951/repeater.v2i3.139)

### Perempuan

1. [https://doi.org/10.33998/processor.2026.21.2.2930](https://doi.org/10.33998/processor.2026.21.2.2930)
2. [https://doi.org/10.30829/algoritma.v9i2.26763](https://doi.org/10.30829/algoritma.v9i2.26763)

---

## Kontrak API Backend

| Method | Endpoint | Deskripsi | Input | Output Utama |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Cek status server & kesiapan model | - | `{"status": "ok", "model_ready": true}` |
| `POST` | `/api/upload` | Validasi format file & ukuran | `multipart/form-data` (`file`) | Metadata file & status validasi |
| `POST` | `/api/analysis/predict` | Pipeline lengkap: upload, ekstraksi HOG, klasifikasi model, rekomendasi | `multipart/form-data` (`file`) | `face_shape`, `confidence`, `recommendations` |
| `GET` | `/api/recommendations/{shape}` | Katalog rekomendasi gaya rambut | Path parameter: `oval`, `round`, `square`, `heart`, `oblong` | Detail bentuk wajah, ciri-ciri, daftar gaya rambut |
