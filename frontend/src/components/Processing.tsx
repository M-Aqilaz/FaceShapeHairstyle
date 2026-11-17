import { useEffect, useState } from "react";

const PHASES = [
  "Mengunggah gambar…",
  "Preprocessing & deteksi wajah…",
  "Ekstraksi fitur HOG…",
  "Klasifikasi model…",
];

export default function Processing({ preview, onCancel }: { preview: string; onCancel: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => Math.min(p + 1, PHASES.length - 1)), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-md" role="status" aria-live="polite">
      <div className="glass p-6 text-center">
        <div className="relative mx-auto h-40 w-32 overflow-hidden rounded-xl border border-sky-200">
          <img src={preview} alt="Foto sedang dianalisis" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent shimmer" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-slate-800">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />
          <span className="font-medium">Menganalisis foto Anda</span>
        </div>

        <ul className="mt-4 space-y-1.5 text-left text-sm">
          {PHASES.map((p, i) => (
            <li key={p} className={`flex items-center gap-2 ${i <= phase ? "text-slate-700" : "text-slate-400"}`}>
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${
                  i < phase ? "bg-cyan-500 text-white" : i === phase ? "border border-cyan-500 text-cyan-600" : "border border-slate-300"
                }`}
              >
                {i < phase ? "✓" : ""}
              </span>
              {p}
            </li>
          ))}
        </ul>

        <p className="mono mt-4 text-cyan-700/70">jangan tutup halaman ini</p>
        <button onClick={onCancel} className="mt-4 text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700">
          Batalkan
        </button>
      </div>
    </div>
  );
}
