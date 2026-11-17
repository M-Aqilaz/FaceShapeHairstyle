export type FaceShape = "oval" | "round" | "square" | "heart" | "oblong";

export interface Recommendation {
  name: string;
  description?: string;
  reason?: string;
  image_url?: string;
}

export interface PredictionResult {
  face_shape: FaceShape;
  confidence: number; // 0..1
  description: string;
  recommendations: Recommendation[];
  recommendationsFromBackend: boolean;
  raw: unknown;
}

export interface FaceShapeInfo {
  label: string;
  blurb: string;
  description: string;
  traits: string[];
  fallback: Recommendation[];
}
