import { CatalogProduct, CatalogProductType } from '../models/catalog-product.model';
import { environment } from '../../../environments/environment';
import { assetUrl } from '../utils/asset-url';

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
  descriptionLong?: string;
  longDescription?: string;
  features?: string[];
  dimensions?: string;
}


export interface ProductPageDto {
  items?: ProductDto[];
  products?: ProductDto[];
  total?: number;
  data?: ProductDto[];
  page?: number;
  size?: number;
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

  const rawItems = body.products ?? body.items ?? body.data ?? [];
  const items = Array.isArray(rawItems) ? rawItems.map(item => toCatalogProduct(item, expectedType)) : [];
  const total = typeof body.total === 'number' ? body.total : items.length;

  return { items, total };
}

function toCatalogProduct(dto: ProductDto, expectedType: CatalogProductType): CatalogProduct {
  const type = normalizeType(dto.type ?? dto.productType, expectedType);
  const sku = String(dto.sku ?? dto.name ?? dto.id ?? dto.slug ?? 'UNKNOWN').trim();
  const id = String(dto.slug ?? dto.id ?? sku).trim().toLowerCase();
  const name = String(dto.name ?? dto.title ?? sku).trim();
  const shortDescription = String(dto.shortDescription ?? dto.descriptionShort ?? dto.description ?? '').trim();
  const descriptionLong = String(dto.descriptionLong ?? dto.longDescription ?? dto.description ?? shortDescription).trim();
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
    images: resolveImages(dto.images, image),
    specs: Array.isArray(dto.specs) ? dto.specs : [],
    price,
    unit,
    inStock,
    shortDescription,
    description: descriptionLong,
    descriptionLong,
    dimensions: String(dto.dimensions ?? '').trim(),
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
  const candidate = toCleanString(dto.mainImage) ?? toCleanString(dto.coverUrl) ?? toCleanString(dto.image);

  if (candidate) {
    return assetUrl(candidate, environment.assetBaseUrl);
  }

  return type === 'spc'
    ? assetUrl('spc/SPC006.png', environment.assetBaseUrl)
    : assetUrl('panels/M-60240-WAVE1.png', environment.assetBaseUrl);
}

function resolveImages(images: Array<string | null | undefined> | undefined, fallbackImage: string): string[] {
  if (!Array.isArray(images) || images.length === 0) {
    return [fallbackImage];
  }

  const normalized = images
    .map(toCleanString)
    .filter((path): path is string => Boolean(path))
    .map(path => assetUrl(path, environment.assetBaseUrl));

  return normalized.length > 0 ? normalized : [fallbackImage];
}

function toCleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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
