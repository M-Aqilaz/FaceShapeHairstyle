import { useEffect, useRef, useState } from "react";
import { ACCEPTED, MAX_BYTES, TIPS } from "../data";

interface Props {
  onSubmit: (file: File) => void;
  disabled?: boolean;
  autoCamera?: boolean;
  initialFile?: File | null;
}

type Mode = "idle" | "camera";

export default function Uploader({ onSubmit, disabled, autoCamera, initialFile }: Props) {
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraTry, setCameraTry] = useState(0); // memaksa <video> reset saat mode kamera dibuka
  const mode: Mode = cameraTry > 0 ? "camera" : "idle";
  const inputRef = useRef<HTMLInputElement>(null);

  // Kamera langsung terbuka saat masuk dari tombol "Mulai Klasifikasi".
  useEffect(() => {
    if (autoCamera) setCameraTry(1);
  }, [autoCamera]);

  // Preview object URL selalu di-revoke saat diganti / unmount.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function accept(f: File) {
    if (!ACCEPTED.includes(f.type.toLowerCase())) {
      setError("Format tidak didukung. Gunakan gambar JPEG atau PNG.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`Ukuran file ${(f.size / 1024 / 1024).toFixed(1)} MB melebihi batas 8 MB.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) accept(f);
    e.target.value = ""; // izinkan memilih file yang sama lagi
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) accept(f);
  }

  function reset() {
    setFile(null);
    setError(null);
  }

  function submit() {
    if (!file || disabled) return; // cegah permintaan ganda
    onSubmit(file);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="whitespace-nowrap text-base font-semibold text-slate-900 sm:text-lg">Foto wajah</h2>
          <span className="mono mt-1 shrink-0 whitespace-nowrap">{file ? "1 dipilih" : "belum ada"}</span>
        </div>

        {!preview ? (
          <>
            {/* Metode utama: kamera */}
            <button
              onClick={() => setCameraTry((n) => n + 1)}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-300 bg-gradient-to-br from-sky-700 to-cyan-600 px-4 py-4 text-center text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110 sm:mt-4 sm:grid sm:place-items-center sm:gap-1 sm:px-6 sm:py-8"
            >
              <svg viewBox="0 0 24 24" className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              <span className="text-left sm:text-center">
                <span className="block font-semibold">Ambil Foto Wajah</span>
                <span className="block text-[11px] text-white/85">Buka kamera perangkat · metode utama</span>
              </span>
            </button>

            <div className="my-3 flex items-center gap-2 sm:my-4 sm:gap-3">
              <span className="h-px flex-1 bg-sky-200" />
              <span className="mono">atau</span>
              <span className="h-px flex-1 bg-sky-200" />
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
              className={`flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed px-3 py-3 text-center transition ${
                dragging ? "border-cyan-500 bg-cyan-50/70" : "border-sky-300 bg-white/50 hover:border-cyan-400"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
              </svg>
              <span className="min-w-0 text-[13px] text-slate-700 sm:text-sm">
                atau <span className="font-medium text-sky-800">unggah gambar</span> dari perangkat
              </span>
            </div>
            <p className="mono mt-1.5 text-center">jpeg · png · maks 8 mb</p>
          </>
        ) : (
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-xl border border-sky-200 bg-slate-900/5">
              <img src={preview} alt="Preview foto wajah" className="mx-auto max-h-[380px] w-full object-contain" />
            </div>
            <p className="mono mt-2 truncate">{file?.name}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex-1 rounded-xl border border-sky-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-sky-800 transition hover:border-cyan-400"
              >
                Ganti gambar
              </button>
              <button
                onClick={reset}
                className="flex-1 rounded-xl border border-rose-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:border-rose-400"
              >
                Hapus
              </button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={onPick}
          className="hidden"
          aria-label="Pilih gambar wajah"
        />

        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={!file || disabled}
          className="mt-4 min-h-12 w-full rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:text-base"
        >
          {disabled ? "Memproses…" : "Klasifikasi Sekarang"}
        </button>

        {/* Panduan sudah ada di halaman beranda — di HP disembunyikan agar panel ringkas */}
        <ul className="mt-4 hidden space-y-1.5 text-xs text-slate-600 sm:block">
          {TIPS.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-cyan-600">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {mode === "camera" && (
        <CameraModal
          onClose={() => setCameraTry(0)}
          onCapture={(f) => {
            accept(f);
            setCameraTry(0);
          }}
          onFallback={() => {
            setCameraTry(0);
            inputRef.current?.click();
          }}
        />
      )}
    </div>
  );
}

function CameraModal({
  onClose,
  onCapture,
  onFallback,
}: {
  onClose: () => void;
  onCapture: (f: File) => void;
  onFallback: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      setErr("Browser ini tidak mendukung akses kamera. Gunakan unggah gambar.");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => setReady(true);
        }
      })
      .catch((e: DOMException) => {
        setErr(
          e.name === "NotAllowedError"
            ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser, atau unggah gambar."
            : e.name === "NotFoundError"
              ? "Kamera tidak ditemukan pada perangkat ini."
              : "Kamera tidak dapat dibuka. Gunakan unggah gambar.",
        );
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    // Potong bujur sangkar 1:1 di tengah (fokus pada kepala & hilangkan background samping)
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // Efek cermin (mirroring) agar hasil jepretan sama persis dengan preview cermin selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], `kamera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ambil foto dengan kamera"
    >
      <div className="flex h-[100dvh] w-full max-w-lg flex-col bg-white p-4 shadow-2xl sm:h-auto sm:rounded-2xl [@media(max-height:420px)]:h-auto [@media(max-height:420px)]:w-fit [@media(max-height:420px)]:max-w-[92vw] [@media(max-height:420px)]:rounded-2xl [@media(max-height:420px)]:p-2.5">
        <div className="flex shrink-0 items-center justify-between">
          <h3 className="font-semibold text-slate-900">Ambil foto wajah</h3>
          <button onClick={onClose} aria-label="Tutup kamera" className="-mr-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        {err ? (
          <div className="mt-3 grid flex-1 place-items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <svg viewBox="0 0 24 24" className="h-9 w-9 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M3 3l18 18" strokeLinecap="round" />
            </svg>
            <p className="mt-2 text-sm font-medium text-slate-700">Kamera tidak aktif</p>
          </div>
        ) : (
          <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-xl bg-slate-900 sm:aspect-[4/3] sm:flex-none [@media(max-height:420px)]:h-[calc(100dvh-140px)] [@media(max-height:420px)]:w-auto [@media(max-height:420px)]:flex-none [@media(max-height:420px)]:aspect-[3/4] [@media(max-height:420px)]:self-center">
            {/* Kamera selfie dengan efek cermin (scale-x-[-1]) */}
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover scale-x-[-1]" />

            {/* Panduan posisi kepala yang lega, tidak gelap pekat dan tidak bikin sesak */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="relative aspect-[3/4] h-[78%] max-w-[280px] rounded-[50%] border-2 border-cyan-400/90 bg-cyan-500/5 shadow-[0_0_24px_rgba(34,211,238,0.3)] ring-1 ring-white/40" />
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center [@media(max-height:420px)]:hidden">
              <span className="rounded-full bg-slate-900/75 px-3 py-1 text-xs font-medium text-white/95 shadow-md backdrop-blur">
                Arahkan wajah menghadap kamera
              </span>
            </div>
          </div>
        )}
        {!err && (
          <p className="mt-2 shrink-0 text-center text-[11px] leading-tight text-slate-500 sm:text-xs [@media(max-height:420px)]:hidden">
            Wajah menghadap kamera, pencahayaan cukup.
          </p>
        )}
        {err && (
          <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {err}
          </p>
        )}
        <div className="mt-3 flex shrink-0 gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-slate-600">
            Batal
          </button>
          {err ? (
            <button
              onClick={onFallback}
              className="flex-1 rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white"
            >
              Pilih Gambar
            </button>
          ) : (
            <button
              onClick={capture}
              disabled={!ready}
              className="flex-1 rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white disabled:opacity-40"
            >
              Ambil Foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
