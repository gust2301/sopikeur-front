import { CatalogProduct, CatalogProductType } from '../data/catalog';

export type ProductStockStatus = 'IN_STOCK' | 'PREORDER' | 'OUT_OF_STOCK';

export interface ProductDto {
  id?: string;
  slug?: string;
  sku?: string;
  type?: string;
  productType?: string;
  name?: string;
  title?: string;
  image?: string;
  mainImage?: string;
  coverUrl?: string;
  images?: string[];
  specs?: string[];
  price?: string | number;
  unit?: string;
  inStock?: boolean;
  stockStatus?: ProductStockStatus;
  shortDescription?: string;
  descriptionShort?: string;
  description?: string;
  longDescription?: string;
  features?: string[];
}

export interface ProductPageDto {
  items?: ProductDto[];
  total?: number;
  data?: ProductDto[];
}

export type ProductsApiResponse = ProductPageDto | ProductDto[];

export function normalizeApiProductsResponse(
  body: ProductsApiResponse,
  expectedType: CatalogProductType,
): { items: CatalogProduct[]; total: number } {
  if (Array.isArray(body)) {
    const items = body.map(item => toCatalogProduct(item, expectedType));
    return { items, total: items.length };
  }

  const rawItems = body.items ?? body.data ?? [];
  const items = Array.isArray(rawItems) ? rawItems.map(item => toCatalogProduct(item, expectedType)) : [];
  const total = typeof body.total === 'number' ? body.total : items.length;

  return { items, total };
}

function toCatalogProduct(dto: ProductDto, expectedType: CatalogProductType): CatalogProduct {
  const type = normalizeType(dto.type ?? dto.productType, expectedType);
  const sku = String(dto.sku ?? dto.name ?? dto.id ?? dto.slug ?? 'UNKNOWN').trim();
  const id = String(dto.id ?? dto.slug ?? sku).trim().toLowerCase();
  const name = String(dto.name ?? dto.title ?? sku).trim();
  const shortDescription = String(dto.shortDescription ?? dto.descriptionShort ?? dto.description ?? '').trim();
  const description = String(dto.longDescription ?? dto.description ?? shortDescription).trim();
  const image = resolveImage(dto, type);
  const price = dto.price === undefined || dto.price === null ? '—' : String(dto.price);
  const unit = String(dto.unit ?? (type === 'spc' ? 'FCFA / m²' : 'FCFA / pièce'));
  const inStock = resolveInStock(dto);

  return {
    id,
    sku,
    type,
    name,
    image,
    images: Array.isArray(dto.images) && dto.images.length > 0 ? dto.images : [image],
    specs: Array.isArray(dto.specs) ? dto.specs : [],
    price,
    unit,
    inStock,
    shortDescription,
    description,
    features: Array.isArray(dto.features) ? dto.features : [],
    ...(dto.stockStatus ? { stockStatus: dto.stockStatus } : {}),
  };
}

function normalizeType(rawType: string | undefined, fallback: CatalogProductType): CatalogProductType {
  if (!rawType) {
    return fallback;
  }

  const normalized = rawType.toLowerCase();

  if (normalized === 'spc') {
    return 'spc';
  }

  if (normalized === 'panel' || normalized === 'acoustic') {
    return 'acoustic';
  }

  return fallback;
}

function resolveImage(dto: ProductDto, type: CatalogProductType): string {
  const candidate = dto.mainImage ?? dto.coverUrl ?? dto.image;

  if (candidate && candidate.trim()) {
    return candidate;
  }

  return type === 'spc' ? 'assets/spc/SPC006.png' : 'assets/panels/M-60240-WAVE1.png';
}

function resolveInStock(dto: ProductDto): boolean | undefined {
  if (typeof dto.inStock === 'boolean') {
    return dto.inStock;
  }

  if (!dto.stockStatus) {
    return undefined;
  }

  return dto.stockStatus === 'IN_STOCK';
}
