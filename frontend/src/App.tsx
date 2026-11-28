import { useCallback, useEffect, useRef, useState } from "react";
import { APP } from "./data";
import { predict } from "./lib/api";
import type { PredictionResult } from "./types";
import Landing from "./components/Landing";
import Uploader from "./components/Uploader";
import Processing from "./components/Processing";
import Result from "./components/Result";

type Step = "landing" | "upload" | "processing" | "result";

export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoCamera, setAutoCamera] = useState(false); // buka kamera otomatis saat masuk dari landing
  const busy = useRef(false); // penjaga permintaan ganda (state async)

  // Satu object URL untuk seluruh alur upload → processing → result.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const start = useCallback(async (picked: File) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    setFile(picked);
    setStep("processing");
    try {
      const res = await predict(picked);
      setResult(res);
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Klasifikasi gagal. Silakan coba lagi.");
      setAutoCamera(false);
      setStep("upload");
    } finally {
      busy.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setAutoCamera(false);
    setStep("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancel = useCallback(() => {
    busy.current = false;
    setAutoCamera(false);
    setStep("upload");
  }, []);

  const goUpload = useCallback(() => {
    setError(null);
    setAutoCamera(true);
    setStep("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={reset} className="flex items-center gap-2.5 text-left" aria-label="Kembali ke beranda">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              H
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900">{APP.name}</span>
          </button>

          {step === "landing" && (
            <div className="hidden items-center gap-7 text-xs font-medium uppercase tracking-wider text-slate-500 md:flex">
              <a href="#beranda" className="transition hover:text-slate-900">
                Beranda
              </a>
              <a href="#kategori" className="transition hover:text-slate-900">
                Kategori Wajah
              </a>
              <a href="#panduan" className="transition hover:text-slate-900">
                Panduan Foto
              </a>
            </div>
          )}

          <div className="flex items-center gap-2">
            {step === "landing" ? (
              <button
                onClick={goUpload}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800"
              >
                Mulai Klasifikasi
              </button>
            ) : (
              <button
                onClick={reset}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Beranda
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
        {error && step === "upload" && (
          <div role="alert" className="mx-auto mb-5 max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <strong className="font-semibold">Klasifikasi gagal. </strong>
            {error}
          </div>
        )}

        {step === "landing" && <Landing onStart={goUpload} />}

        {step === "upload" && (
          <Uploader onSubmit={start} onBack={reset} disabled={false} autoCamera={autoCamera} initialFile={file} />
        )}

        {step === "processing" && preview && (
          <div className="py-10">
            <Processing preview={preview} onCancel={cancel} />
          </div>
        )}

        {step === "result" && result && preview && <Result result={result} preview={preview} onReset={reset} />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-8 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900">{APP.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-700">HOG + ML</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Klasifikasi bentuk wajah (oval, round, square, heart, oblong, diamond) &amp; rekomendasi gaya rambut.
            </p>
          </div>
          <p className="text-xs text-slate-400">Tanpa instalasi · Foto tidak disimpan</p>
        </div>
      </footer>
    </div>
  );
}
