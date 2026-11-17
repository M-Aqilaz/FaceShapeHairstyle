import { APP, FACE_SHAPES, SHAPE_KEYS, STEPS, TIPS } from "../data";

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative pt-8">
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="mono inline-block rounded-full border border-cyan-200 bg-sky-50/80 px-3 py-1">
            Shape Classification · HOG + ML
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Temukan <span className="text-grad">bentuk wajah</span> Anda,<br className="hidden sm:block" /> pilih gaya rambut yang tepat.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-slate-600">{APP.tagline} {APP.intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStart}
              className="rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-7 py-3 font-medium text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              Mulai Klasifikasi
            </button>
            <a
              href="#cara-kerja"
              className="rounded-full border border-sky-200 bg-white/70 px-7 py-3 font-medium text-sky-800 backdrop-blur transition hover:border-cyan-400"
            >
              Cara Kerja
            </a>
          </div>
          <p className="mono mt-6 text-cyan-700/70">Tanpa instalasi · Foto tidak disimpan di browser</p>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara-kerja" className="scroll-mt-24">
        <SectionHead n="01" title="Cara Kerja" />
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass glass-hover p-5">
              <span className="mono">{s.n}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">{APP.about}</p>
      </section>

      {/* Kategori bentuk wajah */}
      <section>
        <SectionHead n="02" title="Kategori Bentuk Wajah" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHAPE_KEYS.map((key, i) => {
            const info = FACE_SHAPES[key];
            return (
              <div key={key} className="glass glass-hover overflow-hidden">
                <div className="flex h-24 items-center justify-between bg-gradient-to-br from-sky-100 to-cyan-50 px-5">
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <FaceGlyph shape={key} />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900">{info.label}</h3>
                  <p className="text-xs text-cyan-700">{info.blurb}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
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
        <SectionHead n="03" title="Panduan Foto yang Baik" />
        <div className="glass p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-100 text-cyan-800">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <button
            onClick={onStart}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 sm:w-auto"
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
    <div className="mb-5 flex items-center gap-3">
      <span className="mono">{n}</span>
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
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
    <svg viewBox="0 0 36 36" className="floaty h-16 w-16 text-cyan-500/80" aria-hidden="true">
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
