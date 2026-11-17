import { useCallback, useEffect, useRef, useState } from "react";
import { APP } from "./data";
import { predict } from "./lib/api";
import type { PredictionResult } from "./types";
import Landing from "./components/Landing";
import Uploader from "./components/Uploader";
import Processing from "./components/Processing";
import Result from "./components/Result";

type Step = "landing" | "upload" | "processing" | "result";

const STEP_LABEL: Record<Step, string> = {
  landing: "Beranda",
  upload: "Unggah Foto",
  processing: "Memproses",
  result: "Hasil",
};

export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setStep("upload");
    } finally {
      busy.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setStep("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancel = useCallback(() => {
    busy.current = false;
    setStep("upload");
  }, []);

  const goUpload = useCallback(() => {
    setError(null);
    setStep("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-white/80 bg-white/70 px-4 py-2.5 shadow-lg shadow-sky-500/10 backdrop-blur-md">
          <button onClick={reset} className="flex items-center gap-2.5" aria-label="Kembali ke beranda">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-bold text-white">
              F
            </span>
            <span className="font-semibold text-slate-900">{APP.name}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="mono hidden sm:inline">{STEP_LABEL[step]}</span>
            <div className="flex gap-1" aria-hidden="true">
              {(["landing", "upload", "processing", "result"] as Step[]).map((s) => (
                <span
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? "w-6 bg-gradient-to-r from-sky-500 to-cyan-400" : "w-1.5 bg-sky-200"
                  }`}
                />
              ))}
            </div>
            {step !== "landing" && (
              <button
                onClick={reset}
                className="ml-1 rounded-full border border-sky-200 px-3 py-1.5 text-xs font-medium text-sky-800 transition hover:border-cyan-400"
              >
                Beranda
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:pt-14">
        {error && step === "upload" && (
          <div role="alert" className="mx-auto mb-5 max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <strong className="font-semibold">Klasifikasi gagal. </strong>
            {error}
          </div>
        )}

        {step === "landing" && <Landing onStart={goUpload} />}

        {step === "upload" && (
          <div>
            <h1 className="mb-1 text-center text-2xl font-bold text-slate-900">Unggah Foto Wajah</h1>
            <p className="mb-6 text-center text-sm text-slate-600">Satu foto tampak depan sudah cukup.</p>
            <Uploader onSubmit={start} disabled={false} />
          </div>
        )}

        {step === "processing" && preview && (
          <div className="py-10">
            <Processing preview={preview} onCancel={cancel} />
          </div>
        )}

        {step === "result" && result && preview && <Result result={result} preview={preview} onReset={reset} />}
      </main>

      <footer className="border-t border-sky-100 bg-white/50 px-4 py-6 backdrop-blur">
        <p className="mx-auto max-w-5xl text-center text-xs text-slate-500">
          {APP.name} · Frontend React + TypeScript · Klasifikasi bentuk wajah (oval, round, square, heart, oblong) dengan HOG + machine learning.
        </p>
      </footer>
    </div>
  );
}
