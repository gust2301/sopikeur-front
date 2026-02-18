import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { CatalogProduct, CatalogProductType } from '../models/catalog-product.model';
import { apiUrl } from '../utils/api-url';
import { ProductsApiResponse, normalizeApiProductsResponse } from './products-api.mapper';

export type ProductStockStatus = 'IN_STOCK' | 'PREORDER' | 'OUT_OF_STOCK';

export interface ProductQuery {
  type: CatalogProductType;
  page: number;
  size: number;
  q?: string;
  stockStatus?: ProductStockStatus;
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
    return this.http
      .get<ProductsApiResponse>(this.apiUrl, { params: this.buildParams(query), observe: 'response' })
      .pipe(map(response => this.normalizeResponse(response, query.type)));
  }

  getCatalogProducts(): Observable<CatalogProduct[]> {
    return forkJoin([
      this.getProducts({ type: 'spc', page: 1, size: 100 }),
      this.getProducts({ type: 'acoustic', page: 1, size: 100 }),
    ]).pipe(map(([spc, acoustic]) => [...spc.items, ...acoustic.items]));
  }

  getProductById(type: CatalogProductType, productId: string): Observable<CatalogProduct | undefined> {
    return this.getProducts({ type, page: 1, size: 100, q: productId }).pipe(
      map(page => {
        const needle = this.normalizeValue(productId);

        return page.items.find(item => {
          const id = this.normalizeValue(item.id);
          const sku = this.normalizeValue(item.sku);
          return id === needle || sku === needle;
        });
      }),
    );
  }

  private buildParams(query: ProductQuery): HttpParams {
    const apiType = query.type === 'spc' ? 'SPC' : 'PANEL';
    const params: Record<string, string> = {
      type: apiType,
      page: String(query.page),
      size: String(query.size),
    };

    if (query.q) {
      params.q = query.q;
    }

    if (query.stockStatus) {
      params.stockStatus = query.stockStatus;
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

  private normalizeValue(value: string): string {
    return value.trim().toLowerCase();
  }
}
