export type CatalogProductType = 'spc' | 'acoustic';

export interface CatalogProduct {
  id: string;
  sku: string;
  type: CatalogProductType;
  name: string;
  image: string;
  images?: string[];
  specs: string[];
  price: string;
  unit: string;
  inStock?: boolean;
  shortDescription: string;
  description: string;
  features?: string[];
}

export const spcProducts: CatalogProduct[] = [
  {
    id: 'spc006',
    sku: 'SPC006',
    type: 'spc',
    name: 'SPC006',
    image: 'assets/spc/SPC006.png',
    images: ['assets/spc/SPC006.png'],
    //badge: '#6A4A2E',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '20 000',
    unit: 'FCFA / m²',
    inStock: true,
    shortDescription: 'Noyer texturé profond au veinage marqué.',
    description:
      'Un noyer texturé profond, avec un veinage marqué pour un rendu premium et un caractère affirmé.',
    features: ['Teinte chaleureuse', 'Sous-couche intégrée', 'Facile d’entretien'],
  },
  {
    id: 'spc014',
    sku: 'SPC014',
    type: 'spc',
    name: 'SPC014',
    image: 'assets/spc/SPC014.png',
    images: ['assets/spc/SPC014.png'],
    // badge: '#B06A2F',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '20 000',
    unit: 'FCFA / m²',
    inStock: true,
    shortDescription: 'Chêne brun roux intense et chaleureux.',
    description:
      'Un chêne brun roux intense, avec une chaleur naturelle qui donne du relief aux intérieurs.',
    features: ['Look pierre claire', 'Sensation chaleureuse', 'Résiste aux variations climatiques'],
  },
  {
    id: 'spc001',
    sku: 'SPC001',
    type: 'spc',
    name: 'SPC001',
    image: 'assets/spc/SPC001.png',
    images: ['assets/spc/SPC001.png'],
    //badge: '#B77A3H', // miel / chêne chaud
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '20 000',
    unit: 'FCFA / m²',
    inStock: false,
    shortDescription: 'Chêne miel lumineux pour ambiances chaleureuses.',
    description:
      'Un chêne miel lumineux et chaleureux, idéal pour créer une ambiance accueillante et naturelle.',
    features: ['Aspect bois naturel', 'Compatible zones humides', 'Surface résistante aux chocs'],
  },
  {
    id: 'spc008',
    sku: 'SPC008',
    type: 'spc',
    name: 'SPC008',
    image: 'assets/spc/SPC008.png',
    images: ['assets/spc/SPC008.png'],
    // badge: '#D9CBB8', //
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '20 000',
    unit: 'FCFA / m²',
    inStock: false,
    shortDescription: 'Beige sable doux, effet pierre subtil.',
    description:
      'Un beige sable très doux, parfait pour agrandir visuellement les pièces et s’accorder avec tous les styles.',
    features: ['Effet pierre premium', 'Compatible pièces humides', 'Idéal bureaux et commerces'],
  },
  {
    id: 'spc010',
    sku: 'SPC010',
    type: 'spc',
    name: 'SPC010',
    image: 'assets/spc/SPC011.png',
    images: ['assets/spc/SPC011.png'],
    //badge: '#E9E6E0',
    specs: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
    price: '20 000',
    unit: 'FCFA / m²',
    inStock: false,
    shortDescription: 'Blanc chêne très clair, moderne et lumineux.',
    description:
      'Un blanc chêne très clair, moderne et épuré, idéal pour maximiser la lumière et un rendu contemporain.',
    features: ['Texture minérale', 'Haute stabilité dimensionnelle', 'Surface anti-dérapante'],
  },
];

export const acousticPanels: CatalogProduct[] = [
  {
    id: 'm-60240-wave1',
    sku: 'M-60240-WAVE1',
    type: 'acoustic',
    name: 'M-60240-WAVE1',
    image: 'assets/panels/M-60240-WAVE1.png',
    images: ['assets/panels/M-60240-WAVE1.png'],
    specs: ['2400×600', 'Épaisseur 21 mm', 'Feutre acoustique noir'],
    price: '35 000',
    unit: 'FCFA / pièce',
    inStock: true,
    shortDescription: 'Rainures ondulées pour une ambiance moderne et acoustique.',
    description:
      'Panneau mural rainuré au motif wave, idéal pour habiller un espace de vie tout en absorbant les bruits du quotidien.',
    features: ['Pose verticale ou horizontale', 'Finition huilée', 'Réduction sonore ciblée'],
  },
  {
    id: 'hexagon',
    sku: 'HEXAGON',
    type: 'acoustic',
    name: 'HEXAGON',
    image: 'assets/panels/HEXAGON.png',
    images: ['assets/panels/HEXAGON.png'],
    specs: ['600×600', 'Épaisseur 21 mm', 'Feutre acoustique noir'],
    price: '17 000',
    unit: 'FCFA / pièce',
    inStock: true,
    shortDescription: 'Hexagone clair pour des compositions murales lumineuses.',
    description:
      'Panneau hexagonal clair pour composer des murs graphiques tout en améliorant le confort acoustique.',
    features: ['Finition claire', 'Usage résidentiel & pro', 'Installation rapide'],
  },
  {
    id: 'hexagonb',
    sku: 'HEXAGONB',
    type: 'acoustic',
    name: 'HEXAGONB',
    image: 'assets/panels/HEXAGONB.png',
    images: ['assets/panels/HEXAGONB.png'],
    specs: ['600×600', 'Épaisseur 21 mm', 'Feutre acoustique noir'],
    price: '17 000',
    unit: 'FCFA / pièce',
    inStock: false,
    shortDescription: 'Motif hexagonal pour créer un mur graphique et chaleureux.',
    description:
      'Panneau mural hexagonal idéal pour composer un mur graphique et limiter la réverbération sonore.',
    features: ['Surface texturée', 'Usage résidentiel & pro', 'Installation rapide'],
  },
];

export const catalogProducts: CatalogProduct[] = [...spcProducts, ...acousticPanels];
