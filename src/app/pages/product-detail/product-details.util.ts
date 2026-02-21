import { CatalogProductType } from '../../shared/models/catalog-product.model';

export interface ProductDetailResponse {
  type?: CatalogProductType | string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  dimensions?: string | null;
  features?: string[] | null;
}

export interface BuiltProductDetails {
  headline: string;
  shortDescription: string;
  longDescription: string;
  detailChips: string[];
  extraDetails: string[];
  installationManualUrl: string;
  installationManualLabel: string;
}

const DEFAULT_CHIPS: Record<'spc' | 'panel', string[]> = {
  spc: ['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click'],
  panel: ['600×600', 'Épaisseur 21 mm', 'Installation rapide'],
};

function normalizeType(type: ProductDetailResponse['type']): 'spc' | 'panel' {
  const normalizedType = String(type ?? '')
    .trim()
    .toLowerCase();

  if (normalizedType === 'spc') {
    return 'spc';
  }

  return 'panel';
}

function cleanText(value: string | null | undefined): string {
  return String(value ?? '').trim();
}

function parseDimensionTokens(dimensions: string): string[] {
  return dimensions
    .split(/\s*[•|]\s*|,\s+/)
    .map(token => token.trim())
    .filter(Boolean);
}

export function buildProductDetails(product: ProductDetailResponse): BuiltProductDetails {
  const productType = normalizeType(product.type);
  const shortDescriptionRaw = cleanText(product.descriptionShort);
  const longDescriptionRaw = cleanText(product.descriptionLong);

  const shortDescription = shortDescriptionRaw || longDescriptionRaw;
  const longDescription = longDescriptionRaw || shortDescriptionRaw || 'Description à venir.';

  const dimensions = cleanText(product.dimensions);
  const parsedTokens = dimensions ? parseDimensionTokens(dimensions) : [];
  const hasPoseChip = parsedTokens.some(token => /pose|click/i.test(token));
  const hasFeutreChip = parsedTokens.some(token => /feutre|acoust/i.test(token));

  const chips = parsedTokens.length > 0 ? parsedTokens.slice(0, 4) : [...DEFAULT_CHIPS[productType]];

  if (productType === 'spc' && !hasPoseChip && !chips.some(token => /pose|click/i.test(token))) {
    chips.push('Pose click');
  }

  if (productType === 'panel' && !hasFeutreChip && !chips.some(token => /feutre|acoust/i.test(token))) {
    chips.push('Feutre acoustique');
  }

  const extraDetails = [
    ...parsedTokens.slice(chips.length),
    ...(Array.isArray(product.features) ? product.features.map(feature => feature.trim()).filter(Boolean) : []),
  ];

  return {
    headline: productType === 'spc' ? 'SPC' : 'Panneaux acoustiques',
    shortDescription,
    longDescription,
    detailChips: chips.slice(0, 4),
    extraDetails,
    installationManualUrl: productType === 'spc' ? '/guide-installation-spc' : '/guide-installation-panneaux',
    installationManualLabel:
      productType === 'spc' ? 'Guide d’installation SPC' : 'Guide d’installation panneaux',
  };
}

export function parseDescriptionContent(text: string): { paragraphs: string[]; listItems: string[] } {
  const normalized = cleanText(text);
  if (!normalized) {
    return { paragraphs: [], listItems: [] };
  }

  const lines = normalized
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const isBulletList = lines.length > 1 && lines.every(line => /^[-•*]\s+/.test(line));
  if (isBulletList) {
    return {
      paragraphs: [],
      listItems: lines.map(line => line.replace(/^[-•*]\s+/, '').trim()).filter(Boolean),
    };
  }

  return {
    paragraphs: normalized
      .split(/\n{2,}/)
      .map(paragraph => paragraph.replace(/\n/g, ' ').trim())
      .filter(Boolean),
    listItems: [],
  };
}
