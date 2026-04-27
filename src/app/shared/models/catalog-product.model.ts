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
  effectivePrice: string;
  originalPrice: string;
  promotionActive?: boolean;
  promoLabel?: string;
  discountPercent?: number;
  unit: string;
  inStock?: boolean;
  shortDescription: string;
  description: string;
  descriptionLong?: string;
  dimensions?: string;
  features?: string[];
}
