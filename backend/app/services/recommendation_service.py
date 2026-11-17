from typing import Any, Dict, List, Optional


RECOMMENDATIONS_DATA: Dict[str, Dict[str, Any]] = {
    "oval": {
        "label": "Oval",
        "blurb": "Proporsi paling seimbang",
        "description": (
            "Bentuk wajah oval memiliki proporsi panjang wajah yang lebih besar "
            "dibandingkan lebarnya dengan garis rahang yang relatif halus. Hampir "
            "semua gaya rambut cocok, cukup jaga volume agar proporsi tidak berubah."
        ),
        "traits": [
            "Panjang wajah > lebar",
            "Rahang membulat halus",
            "Dahi sedikit lebih lebar dari dagu",
        ],
        "recommendations": [
            {
                "name": "Side Part",
                "description": "Belahan samping dengan volume terkontrol.",
                "reason": "Menjaga proporsi alami wajah oval tanpa menambah lebar.",
                "image_url": "/images/hairstyles/side_part.jpg",
            },
            {
                "name": "Pompadour",
                "description": "Volume tinggi di bagian depan.",
                "reason": "Memberi kesan tegas tanpa mengganggu keseimbangan oval.",
                "image_url": "/images/hairstyles/pompadour.jpg",
            },
            {
                "name": "Quiff",
                "description": "Bagian depan diangkat sedikit acak.",
                "reason": "Menambah dimensi pada wajah yang proporsional.",
                "image_url": "/images/hairstyles/quiff.jpg",
            },
        ],
    },
    "round": {
        "label": "Round",
        "blurb": "Sudut wajah lembut",
        "description": (
            "Bentuk wajah round memiliki panjang dan lebar yang hampir sama dengan "
            "pipi penuh dan garis rahang membulat. Gaya rambut bertekstur dengan volume "
            "di atas membantu memanjangkan tampilan wajah."
        ),
        "traits": [
            "Panjang ≈ lebar",
            "Pipi penuh",
            "Rahang dan dagu membulat",
        ],
        "recommendations": [
            {
                "name": "Pompadour",
                "description": "Volume tinggi di atas dahi.",
                "reason": "Menambah tinggi visual sehingga wajah terlihat lebih panjang.",
                "image_url": "/images/hairstyles/pompadour.jpg",
            },
            {
                "name": "High Fade + Textured Top",
                "description": "Sisi tipis, atas bertekstur.",
                "reason": "Mengurangi lebar sisi wajah dan memusatkan perhatian ke atas.",
                "image_url": "/images/hairstyles/high_fade.jpg",
            },
            {
                "name": "Side Part Quiff",
                "description": "Belahan samping dengan sedikit angkatan.",
                "reason": "Memberi sudut tegas pada wajah yang lembut.",
                "image_url": "/images/hairstyles/side_part_quiff.jpg",
            },
        ],
    },
    "square": {
        "label": "Square",
        "blurb": "Rahang tegas dan kuat",
        "description": (
            "Bentuk wajah square memiliki dahi, tulang pipi, dan rahang yang lebarnya "
            "hampir sama dengan garis rahang tegas. Gaya dengan sedikit volume di atas "
            "dan sisi rapi menonjolkan struktur wajah yang kuat."
        ),
        "traits": [
            "Dahi, pipi, rahang hampir selebar",
            "Garis rahang tajam",
            "Struktur wajah kuat",
        ],
        "recommendations": [
            {
                "name": "Crew Cut",
                "description": "Potongan pendek rapi mengikuti bentuk kepala.",
                "reason": "Menonjolkan rahang tegas tanpa menambah lebar.",
                "image_url": "/images/hairstyles/crew_cut.jpg",
            },
            {
                "name": "Buzz Cut",
                "description": "Sangat pendek dan seragam.",
                "reason": "Menegaskan kesan maskulin dan bersih.",
                "image_url": "/images/hairstyles/buzz_cut.jpg",
            },
            {
                "name": "Short Quiff",
                "description": "Angkatan pendek di depan.",
                "reason": "Menambah dimensi vertikal yang menyeimbangkan rahang.",
                "image_url": "/images/hairstyles/short_quiff.jpg",
            },
        ],
    },
    "heart": {
        "label": "Heart",
        "blurb": "Dahi lebar, dagu runcing",
        "description": (
            "Bentuk wajah heart memiliki dahi dan tulang pipi lebih lebar dengan dagu "
            "yang lebih runcing. Gaya rambut yang menambah volume di bagian bawah atau "
            "samping membantu menyeimbangkan dahi."
        ),
        "traits": [
            "Dahi lebar",
            "Tulang pipi menonjol",
            "Dagu runcing",
        ],
        "recommendations": [
            {
                "name": "Medium Textured Fringe",
                "description": "Poni bertekstur menutup sebagian dahi.",
                "reason": "Mengurangi kesan lebar pada dahi.",
                "image_url": "/images/hairstyles/textured_fringe.jpg",
            },
            {
                "name": "Side-Swept",
                "description": "Rambut disisir ke satu sisi.",
                "reason": "Memecah simetri dahi dan menambah volume samping.",
                "image_url": "/images/hairstyles/side_swept.jpg",
            },
            {
                "name": "Curtain Hair",
                "description": "Belah tengah bergelombang.",
                "reason": "Menutup sudut dahi dan menyeimbangkan dagu runcing.",
                "image_url": "/images/hairstyles/curtain_hair.jpg",
            },
        ],
    },
    "oblong": {
        "label": "Oblong / Long",
        "blurb": "Wajah memanjang",
        "description": (
            "Bentuk wajah oblong memiliki panjang wajah yang jelas lebih besar dari "
            "lebarnya dengan dahi, pipi, dan rahang hampir sejajar. Gaya rambut yang "
            "menambah lebar di samping dan menghindari volume tinggi membantu menyeimbangkan proporsi."
        ),
        "traits": [
            "Panjang wajah > lebar secara signifikan",
            "Dahi, pipi, rahang sejajar",
            "Dagu memanjang",
        ],
        "recommendations": [
            {
                "name": "Classic Side Part",
                "description": "Belahan samping dengan sisi sedikit lebih panjang.",
                "reason": "Menambah lebar visual pada wajah memanjang.",
                "image_url": "/images/hairstyles/classic_side_part.jpg",
            },
            {
                "name": "French Crop",
                "description": "Poni pendek dengan sisi rapi.",
                "reason": "Memendekkan tampilan dahi tanpa volume berlebih.",
                "image_url": "/images/hairstyles/french_crop.jpg",
            },
            {
                "name": "Fringe",
                "description": "Poni jatuh menutup dahi.",
                "reason": "Memotong panjang visual wajah.",
                "image_url": "/images/hairstyles/fringe.jpg",
            },
        ],
    },
}

# Synonyms for normalization
SHAPE_SYNONYMS = {
    "oval": "oval",
    "round": "round",
    "bulat": "round",
    "square": "square",
    "kotak": "square",
    "persegi": "square",
    "heart": "heart",
    "hati": "heart",
    "oblong": "oblong",
    "long": "oblong",
    "panjang": "oblong",
    "rectangle": "oblong",
}


def normalize_face_shape(shape_input: str) -> str:
    key = str(shape_input).strip().lower().replace("-", "").replace("_", "")
    for syn, canonical in SHAPE_SYNONYMS.items():
        if key == syn or key.startswith(syn):
            return canonical
    return "oval"


def get_recommendations_for_shape(shape_input: str) -> List[Dict[str, Any]]:
    canonical = normalize_face_shape(shape_input)
    return RECOMMENDATIONS_DATA.get(canonical, {}).get("recommendations", [])


def get_shape_info(shape_input: str) -> Optional[Dict[str, Any]]:
    canonical = normalize_face_shape(shape_input)
    return RECOMMENDATIONS_DATA.get(canonical)
