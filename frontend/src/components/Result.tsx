import { useState } from "react";
import { FACE_SHAPES } from "../data";
import type { PredictionResult, Recommendation } from "../types";

interface Props {
  result: PredictionResult;
  preview: string;
  onReset: () => void;
}

export default function Result({ result, preview, onReset }: Props) {
  const info = FACE_SHAPES[result.face_shape];
  const pct = Math.round(result.confidence);
  const [topRec, ...otherRecs] = result.recommendations;

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header Laporan */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-sky-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
              Hasil Analisis
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              HOG + Machine Learning · Klasifikasi Selesai
            </span>
          </div>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Laporan Analisis Bentuk Wajah Anda
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Bentuk wajah terdeteksi: <strong className="text-slate-900">{info.label}</strong> · Confidence{" "}
            <strong className="font-mono text-slate-900">{pct}%</strong>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
          >
            Klasifikasi Ulang
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800"
          >
            Cetak Hasil
          </button>
        </div>
      </div>

      {/* Section 01: Kartu Utama Hasil Klasifikasi */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Kiri: Foto wajah + Overlay Confidence */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img
                src={preview}
                alt="Foto wajah yang dianalisis"
                className="aspect-[4/5] max-h-[440px] w-full object-cover"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-widest text-slate-500">
                    Confidence Score
                  </p>
                  <p className="font-mono text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                    {pct}%
                  </p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    pct < 60
                      ? "bg-amber-100 text-amber-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {pct < 60 ? "Confidence Rendah" : "Terdeteksi"}
                </span>
              </div>
            </div>
          </div>

          {/* Kanan: Detail Bentuk Wajah & Ciri */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-sky-700">
                01 · Tipe Wajah Teridentifikasi
              </span>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {info.label}
              </h2>
              <p className="mt-0.5 text-sm font-medium text-slate-500">({info.blurb})</p>

              {/* Trait Pills */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {info.traits.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {t}
                  </li>
                ))}
                <li className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-medium text-sky-800">
                  HOG + SVM
                </li>
              </ul>

              {/* Kotak Deskripsi */}
              <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/75 p-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Catatan Analisis Bentuk Wajah
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                  {result.description || info.description}
                </p>
              </div>

              {pct < 60 && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                  Confidence rendah — coba foto lain dengan pencahayaan lebih baik dan wajah menghadap lurus ke kamera.
                </p>
              )}
            </div>

            {/* Confidence Progress Bar */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Tingkat Keyakinan Model
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">{pct}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-700 to-cyan-500 transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Confidence score"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Rekomendasi Gaya Rambut */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-2 sm:mb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-widest text-sky-700">
              02 · Kurasi Gaya Rambut
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Rekomendasi Gaya Rambut
            </h2>
          </div>
          <p className="text-xs text-slate-500 sm:text-right sm:text-sm">
            Dipilih untuk menyeimbangkan proporsi wajah <strong className="text-slate-800">{info.label}</strong>.
            {!result.recommendationsFromBackend && (
              <span className="ml-1 text-xs text-slate-400">(katalog lokal)</span>
            )}
          </p>
        </div>

        {/* Pilihan Utama (Kartu Besar) */}
        {topRec && <FeaturedRecCard rec={topRec} />}

        {/* Rekomendasi Lainnya */}
        {otherRecs.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {otherRecs.map((r, i) => (
              <CompactRecCard key={`${r.name}-${i + 1}`} rec={r} index={i + 1} />
            ))}
          </div>
        )}
      </section>

      {/* Banner Aksi Gelap */}
      <section className="rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-sm sm:px-8 print:hidden">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
              Langkah Selanjutnya
            </span>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              Ingin Mencoba Foto Lain?
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              Ambil ulang foto atau unggah gambar dengan pencahayaan berbeda untuk membandingkan hasil klasifikasi.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-wrap gap-2.5 sm:w-auto">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 transition hover:bg-slate-100 sm:flex-none"
            >
              Klasifikasi Ulang
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-100 transition hover:bg-slate-700 sm:flex-none"
            >
              Cetak Hasil
            </button>
          </div>
        </div>
      </section>

      {/* 3 Kartu Info Ringkas */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-sky-100 bg-sky-50 font-mono text-xs font-bold text-sky-700">
            01
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Ekstraksi Fitur HOG</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Membaca pola gradien kontur dahi, tulang pipi, dan garis rahang dari foto wajah.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-sky-100 bg-sky-50 font-mono text-xs font-bold text-sky-700">
            02
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Klasifikasi Machine Learning</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Model SVM memprediksi kategori bentuk wajah beserta tingkat keyakinannya.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-sky-100 bg-sky-50 font-mono text-xs font-bold text-sky-700">
            03
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Privasi Terjaga</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Foto hanya digunakan selama proses klasifikasi dan tidak disimpan permanen.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeaturedRecCard({ rec }: { rec: Recommendation }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="grid lg:grid-cols-12">
        <div className="relative flex min-h-[210px] items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-50 to-slate-100 lg:col-span-5">
          {rec.image_url && !imgError ? (
            <img
              src={rec.image_url}
              alt={`Referensi gaya ${rec.name}`}
              className="h-full max-h-[280px] w-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-mono text-3xl font-bold tracking-widest text-sky-700/40">01</span>
          )}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
              Pilihan Utama
            </span>
            <span className="rounded-md bg-sky-700 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
              #1
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-7">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {rec.name}
            </h3>
            {rec.description && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{rec.description}</p>
            )}
          </div>

          {rec.reason && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/90 p-3.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-sky-700">
                Alasan Kecocokan
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                {rec.reason}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CompactRecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition hover:border-slate-300 hover:shadow-md">
      <div className="relative flex w-28 shrink-0 items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-50 to-slate-100 sm:w-36">
        {rec.image_url && !imgError ? (
          <img
            src={rec.image_url}
            alt={`Referensi gaya ${rec.name}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-mono text-xl font-bold text-sky-700/45">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="pointer-events-none absolute left-2 top-2 rounded bg-sky-700 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
          #{index + 1}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-widest text-slate-400">
            Rekomendasi #{index + 1}
          </p>
          <h3 className="mt-0.5 text-base font-bold tracking-tight text-slate-900">{rec.name}</h3>
          {rec.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{rec.description}</p>
          )}
        </div>

        {rec.reason && (
          <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 text-[11px] leading-relaxed text-slate-700">
            <span className="font-semibold text-sky-800">Cocok karena:</span> {rec.reason}
          </p>
        )}
      </div>
    </article>
  );
}
