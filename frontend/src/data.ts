import type { FaceShape, FaceShapeInfo, Recommendation } from "./types";

export const APP = {
  name: "Hairmory",
  tagline: "Kenali bentuk wajahmu, temukan gaya rambut yang pas.",
  intro:
    "Hairmory menganalisis foto wajah Anda menggunakan ekstraksi fitur HOG dan model klasifikasi machine learning, lalu merekomendasikan gaya rambut yang paling cocok untuk bentuk wajah tersebut.",
};

export const TIPS = [
  "Gunakan foto wajah tampak depan, menghadap kamera.",
  "Pastikan pencahayaan cukup dan wajah tidak tertutup rambut atau tangan.",
  "Hindari aksesori yang menutupi dahi, mata, atau rahang.",
  "Format JPEG atau PNG, ukuran maksimal 8 MB.",
];

export const MAX_BYTES = 8 * 1024 * 1024;
export const ACCEPTED = ["image/jpeg", "image/png", "image/jpg"];

export const FACE_SHAPES: Record<FaceShape, FaceShapeInfo> = {
  oval: {
    label: "Oval",
    blurb: "Proporsi paling seimbang",
    description:
      "Bentuk wajah oval memiliki proporsi panjang wajah yang lebih besar dibandingkan lebarnya dengan garis rahang yang relatif halus. Hampir semua gaya rambut cocok, cukup jaga volume agar proporsi tidak berubah.",
    traits: ["Panjang wajah > lebar", "Rahang membulat halus", "Dahi sedikit lebih lebar dari dagu"],
    fallback: [
      { name: "Side Part", description: "Belahan samping dengan volume terkontrol.", reason: "Menjaga proporsi alami wajah oval tanpa menambah lebar." },
      { name: "Pompadour", description: "Volume tinggi di bagian depan.", reason: "Memberi kesan tegas tanpa mengganggu keseimbangan oval." },
      { name: "Quiff", description: "Bagian depan diangkat sedikit acak.", reason: "Menambah dimensi pada wajah yang proporsional." },
    ],
  },
  round: {
    label: "Round",
    blurb: "Sudut wajah lembut",
    description:
      "Bentuk wajah round memiliki panjang dan lebar yang hampir sama dengan pipi penuh dan garis rahang membulat. Gaya rambut bertekstur dengan volume di atas membantu memanjangkan tampilan wajah.",
    traits: ["Panjang ≈ lebar", "Pipi penuh", "Rahang dan dagu membulat"],
    fallback: [
      { name: "Pompadour", description: "Volume tinggi di atas dahi.", reason: "Menambah tinggi visual sehingga wajah terlihat lebih panjang." },
      { name: "High Fade + Textured Top", description: "Sisi tipis, atas bertekstur.", reason: "Mengurangi lebar sisi wajah dan memusatkan perhatian ke atas." },
      { name: "Side Part Quiff", description: "Belahan samping dengan sedikit angkatan.", reason: "Memberi sudut tegas pada wajah yang lembut." },
    ],
  },
  square: {
    label: "Square",
    blurb: "Rahang tegas dan kuat",
    description:
      "Bentuk wajah square memiliki dahi, tulang pipi, dan rahang yang lebarnya hampir sama dengan garis rahang tegas. Gaya dengan sedikit volume di atas dan sisi rapi menonjolkan struktur wajah yang kuat.",
    traits: ["Dahi, pipi, rahang hampir selebar", "Garis rahang tajam", "Struktur wajah kuat"],
    fallback: [
      { name: "Crew Cut", description: "Potongan pendek rapi mengikuti bentuk kepala.", reason: "Menonjolkan rahang tegas tanpa menambah lebar." },
      { name: "Buzz Cut", description: "Sangat pendek dan seragam.", reason: "Menegaskan kesan maskulin dan bersih." },
      { name: "Short Quiff", description: "Angkatan pendek di depan.", reason: "Menambah dimensi vertikal yang menyeimbangkan rahang." },
    ],
  },
  heart: {
    label: "Heart",
    blurb: "Dahi lebar, dagu runcing",
    description:
      "Bentuk wajah heart memiliki dahi dan tulang pipi lebih lebar dengan dagu yang lebih runcing. Gaya rambut yang menambah volume di bagian bawah atau samping membantu menyeimbangkan dahi.",
    traits: ["Dahi lebar", "Tulang pipi menonjol", "Dagu runcing"],
    fallback: [
      { name: "Medium Textured Fringe", description: "Poni bertekstur menutup sebagian dahi.", reason: "Mengurangi kesan lebar pada dahi." },
      { name: "Side-Swept", description: "Rambut disisir ke satu sisi.", reason: "Memecah simetri dahi dan menambah volume samping." },
      { name: "Curtain Hair", description: "Belah tengah bergelombang.", reason: "Menutup sudut dahi dan menyeimbangkan dagu runcing." },
    ],
  },
  oblong: {
    label: "Oblong / Long",
    blurb: "Wajah memanjang",
    description:
      "Bentuk wajah oblong memiliki panjang wajah yang jelas lebih besar dari lebarnya dengan dahi, pipi, dan rahang hampir sejajar. Gaya rambut yang menambah lebar di samping dan menghindari volume tinggi membantu menyeimbangkan proporsi.",
    traits: ["Panjang wajah > lebar secara signifikan", "Dahi, pipi, rahang sejajar", "Dagu memanjang"],
    fallback: [
      { name: "Classic Side Part", description: "Belahan samping dengan sisi sedikit lebih panjang.", reason: "Menambah lebar visual pada wajah memanjang." },
      { name: "French Crop", description: "Poni pendek dengan sisi rapi.", reason: "Memendekkan tampilan dahi tanpa volume berlebih." },
      { name: "Fringe", description: "Poni jatuh menutup dahi.", reason: "Memotong panjang visual wajah." },
    ],
  },
  diamond: {
    label: "Diamond",
    blurb: "Tulang pipi tegas & bersudut",
    description:
      "Bentuk wajah diamond memiliki tulang pipi lebar dan menonjol, dengan dahi sempit dan dagu runcing bersudut. Gaya rambut bertekstur, poni, atau belahan samping menambah kepenuhan pada dahi dan melembutkan sudut rahang.",
    traits: ["Tulang pipi terlebar", "Dahi dan dagu meruncing sempit", "Garis rahang bersudut tegas"],
    fallback: [
      { name: "Textured Crop", description: "Poni bertekstur dengan sisi proporsional.", reason: "Melembutkan sudut tajam tulang pipi dan memberi dimensi pada dahi." },
      { name: "Side Fringe", description: "Poni samping yang jatuh alami di atas dahi.", reason: "Menyeimbangkan lebar tulang pipi dan menyamarkan dahi sempit." },
      { name: "Messy Quiff", description: "Volume medium di bagian atas.", reason: "Memberikan proporsi seimbang antara dahi dan dagu lancip." },
    ],
  },
};

export const SHAPE_KEYS = Object.keys(FACE_SHAPES) as FaceShape[];

/** Rekomendasi cadangan bila endpoint backend tidak tersedia. */
export function fallbackRecommendations(shape: FaceShape): Recommendation[] {
  return FACE_SHAPES[shape]?.fallback ?? [];
}
