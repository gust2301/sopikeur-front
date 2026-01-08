export interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  specs: string[];
  price: string;
  description: string;
  features: string[];
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'spc001',
    name: 'SPC001',
    image: 'assets/catalog/SPC001.png',
    //badge: '#B77A3H', // miel / chêne chaud
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '12 500 FCFA/m²',
    description:
      'Un chêne miel lumineux et chaleureux, idéal pour créer une ambiance accueillante et naturelle.',
    features: ['Aspect bois naturel', 'Compatible zones humides', 'Surface résistante aux chocs'],
  },
  {
    id: 'spc006',
    name: 'SPC006',
    image: 'assets/catalog/SPC006.png',
    //badge: '#6A4A2E',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '13 200 FCFA/m²',
    description:
      'Un noyer texturé profond, avec un veinage marqué pour un rendu premium et un caractère affirmé.',
    features: ['Teinte chaleureuse', 'Sous-couche intégrée', 'Facile d’entretien'],
  },
  {
    id: 'spc008',
    name: 'SPC008',
    image: 'assets/catalog/SPC008.png',
   // badge: '#D9CBB8', //
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '14 800 FCFA/m²',
    description:
      'Un beige sable très doux, parfait pour agrandir visuellement les pièces et s’accorder avec tous les styles.',
    features: ['Effet pierre premium', 'Compatible pièces humides', 'Idéal bureaux et commerces'],
  },
  {
    id: 'spc010',
    name: 'SPC010',
    image: 'assets/catalog/SPC011.png',
    //badge: '#E9E6E0',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '13 900 FCFA/m²',
    description:
      'Un blanc chêne très clair, moderne et épuré, idéal pour maximiser la lumière et un rendu contemporain.',
    features: ['Texture minérale', 'Haute stabilité dimensionnelle', 'Surface anti-dérapante'],
  },
  {
    id: 'spc014',
    name: 'SPC014',
    image: 'assets/catalog/SPC014.png',
   // badge: '#B06A2F',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '12 800 FCFA/m²',
    description:
      'Un chêne brun roux intense, avec une chaleur naturelle qui donne du relief aux intérieurs.',
    features: ['Look pierre claire', 'Sensation chaleureuse', 'Résiste aux variations climatiques'],
  },
];
