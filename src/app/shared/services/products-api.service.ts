import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { CatalogProduct, CatalogProductType } from '../models/catalog-product.model';
import { apiUrl } from '../utils/api-url';
import { ProductDto, ProductsApiResponse, normalizeApiProductsResponse } from './products-api.mapper';

export type ProductStockStatus = 'IN_STOCK' | 'PREORDER' | 'OUT_OF_STOCK';

export interface ProductQuery {
  type?: CatalogProductType;
  page?: number;
  size?: number;
  q?: string;
  stock?: ProductStockStatus | 'ALL';
  featured?: boolean;
}

export interface ProductPage {
  items: CatalogProduct[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsApi {
  private readonly apiUrl = apiUrl('/products');

  constructor(private readonly http: HttpClient) {}

  getProducts(query: ProductQuery): Observable<ProductPage> {
    const normalizedQuery: Required<Pick<ProductQuery, 'page' | 'size'>> & ProductQuery = {
      page: query.page ?? 1,
      size: query.size ?? 12,
      ...query,
    };

    return this.http
      .get<ProductsApiResponse>(this.apiUrl, { params: this.buildParams(normalizedQuery), observe: 'response' })
      .pipe(map(response => this.normalizeResponse(response, normalizedQuery.type ?? 'spc')));
  }

  getCatalogProducts(): Observable<CatalogProduct[]> {
    return forkJoin([
      this.getProducts({ type: 'spc', page: 1, size: 100 }),
      this.getProducts({ type: 'acoustic', page: 1, size: 100 }),
    ]).pipe(map(([spc, acoustic]) => [...spc.items, ...acoustic.items]));
  }

  getProductById(type: CatalogProductType, productId: string): Observable<CatalogProduct | undefined> {
    return this.http
      .get<ProductDto>(`${this.apiUrl}/${encodeURIComponent(productId)}`)
      .pipe(
        map(dto => normalizeApiProductsResponse([dto], type).items[0]),
      );
  }

  private buildParams(query: ProductQuery): HttpParams {
    const params: Record<string, string> = {
      page: String(query.page ?? 1),
      size: String(query.size ?? 12),
    };

    if (query.type) {
      params.type = query.type === 'spc' ? 'SPC' : 'PANEL';
    }

    if (query.q) {
      params.q = query.q;
    }

    if (query.stock && query.stock !== 'ALL') {
      params.stock = query.stock;
    }

    if (typeof query.featured === 'boolean') {
      params.featured = String(query.featured);
    }

    return new HttpParams({ fromObject: params });
  }

  private normalizeResponse(response: HttpResponse<ProductsApiResponse>, expectedType: CatalogProductType): ProductPage {
    const body = response.body;

    if (!body) {
      return { items: [], total: 0 };
    }

    const normalized = normalizeApiProductsResponse(body, expectedType);

    return {
      items: normalized.items,
      total: this.resolveTotal(response, normalized.total),
    };
  }

  private resolveTotal(response: HttpResponse<ProductsApiResponse>, fallback: number): number {
    const headerValue = response.headers.get('x-total-count') ?? response.headers.get('X-Total-Count');

    if (!headerValue) {
      return fallback;
    }

    const parsed = Number(headerValue);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

}
