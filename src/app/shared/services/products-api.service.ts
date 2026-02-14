import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, map, of } from 'rxjs';
import { CatalogProduct, CatalogProductType, catalogProducts } from '../data/catalog';
import { apiUrl } from '../utils/api-url';
import { environment } from '../../../environments/environment';
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
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly http: HttpClient) {}

  getProducts(query: ProductQuery): Observable<ProductPage> {
    const params = this.buildParams(query);

    if (!this.shouldUseApi()) {
      return of(this.paginateClient(catalogProducts, query));
    }

    return this.http
      .get<ProductsApiResponse>(this.apiUrl, { params, observe: 'response' })
      .pipe(
        map(response => {
          if (environment.debugProductsApi) {
            const raw = response.body;
            console.log('[ProductsApi] raw resp', raw, {
              typeOf: typeof raw,
              isArray: Array.isArray(raw),
            });
          }

          return this.normalizeResponse(response, query);
        }),
        catchError(() => of(this.paginateClient(catalogProducts, query))),
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

  private normalizeResponse(response: HttpResponse<ProductsApiResponse>, query: ProductQuery): ProductPage {
    const body = response.body;

    if (!body) {
      return this.paginateClient(catalogProducts, query);
    }

    const normalized = normalizeApiProductsResponse(body, query.type);

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

  private paginateClient(items: CatalogProduct[], query: ProductQuery): ProductPage {
    const filtered = this.filterItems(items, query);
    const startIndex = Math.max(query.page - 1, 0) * query.size;
    const paged = filtered.slice(startIndex, startIndex + query.size);

    return {
      items: paged,
      total: filtered.length,
    };
  }

  private filterItems(items: CatalogProduct[], query: ProductQuery): CatalogProduct[] {
    const normalizedQuery = this.normalizeQuery(query.q);

    return items.filter(item => {
      if (item.type !== query.type) {
        return false;
      }

      if (query.stockStatus && this.resolveStockStatus(item) !== query.stockStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const name = this.normalizeQuery(item.name);
      const sku = this.normalizeQuery(item.sku);
      const slug = this.normalizeQuery(item.id);

      return name.includes(normalizedQuery) || sku.includes(normalizedQuery) || slug.includes(normalizedQuery);
    });
  }

  private normalizeQuery(value?: string): string {
    if (!value) {
      return '';
    }

    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private resolveStockStatus(product: CatalogProduct): ProductStockStatus {
    const apiStatus = (product as { stockStatus?: ProductStockStatus }).stockStatus;

    if (apiStatus) {
      return apiStatus;
    }

    if (product.inStock === true) {
      return 'IN_STOCK';
    }

    if (product.inStock === false) {
      return 'PREORDER';
    }

    return 'OUT_OF_STOCK';
  }

  private shouldUseApi(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const hostname = window.location.hostname;

    return hostname.endsWith('sopikeur.sn');
  }
}
