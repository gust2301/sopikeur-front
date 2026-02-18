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
