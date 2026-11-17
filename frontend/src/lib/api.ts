import { FACE_SHAPES, fallbackRecommendations, SHAPE_KEYS } from "../data";
import type { FaceShape, PredictionResult, Recommendation } from "../types";

// Vite dev server mem-proxy /api ke backend (lihat vite.config.ts).
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
const TIMEOUT_MS = 30_000;

const ALIASES: Record<string, FaceShape> = {
  oval: "oval",
  round: "round",
  square: "square",
  heart: "heart",
  long: "oblong",
  oblong: "oblong",
  rectangle: "oblong",
};

function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
}

function toShape(value: unknown): FaceShape {
  const key = String(value ?? "").toLowerCase().trim().replace(/[\s_-]/g, "");
  const match = SHAPE_KEYS.find((s) => ALIASES[key] === s || key.startsWith(s));
  return match ?? "oval";
}

function toPercent(value: unknown): number {
  const n = typeof value === "string" ? Number.parseFloat(value) : Number(value);
  if (!Number.isFinite(n)) return 0;
  const pct = n > 1 ? n : n * 100; // backend bisa kirim 0.95 atau 95
  return Math.min(100, Math.max(0, pct));
}

function toRecs(value: unknown): Recommendation[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item): Recommendation | null => {
      if (typeof item === "string") return { name: item };
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const name = pick(o, ["name", "style", "title", "label"]);
      if (!name) return null;
      return {
        name: String(name),
        description: pick(o, ["description", "desc", "detail"]) as string | undefined,
        reason: pick(o, ["reason", "why", "alasan"]) as string | undefined,
        image_url: pick(o, ["image_url", "image", "img", "photo_url"]) as string | undefined,
      };
    })
    .filter((r): r is Recommendation => r !== null);
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${url}`, { ...init, signal: ctrl.signal });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Backend membalas ${res.status}. ${detail.slice(0, 200)}`.trim());
    }
    return res;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Permintaan melebihi batas waktu. Coba lagi.");
    }
    if (err instanceof TypeError) {
      throw new Error("Tidak dapat terhubung ke backend. Pastikan server API berjalan.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRecommendations(
  shape: FaceShape,
): Promise<{ recs: Recommendation[]; fromBackend: boolean }> {
  try {
    const res = await request(`/api/recommendations/${encodeURIComponent(shape)}`);
    const json: unknown = await res.json();
    const wrapped = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
    const recs = toRecs(
      Array.isArray(json) ? json : pick(wrapped, ["recommendations", "styles", "data", "items"]),
    );
    return recs.length ? { recs, fromBackend: true } : { recs: fallbackRecommendations(shape), fromBackend: false };
  } catch {
    // ponytail: cadangan lokal; hapus bila backend selalu hidup
    return { recs: fallbackRecommendations(shape), fromBackend: false };
  }
}

export async function predict(file: File, shapeHint?: FaceShape): Promise<PredictionResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await request("/api/analysis/predict", { method: "POST", body: form });
  const raw: unknown = await res.json();
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const inner = (o.result ?? o.data ?? o.prediction ?? o) as Record<string, unknown>;

  const shape = toShape(
    pick(inner, ["face_shape", "faceShape", "shape", "predicted_class", "class", "label", "prediction"]) ??
      pick(o, ["face_shape", "faceShape", "shape", "label", "prediction"]) ??
      shapeHint,
  );
  const confidence = toPercent(
    pick(inner, ["confidence", "confidence_score", "score", "probability", "prob"]) ?? pick(o, ["confidence"]),
  );

  const inline = toRecs(pick(o, ["recommendations", "styles"]) ?? pick(inner, ["recommendations", "styles"]));
  const fromApi = inline.length
    ? { recs: inline, fromBackend: true }
    : await fetchRecommendations(shape);

  return {
    face_shape: shape,
    confidence,
    description: FACE_SHAPES[shape].description,
    recommendations: fromApi.recs,
    recommendationsFromBackend: fromApi.fromBackend,
    raw,
  };
}
