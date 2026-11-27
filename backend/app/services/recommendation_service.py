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
                "name": "Undercut",
                "description": "Belahan samping dengan volume terkontrol.",
                "reason": "Menjaga proporsi alami wajah oval tanpa menambah lebar.",
                "image_url": "/images/hairstyles/undercut.webp",
            },
            {
                "name": "French Crop",
                "description": "Poni pendek dengan sisi rapi.",
                "reason": "Menjaga keseimbangan proporsi wajah oval.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Slick Back",
                "description": "Rambut disisir ke belakang secara rapi.",
                "reason": "Menonjolkan proporsi seimbang wajah oval tanpa berlebihan.",
                "image_url": "/images/hairstyles/slick_back.webp",
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
                "name": "Crew Cut",
                "description": "Potongan pendek rapi mengikuti bentuk kepala.",
                "reason": "Meminimalkan lebar visual pipi pada wajah bulat.",
                "image_url": "/images/hairstyles/crew_cut.webp",
            },
            {
                "name": "Comb Over",
                "description": "Rambut disisir menyamping dengan transisi rapi.",
                "reason": "Memberi garis vertikal tegas pada wajah bulat.",
                "image_url": "/images/hairstyles/comb_over.webp",
            },
            {
                "name": "Side Part",
                "description": "Belahan samping dengan potongan rapi.",
                "reason": "Membantu wajah bulat terlihat lebih panjang.",
                "image_url": "/images/hairstyles/side_part.webp",
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
                "name": "French Crop",
                "description": "Poni pendek dengan sisi rapi.",
                "reason": "Menyeimbangkan struktur wajah square dengan garis yang bersih.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Pompadour",
                "description": "Volume tinggi di bagian depan.",
                "reason": "Menambah dimensi vertikal pada rahang yang tegas.",
                "image_url": "/images/hairstyles/pompadour.webp",
            },
            {
                "name": "Crew Cut",
                "description": "Potongan pendek rapi mengikuti bentuk kepala.",
                "reason": "Menonjolkan rahang tegas tanpa menambah lebar.",
                "image_url": "/images/hairstyles/crew_cut.webp",
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
                "name": "Textured Crop",
                "description": "Potongan pendek bertekstur dengan poni rapi.",
                "reason": "Menyeimbangkan dahi lebar dengan volume yang terkontrol.",
                "image_url": "/images/hairstyles/textured_crop.webp",
            },
            {
                "name": "Side Part",
                "description": "Belahan samping rapi dengan sisi bersih.",
                "reason": "Memberi garis tegas yang menyeimbangkan dagu runcing.",
                "image_url": "/images/hairstyles/side_part.webp",
            },
            {
                "name": "Quiff",
                "description": "Bagian depan diangkat dengan volume terarah.",
                "reason": "Membuat proporsi dahi dan dagu terlihat lebih seimbang.",
                "image_url": "/images/hairstyles/quiff.webp",
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
                "name": "French Crop",
                "description": "Poni pendek dengan sisi dan bagian atas rapi.",
                "reason": "Memendekkan tampilan dahi pada wajah yang memanjang.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Side Part",
                "description": "Belahan samping klasik dengan sisi terkontrol.",
                "reason": "Menambah kesan lebar dan mengurangi wajah yang memanjang.",
                "image_url": "/images/hairstyles/side_part.webp",
            },
            {
                "name": "Textured Crop",
                "description": "Potongan pendek bertekstur dengan volume sisi seimbang.",
                "reason": "Memberi proporsi lebih lebar tanpa volume tinggi berlebihan.",
                "image_url": "/images/hairstyles/textured_crop.webp",
            },
        ],
    },
    "diamond": {
        "label": "Diamond",
        "blurb": "Tulang pipi tegas & bersudut",
        "description": (
            "Bentuk wajah diamond memiliki tulang pipi lebar dan menonjol, dengan dahi sempit "
            "dan dagu runcing bersudut. Gaya rambut bertekstur, poni, atau belahan samping "
            "menambah kepenuhan pada dahi dan melembutkan sudut rahang."
        ),
        "traits": [
            "Tulang pipi terlebar dibanding dahi dan rahang",
            "Dahi dan dagu meruncing sempit",
            "Garis rahang bersudut tegas",
        ],
        "recommendations": [
            {
                "name": "Textured Crop",
                "description": "Poni bertekstur dengan sisi proporsional tidak terlalu tipis.",
                "reason": "Melembutkan sudut tajam tulang pipi dan menambah dimensi pada dahi.",
                "image_url": "/images/hairstyles/french_crop.jpg",
            },
            {
                "name": "Side Fringe / Side Swept",
                "description": "Poni samping yang jatuh alami di atas dahi.",
                "reason": "Menyeimbangkan lebar tulang pipi dan menyamarkan dahi sempit.",
                "image_url": "/images/hairstyles/side_part.jpg",
            },
            {
                "name": "Messy Quiff",
                "description": "Volume medium di bagian atas dan samping yang tidak terlalu tipis.",
                "reason": "Memberikan proporsi seimbang antara dahi dan dagu lancip.",
                "image_url": "/images/hairstyles/quiff.jpg",
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
    "diamond": "diamond",
    "wajik": "diamond",
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
