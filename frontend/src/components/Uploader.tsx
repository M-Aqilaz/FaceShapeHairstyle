import { useCallback, useEffect, useRef, useState } from "react";
import { ACCEPTED, MAX_BYTES, TIPS } from "../data";

interface Props {
  onSubmit: (file: File) => void;
  onBack?: () => void;
  disabled?: boolean;
  autoCamera?: boolean;
  initialFile?: File | null;
}

type Tab = "camera" | "upload";

export default function Uploader({ onSubmit, onBack, disabled, autoCamera, initialFile }: Props) {
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<Tab>(autoCamera || !initialFile ? "camera" : "upload");
  const [showGuide, setShowGuide] = useState(true);
  const [timerOn, setTimerOn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [camReady, setCamReady] = useState(false);
  const [camErr, setCamErr] = useState<string | null>(null);
  const [camRetry, setCamRetry] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamReady(false);
  }, []);

  // Aktifkan kamera hanya saat tab "camera" aktif dan belum ada preview foto.
  useEffect(() => {
    if (tab !== "camera" || preview) {
      stopCamera();
      return;
    }

    let cancelled = false;
    setCamErr(null);
    setCamReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamErr("Browser ini tidak mendukung akses kamera. Gunakan tab Unggah Berkas.");
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
          videoRef.current.onloadeddata = () => setCamReady(true);
        }
      })
      .catch((e: DOMException) => {
        if (cancelled) return;
        setCamErr(
          e.name === "NotAllowedError"
            ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser, atau gunakan Unggah Berkas."
            : e.name === "NotFoundError"
              ? "Kamera tidak ditemukan pada perangkat ini. Silakan unggah gambar dari perangkat."
              : "Kamera tidak dapat dibuka. Gunakan tab Unggah Berkas.",
        );
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [tab, preview, camRetry, stopCamera]);

  const accept = useCallback((f: File) => {
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
  }, []);

  const capture = useCallback(() => {
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
        if (blob) accept(new File([blob], `kamera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }, [accept]);

  // Countdown timer 3 detik sebelum memotret.
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      capture();
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, capture]);

  function handleCaptureClick() {
    if (!camReady || countdown !== null) return;
    if (timerOn) {
      setCountdown(3);
    } else {
      capture();
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) accept(f);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) accept(f);
  }

  function resetPhoto(nextTab?: Tab) {
    setCountdown(null);
    setFile(null);
    setError(null);
    if (nextTab) setTab(nextTab);
  }

  function submit() {
    if (!file || disabled) return;
    onSubmit(file);
  }

  const statusText = preview
    ? "Foto wajah siap dianalisis. Klik Klasifikasi Sekarang untuk melanjutkan."
    : tab === "camera"
      ? camReady
        ? "Kamera aktif & siap memotret. Posisikan wajah di dalam garis oval."
        : camErr
          ? "Kamera tidak tersedia. Gunakan Unggah Berkas di tab sebelah."
          : "Menghubungkan ke kamera perangkat…"
      : "Pilih atau seret file gambar JPEG/PNG (maks. 8 MB).";

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-sky-800">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            Langkah 1 · Pengambilan Foto Wajah
          </span>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Posisikan Wajah Anda di Dalam Garis Pandu
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ambil foto langsung lewat kamera, atau unggah gambar dari perangkat.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-600 shadow-2xs">
            <span className={`h-1.5 w-1.5 rounded-full ${preview || camReady ? "bg-emerald-500" : "bg-amber-400"}`} />
            {preview ? "Foto Siap" : camReady ? "Kamera Siap" : tab === "upload" ? "Mode Unggah" : "Menunggu Kamera"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-sky-800">
            Privasi Aktif
          </span>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left: Camera / Upload Card */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            {/* Card Top Tab Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCountdown(null);
                    setTab("camera");
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === "camera"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  Kamera Langsung
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCountdown(null);
                    setTab("upload");
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === "upload"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                  </svg>
                  Unggah Berkas
                </button>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {preview ? "1 Foto Dipilih" : tab === "camera" ? "Rasio Potong 1:1" : "JPEG · PNG · Maks 8 MB"}
              </span>
            </div>

            {/* Main Viewport */}
            <div className="p-3 sm:p-4">
              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                  <img
                    src={preview}
                    alt="Preview foto wajah"
                    className="mx-auto aspect-[4/3] max-h-[440px] w-full object-contain"
                  />
                  <div className="pointer-events-none absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/80 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {file?.name ?? "Foto Siap"}
                    </span>
                  </div>
                </div>
              ) : tab === "camera" ? (
                <div className="relative aspect-[4/3] min-h-[300px] w-full overflow-hidden rounded-xl bg-slate-900">
                  {camErr ? (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 text-slate-300">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
                          <circle cx="12" cy="13" r="3.5" />
                          <path d="M3 3l18 18" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="mt-3 max-w-sm text-sm font-medium text-slate-100">{camErr}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCamRetry((n) => n + 1)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                        >
                          Coba Lagi
                        </button>
                        <button
                          type="button"
                          onClick={() => setTab("upload")}
                          className="rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Unggah Berkas
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Kamera selfie dengan efek cermin */}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover scale-x-[-1]"
                      />

                      {/* Top status overlays */}
                      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                          <span className={`h-1.5 w-1.5 rounded-full ${camReady ? "bg-emerald-400" : "bg-amber-400"}`} />
                          Cahaya dari depan · Posisi simetris
                        </span>
                        <span className="rounded-md bg-slate-900/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 backdrop-blur-sm">
                          {timerOn ? "TIMER 3S" : "AUTO"}
                        </span>
                      </div>

                      {/* Oval & Eye-line Guide Overlay */}
                      {showGuide && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                          <div className="relative aspect-[3/4] h-[64%] max-w-[230px] rounded-[50%] border border-white/85 shadow-[0_0_0_9999px_rgba(15,23,42,0.22)]">
                            {/* Horizontal eye-level guide */}
                            <div className="absolute inset-x-4 top-[42%] flex items-center justify-between">
                              <span className="h-px w-3 bg-white/70" />
                              <span className="rounded bg-slate-900/65 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/95">
                                Tinggi Garis Mata
                              </span>
                              <span className="h-px w-3 bg-white/70" />
                            </div>
                            {/* Center crosshair */}
                            <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-xs text-white/80">
                              +
                            </div>
                            {/* Bottom chin tick */}
                            <div className="absolute bottom-3 left-1/2 h-px w-6 -translate-x-1/2 bg-white/75" />
                          </div>
                        </div>
                      )}

                      {/* Countdown overlay */}
                      {countdown !== null && countdown > 0 && (
                        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-900/35 backdrop-blur-[1px]">
                          <span className="font-mono text-6xl font-bold text-white drop-shadow-lg">
                            {countdown}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* Upload Drag & Drop Tab */
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
                  className={`flex aspect-[4/3] min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${
                    dragging
                      ? "border-sky-500 bg-sky-50/70"
                      : "border-slate-200 bg-slate-50/70 hover:border-sky-400 hover:bg-sky-50/30"
                  }`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-sky-700 shadow-2xs">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-800">
                    Seret &amp; lepas foto wajah di sini, atau <span className="text-sky-700 underline decoration-sky-300 underline-offset-2">pilih berkas</span>
                  </p>
                  <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-400">
                    Format JPEG / PNG · Maksimal 8 MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={onPick}
              className="hidden"
              aria-label="Pilih gambar wajah"
            />

            {error && (
              <div className="px-4 pb-3 sm:px-5">
                <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 sm:text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Card Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
              {preview ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => resetPhoto("camera")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Foto Ulang
                    </button>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Ganti Gambar
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => resetPhoto()}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={disabled}
                      className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:opacity-40"
                    >
                      {disabled ? "Memproses…" : "Klasifikasi Sekarang"}
                    </button>
                  </div>
                </>
              ) : tab === "camera" ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimerOn((v) => !v)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        timerOn
                          ? "border-sky-300 bg-sky-50 text-sky-800"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span aria-hidden="true">⏱</span>
                      Timer 3s
                    </button>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      title="Pilih gambar dari perangkat"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Unggah
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCaptureClick}
                    disabled={!camReady || countdown !== null}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    {countdown !== null ? `Memotret (${countdown})…` : "Ambil Foto"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGuide((g) => !g)}
                    className="font-mono text-[10px] uppercase tracking-wider text-slate-500 transition hover:text-slate-900"
                  >
                    Garis Pandu: {showGuide ? "ON" : "OFF"}
                  </button>
                </>
              ) : (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Klik area di atas untuk memilih foto
                  </span>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800"
                  >
                    Pilih Gambar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar Panduan */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight text-slate-900">Panduan Hasil Terbaik</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-700">4 Tips</span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {TIPS.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/75 p-3 text-xs leading-relaxed text-slate-700"
                >
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">
                    ✓
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-800">
                Mengapa Presisi Penting?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Ekstraksi fitur HOG membaca kontur dahi, tulang pipi, dan garis rahang. Foto simetris tanpa distorsi menghasilkan klasifikasi yang lebih akurat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">Privasi Terjaga</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Tanpa instalasi · Foto hanya digunakan untuk proses klasifikasi dan tidak disimpan.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 shadow-xs sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <span className={`h-2 w-2 shrink-0 rounded-full ${preview ? "bg-emerald-500" : camReady ? "bg-sky-500" : "bg-slate-300"}`} />
          <span>{statusText}</span>
        </div>

        <div className="flex w-full shrink-0 items-center justify-end gap-2.5 sm:w-auto">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
            >
              Kembali ke Beranda
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!file || disabled}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {disabled ? "Memproses…" : "Klasifikasi Sekarang"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
