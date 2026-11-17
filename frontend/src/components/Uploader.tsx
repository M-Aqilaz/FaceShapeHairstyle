import { useEffect, useRef, useState } from "react";
import { ACCEPTED, MAX_BYTES, TIPS } from "../data";

interface Props {
  onSubmit: (file: File) => void;
  disabled?: boolean;
}

type Mode = "idle" | "camera";

export default function Uploader({ onSubmit, disabled }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraTry, setCameraTry] = useState(0); // memaksa <video> reset saat mode kamera dibuka
  const mode: Mode = cameraTry > 0 ? "camera" : "idle";
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="glass p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">Masukkan foto wajah</h2>
          <span className="mono">{file ? "1 foto dipilih" : "belum ada foto"}</span>
        </div>

        {!preview ? (
          <>
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
              className={`mt-4 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
                dragging ? "border-cyan-500 bg-cyan-50/70" : "border-sky-300 bg-white/50 hover:border-cyan-400"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
              </svg>
              <p className="mt-3 font-medium text-slate-800">Tarik gambar ke sini atau klik untuk memilih</p>
              <p className="mono mt-1">jpeg · png · maks 8 mb</p>
            </div>

            <button
              onClick={() => setCameraTry((n) => n + 1)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white/70 px-4 py-3 text-sm font-medium text-sky-800 transition hover:border-cyan-400"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              Ambil lewat kamera
            </button>
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
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {disabled ? "Memproses…" : "Klasifikasi Sekarang"}
        </button>

        <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
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
        />
      )}
    </div>
  );
}

function CameraModal({ onClose, onCapture }: { onClose: () => void; onCapture: (f: File) => void }) {
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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], `kamera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Ambil foto dengan kamera">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Ambil foto wajah</h3>
          <button onClick={onClose} aria-label="Tutup kamera" className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl bg-slate-900">
          <video ref={videoRef} autoPlay playsInline muted className="mx-auto max-h-[60vh] w-full object-cover" />
        </div>
        {err ? (
          <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {err}
          </p>
        ) : (
          <p className="mt-2 text-center text-xs text-slate-500">Hadapkan wajah ke kamera, pastikan pencahayaan cukup.</p>
        )}
        <div className="mt-3 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">
            Batal
          </button>
          <button
            onClick={capture}
            disabled={!ready || !!err}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            Ambil Foto
          </button>
        </div>
      </div>
    </div>
  );
}
