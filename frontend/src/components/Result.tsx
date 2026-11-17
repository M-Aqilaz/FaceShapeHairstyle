import { FACE_SHAPES } from "../data";
import type { PredictionResult, Recommendation } from "../types";
import { SectionHead } from "./Landing";

interface Props {
  result: PredictionResult;
  preview: string;
  onReset: () => void;
}

export default function Result({ result, preview, onReset }: Props) {
  const info = FACE_SHAPES[result.face_shape];
  const pct = Math.round(result.confidence);

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <section>
        <SectionHead n="01" title="Hasil Klasifikasi" />
        <div className="glass overflow-hidden">
          <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
            <div className="bg-gradient-to-br from-sky-100 to-cyan-50 p-3 sm:p-4">
              <img src={preview} alt="Foto wajah yang dianalisis" className="h-40 w-full rounded-xl object-cover sm:h-full sm:min-h-[220px]" />
            </div>
            <div className="p-4 sm:p-6">
              <span className="mono">bentuk wajah terdeteksi</span>
              <h2 className="mt-1 text-2xl font-bold text-grad sm:text-3xl">{info.label}</h2>
              <p className="text-[13px] text-cyan-700 sm:text-sm">{info.blurb}</p>

              <div className="mt-4 sm:mt-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="mono shrink-0">confidence score</span>
                  <span className="shrink-0 font-mono text-xl font-medium text-slate-900 sm:text-2xl">{pct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-[width] duration-700"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Confidence score"
                  />
                </div>
                {pct < 60 && (
                  <p className="mt-2 text-xs text-amber-700">
                    Confidence rendah — coba foto lain dengan pencahayaan lebih baik dan wajah menghadap kamera.
                  </p>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">{info.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {info.traits.map((t) => (
                  <li key={t} className="rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs text-sky-800">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHead n="02" title="Rekomendasi Gaya Rambut" />
        <p className="-mt-2 mb-4 text-sm text-slate-600">
          Gaya rambut berikut dipilih untuk menyeimbangkan proporsi wajah <strong className="text-slate-800">{info.label}</strong>.
          {!result.recommendationsFromBackend && <span className="ml-1 text-xs text-slate-500">(sumber: katalog lokal)</span>}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.recommendations.map((r, i) => (
            <RecCard key={`${r.name}-${i}`} rec={r} index={i} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onReset}
          className="min-h-12 flex-1 rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 sm:text-base"
        >
          Klasifikasi Ulang
        </button>
      </div>
    </div>
  );
}

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  return (
    <article className="glass glass-hover overflow-hidden">
      <div className="grid h-24 place-items-center bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 sm:h-28">
        {rec.image_url ? (
          <img src={rec.image_url} alt={`Referensi gaya ${rec.name}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          /* ponytail: placeholder gradien sampai aset/jumlah gambar dari backend tersedia */
          <span className="mono">{String(index + 1).padStart(2, "0")}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{rec.name}</h3>
        {rec.description && <p className="mt-1 text-sm text-slate-600">{rec.description}</p>}
        {rec.reason && (
          <p className="mt-2 flex gap-2 text-xs text-cyan-800">
            <span aria-hidden="true">↳</span>
            {rec.reason}
          </p>
        )}
      </div>
    </article>
  );
}
