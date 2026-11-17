import { APP, FACE_SHAPES, SHAPE_KEYS, TIPS } from "../data";

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Hero */}
      <section className="relative pt-1 sm:pt-4">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mono inline-block whitespace-nowrap rounded-full border border-cyan-200 bg-sky-50/80 px-3 py-1">
            HOG + Machine Learning
          </span>
          <h1 className="mt-4 text-balance text-[26px] font-bold leading-[1.15] text-slate-900 sm:mt-6 sm:text-4xl lg:text-5xl">
            Temukan <span className="text-grad">bentuk wajah</span> Anda, pilih gaya rambut yang tepat.
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStart}
              className="min-h-12 rounded-full bg-gradient-to-r from-sky-700 to-cyan-600 px-7 py-3 font-medium text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              Mulai Klasifikasi
            </button>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm text-slate-600 sm:text-base">{APP.tagline} {APP.intro}</p>
          <p className="mono mt-4 text-cyan-700/70">Tanpa instalasi · Foto tidak disimpan</p>
        </div>
      </section>

      {/* Kategori bentuk wajah */}
      <section>
        <SectionHead n="01" title="Kategori Bentuk Wajah" />
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHAPE_KEYS.map((key, i) => {
            const info = FACE_SHAPES[key];
            return (
              <div key={key} className="glass glass-hover flex overflow-hidden sm:block">
                <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 bg-gradient-to-br from-sky-100 to-cyan-50 px-2 sm:h-24 sm:w-auto sm:flex-row sm:justify-between sm:gap-0 sm:px-5">
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <FaceGlyph shape={key} />
                </div>
                <div className="min-w-0 p-4 sm:p-5">
                  <h3 className="font-semibold text-slate-900">{info.label}</h3>
                  <p className="text-xs text-cyan-700">{info.blurb}</p>
                  <ul className="mt-2 space-y-1 text-[13px] text-slate-600 sm:mt-3 sm:text-sm">
                    {info.traits.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Panduan foto */}
      <section>
        <SectionHead n="02" title="Panduan Foto yang Baik" />
        <div className="glass p-4 sm:p-6">
          <ul className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2.5 text-[13px] text-slate-700 sm:text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-100 text-xs text-cyan-800">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <button
            onClick={onStart}
            className="mt-5 min-h-12 w-full rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-5 py-3 text-sm font-medium whitespace-nowrap text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 sm:mt-6 sm:w-auto sm:text-base"
          >
            Mulai Klasifikasi Sekarang
          </button>
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

function FaceGlyph({ shape }: { shape: string }) {
  const shapes: Record<string, string> = {
    oval: "M18 4a14 18 0 1 0 .01 0Z",
    round: "M18 4a14 14 0 1 0 .01 0Z",
    square: "M6 6h24v24H6z",
    heart: "M18 34 4 16a8 8 0 0 1 14-8 8 8 0 0 1 14 8z",
    oblong: "M10 4a8 18 0 1 0 .01 0Z",
  };
  return (
    <svg viewBox="0 0 36 36" className="floaty h-10 w-10 text-cyan-500/80 sm:h-16 sm:w-16" aria-hidden="true">
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
