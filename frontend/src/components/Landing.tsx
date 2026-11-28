import { useState } from "react";
import { APP, FACE_SHAPES, SHAPE_KEYS, TIPS } from "../data";
import type { FaceShape } from "../types";

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  const [activeShape, setActiveShape] = useState<FaceShape>("oval");
  const previewShape = FACE_SHAPES[activeShape];
  const topRec = previewShape.fallback[0];

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* Hero */}
      <section id="beranda" className="relative pt-2 sm:pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-slate-600 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
              HOG + Machine Learning
            </span>

            <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[52px]">
              Temukan <span className="text-sky-700">bentuk wajah</span> Anda, pilih gaya rambut yang tepat.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {APP.tagline} {APP.intro}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={onStart}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Mulai Klasifikasi
                <span aria-hidden="true">→</span>
              </button>
              <a
                href="#kategori"
                className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Kategori Bentuk Wajah
              </a>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200/90 pt-6">
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">6 Kategori</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">Bentuk Wajah</p>
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">HOG + ML</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">Ekstraksi Fitur</p>
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Privasi</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">Foto Tidak Disimpan</p>
              </div>
            </div>
          </div>

          {/* Right column: Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xl shadow-slate-200/60">
              <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-sky-50/60 p-4 sm:p-5">
                {/* Top status bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-widest text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    HOG + ML Preview
                  </span>
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white">
                    {previewShape.label}
                  </span>
                </div>

                {/* Biometric proportion illustration */}
                <div className="relative my-5 flex h-44 items-center justify-center sm:h-48">
                  <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
                  <div className="relative flex flex-col items-center">
                    <FaceGlyph shape={activeShape} size="lg" />
                    <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-sky-700">
                      <span>{previewShape.blurb}</span>
                    </div>
                  </div>
                </div>

                {/* Floating recommendation overlay */}
                <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3.5 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[9.5px] uppercase tracking-widest text-sky-700">
                        Contoh Rekomendasi
                      </p>
                      <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
                        {topRec?.name ?? "Side Part"}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {topRec?.reason}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-sky-700 px-2.5 py-1.5 text-center font-mono text-[10px] font-medium uppercase tracking-wider text-white">
                      {previewShape.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive shape selector tabs */}
              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {SHAPE_KEYS.map((key) => {
                  const isActive = key === activeShape;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveShape(key)}
                      className={`rounded-lg px-2 py-1.5 font-mono text-[9.5px] uppercase tracking-wider transition ${
                        isActive
                          ? "bg-slate-900 font-semibold text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panduan foto */}
      <section id="panduan" className="scroll-mt-20">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-widest text-sky-700">
              02 · Panduan Foto
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Panduan Foto yang Baik
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
            Pastikan foto memenuhi kriteria berikut agar ekstraksi fitur HOG membaca proporsi wajah secara optimal.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t, i) => (
            <div
              key={t}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-sky-100 bg-sky-50 text-sm font-semibold text-sky-700">
                    ✓
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Tip {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">{t}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori bentuk wajah */}
      <section id="kategori" className="scroll-mt-20">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-widest text-sky-700">
              01 · Kategori Bentuk Wajah
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Kategori Bentuk Wajah
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
            Kenali ciri khas 6 kategori bentuk wajah yang diklasifikasikan oleh Hairmory.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHAPE_KEYS.map((key, i) => {
            const info = FACE_SHAPES[key];
            return (
              <article
                key={key}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Top visual frame */}
                  <div className="relative flex h-28 items-center justify-between overflow-hidden rounded-xl border border-slate-100 bg-slate-50 px-5">
                    <div className="flex flex-col justify-between self-stretch py-3.5">
                      <span className="inline-block w-fit rounded-md border border-slate-200/80 bg-white px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-widest text-slate-600">
                        Bentuk {info.label}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <FaceGlyph shape={key} />
                  </div>

                  {/* Title & blurb */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">{info.label}</h3>
                    <p className="mt-0.5 text-xs font-medium text-sky-700">{info.blurb}</p>
                  </div>

                  {/* Traits box */}
                  <ul className="mt-3.5 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-600">
                    {info.traits.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="truncate font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {info.fallback[0]?.name}
                  </span>
                  <button
                    type="button"
                    onClick={onStart}
                    className="inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-700 transition hover:text-sky-700"
                  >
                    Coba Sekarang <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section>
        <div className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-sky-100/85 px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-200/50" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-200/40" />

          <div className="relative mx-auto max-w-xl">
            <span className="inline-block rounded-full border border-sky-200 bg-white/85 px-3.5 py-1 font-mono text-[10px] uppercase tracking-widest text-sky-800">
              Tanpa instalasi · Foto tidak disimpan
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Mulai Klasifikasi Sekarang
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {APP.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStart}
                className="min-h-12 rounded-lg bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Mulai Klasifikasi Sekarang
              </button>
              <a
                href="#panduan"
                className="inline-flex min-h-12 items-center rounded-lg border border-slate-300/80 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
              >
                Panduan Foto
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
      <span className="mono">{n}</span>
      <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">{title}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-cyan-300 to-transparent" />
    </div>
  );
}

function FaceGlyph({ shape, size = "sm" }: { shape: string; size?: "sm" | "lg" }) {
  const shapes: Record<string, string> = {
    oval: "M18 4a14 18 0 1 0 .01 0Z",
    round: "M18 4a14 14 0 1 0 .01 0Z",
    square: "M6 6h24v24H6z",
    heart: "M18 34 4 16a8 8 0 0 1 14-8 8 8 0 0 1 14 8z",
    oblong: "M10 4a8 18 0 1 0 .01 0Z",
    diamond: "M18 3 32 18 18 33 4 18Z",
  };
  const cls =
    size === "lg"
      ? "floaty h-24 w-24 text-sky-600/85 sm:h-28 sm:w-28"
      : "floaty h-12 w-12 text-sky-600/80 sm:h-14 sm:w-14";

  return (
    <svg viewBox="0 0 36 36" className={cls} aria-hidden="true">
      <path
        d={shapes[shape] ?? shapes.oval}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
