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
                "name": "Pria: Undercut",
                "description": "Belahan samping dengan volume terkontrol.",
                "reason": "Menjaga proporsi alami wajah oval tanpa menambah lebar.",
                "image_url": "/images/hairstyles/undercut.webp",
            },
            {
                "name": "Pria: French Crop",
                "description": "Poni pendek dengan sisi rapi.",
                "reason": "Menjaga keseimbangan proporsi wajah oval.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Pria: Slick Back",
                "description": "Rambut disisir ke belakang secara rapi.",
                "reason": "Menonjolkan proporsi seimbang wajah oval tanpa berlebihan.",
                "image_url": "/images/hairstyles/slick_back.webp",
            },
            {
                "name": "Wanita: Long Waves",
                "description": "Gelombang panjang yang lembut dan membingkai wajah.",
                "reason": "Proporsi wajah oval yang seimbang cocok dengan beragam gaya rambut.",
            },
            {
                "name": "Wanita: Sleek Bob",
                "description": "Bob rapi dengan panjang sekitar dagu.",
                "reason": "Menonjolkan proporsi wajah oval tanpa menutupi fitur wajah.",
            },
            {
                "name": "Wanita: Layered Lob",
                "description": "Potongan sebahu berlapis dengan tekstur ringan.",
                "reason": "Layer memberi gerak dengan tetap menjaga keseimbangan wajah.",
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
                "name": "Pria: Crew Cut",
                "description": "Potongan pendek rapi mengikuti bentuk kepala.",
                "reason": "Meminimalkan lebar visual pipi pada wajah bulat.",
                "image_url": "/images/hairstyles/crew_cut.webp",
            },
            {
                "name": "Pria: Comb Over",
                "description": "Rambut disisir menyamping dengan transisi rapi.",
                "reason": "Memberi garis vertikal tegas pada wajah bulat.",
                "image_url": "/images/hairstyles/comb_over.webp",
            },
            {
                "name": "Pria: Side Part",
                "description": "Belahan samping dengan potongan rapi.",
                "reason": "Membantu wajah bulat terlihat lebih panjang.",
                "image_url": "/images/hairstyles/side_part.webp",
            },
            {
                "name": "Wanita: Long Layers with Side Bangs",
                "description": "Rambut panjang berlapis dengan poni menyamping.",
                "reason": "Layer panjang dan poni bersudut memberi kesan wajah lebih panjang.",
            },
            {
                "name": "Wanita: Textured Lob",
                "description": "Lob bertekstur dengan panjang melewati dagu.",
                "reason": "Panjang dan tekstur membantu mengurangi kesan lebar pada pipi.",
            },
            {
                "name": "Wanita: Center Part with Long Layers",
                "description": "Belahan tengah dengan layer panjang.",
                "reason": "Garis belahan dan layer panjang menarik perhatian secara vertikal.",
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
                "name": "Pria: French Crop",
                "description": "Poni pendek dengan sisi rapi.",
                "reason": "Menyeimbangkan struktur wajah square dengan garis yang bersih.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Pria: Pompadour",
                "description": "Volume tinggi di bagian depan.",
                "reason": "Menambah dimensi vertikal pada rahang yang tegas.",
                "image_url": "/images/hairstyles/pompadour.webp",
            },
            {
                "name": "Pria: Crew Cut",
                "description": "Potongan pendek rapi mengikuti bentuk kepala.",
                "reason": "Menonjolkan rahang tegas tanpa menambah lebar.",
                "image_url": "/images/hairstyles/crew_cut.webp",
            },
            {
                "name": "Wanita: Piecey Shag with Curtain Bangs",
                "description": "Shag bertekstur dengan poni tirai.",
                "reason": "Tekstur berlapis dan poni tirai membantu melembutkan sudut wajah.",
            },
            {
                "name": "Wanita: Long Textured Layers",
                "description": "Layer panjang dengan tekstur dan gerak.",
                "reason": "Layer bertekstur melembutkan garis rahang yang tegas.",
            },
            {
                "name": "Wanita: Side-Swept Waves",
                "description": "Gelombang lembut dengan belahan menyamping.",
                "reason": "Arah samping dan gelombang memberi garis yang lebih lembut pada wajah.",
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
                "name": "Pria: Textured Crop",
                "description": "Potongan pendek bertekstur dengan poni rapi.",
                "reason": "Menyeimbangkan dahi lebar dengan volume yang terkontrol.",
                "image_url": "/images/hairstyles/textured_crop.webp",
            },
            {
                "name": "Pria: Side Part",
                "description": "Belahan samping rapi dengan sisi bersih.",
                "reason": "Memberi garis tegas yang menyeimbangkan dagu runcing.",
                "image_url": "/images/hairstyles/side_part.webp",
            },
            {
                "name": "Pria: Quiff",
                "description": "Bagian depan diangkat dengan volume terarah.",
                "reason": "Membuat proporsi dahi dan dagu terlihat lebih seimbang.",
                "image_url": "/images/hairstyles/quiff.webp",
            },
            {
                "name": "Wanita: Chin-Length Bob with Side Bangs",
                "description": "Bob sepanjang dagu dengan poni menyamping.",
                "reason": "Panjang bob dan poni samping membantu menyeimbangkan dahi dan dagu.",
            },
            {
                "name": "Wanita: Layered Lob with Waves",
                "description": "Lob berlapis dengan gelombang lembut.",
                "reason": "Layer dan gelombang menambah gerak serta keseimbangan di sekitar rahang.",
            },
            {
                "name": "Wanita: Soft Side-Parted Pixie",
                "description": "Pixie bertekstur lembut dengan belahan samping.",
                "reason": "Belahan samping membantu mengimbangi dahi yang lebih lebar.",
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
                "name": "Pria: French Crop",
                "description": "Poni pendek dengan sisi dan bagian atas rapi.",
                "reason": "Memendekkan tampilan dahi pada wajah yang memanjang.",
                "image_url": "/images/hairstyles/french_crop.webp",
            },
            {
                "name": "Pria: Side Part",
                "description": "Belahan samping klasik dengan sisi terkontrol.",
                "reason": "Menambah kesan lebar dan mengurangi wajah yang memanjang.",
                "image_url": "/images/hairstyles/side_part.webp",
            },
            {
                "name": "Pria: Textured Crop",
                "description": "Potongan pendek bertekstur dengan volume sisi seimbang.",
                "reason": "Memberi proporsi lebih lebar tanpa volume tinggi berlebihan.",
                "image_url": "/images/hairstyles/textured_crop.webp",
            },
            {
                "name": "Wanita: Shoulder-Length Shag",
                "description": "Shag sebahu dengan layer dan volume samping.",
                "reason": "Panjang sebahu dan volume samping membantu menyeimbangkan wajah memanjang.",
            },
            {
                "name": "Wanita: Side-Swept Bangs with Layers",
                "description": "Poni menyamping dipadukan dengan layer.",
                "reason": "Poni dan layer memberi kesan lebih lebar pada sisi wajah.",
            },
            {
                "name": "Wanita: Wavy Lob",
                "description": "Lob bergelombang dengan ujung bertekstur.",
                "reason": "Gelombang di sekitar sisi wajah menambah kesan lebar dan lembut.",
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
                "name": "Pria: Textured Crop",
                "description": "Poni bertekstur dengan sisi proporsional tidak terlalu tipis.",
                "reason": "Melembutkan sudut tajam tulang pipi dan menambah dimensi pada dahi.",
                "image_url": "/images/hairstyles/french_crop.jpg",
            },
            {
                "name": "Pria: Side Fringe / Side Swept",
                "description": "Poni samping yang jatuh alami di atas dahi.",
                "reason": "Menyeimbangkan lebar tulang pipi dan menyamarkan dahi sempit.",
                "image_url": "/images/hairstyles/side_part.jpg",
            },
            {
                "name": "Pria: Messy Quiff",
                "description": "Volume medium di bagian atas dan samping yang tidak terlalu tipis.",
                "reason": "Memberikan proporsi seimbang antara dahi dan dagu lancip.",
                "image_url": "/images/hairstyles/quiff.jpg",
            },
            {
                "name": "Wanita: Wavy Side Part",
                "description": "Rambut sebahu bergelombang dengan belahan samping.",
                "reason": "Panjang sebahu dan belahan samping menonjolkan tulang pipi tanpa menambah panjang visual.",
            },
            {
                "name": "Wanita: Side-Parted Lob",
                "description": "Lob bertekstur dengan belahan samping.",
                "reason": "Panjang lebih pendek dan gelombang lembut menjaga keseimbangan wajah diamond.",
            },
            {
                "name": "Wanita: Soft Shoulder-Length Layers",
                "description": "Layer lembut sebahu dengan gelombang ringan.",
                "reason": "Tekstur lembut membingkai tulang pipi dan mempertahankan proporsi.",
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
