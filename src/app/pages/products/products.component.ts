import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  shareReplay,
  startWith,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { CatalogProduct, CatalogProductType } from '../../shared/models/catalog-product.model';
import { ProductsApi, ProductPage, ProductStockStatus } from '../../shared/services/products-api.service';
import { CartService } from '../../shared/services/cart.service';

const STOCK_FILTERS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'IN_STOCK', label: 'En stock' },
  { value: 'PREORDER', label: 'Précommande' },
] as const;

type StockFilter = (typeof STOCK_FILTERS)[number]['value'];

interface ProductsViewModel {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  pages: number[];
  type: CatalogProductType;
  title: string;
  subtitle: string;
  loading: boolean;
  error?: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApi);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  readonly stockFilters = STOCK_FILTERS;
  readonly pageSizeOptions = [12, 16];

  searchText = '';
  stockSelection: StockFilter = 'ALL';
  pageSize = 12;

  private readonly searchInput$ = new Subject<string>();
  private readonly query$ = new BehaviorSubject<string>('');
  private readonly stock$ = new BehaviorSubject<StockFilter>('ALL');
  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly pageSize$ = new BehaviorSubject<number>(this.pageSize);

  private readonly type$ = this.route.data.pipe(
    map(data => (data['type'] as 'SPC' | 'PANEL' | undefined) ?? 'SPC'),
    map(type => (type === 'PANEL' ? 'acoustic' : 'spc') as CatalogProductType),
    tap(() => this.resetFilters()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly uiMessage = this.cartService.uiMessage;

  readonly vm$ = combineLatest({
    type: this.type$,
    query: this.query$,
    stock: this.stock$,
    page: this.page$,
    pageSize: this.pageSize$,
  }).pipe(
    switchMap(({ type, query, stock, page, pageSize }) =>
      this.productsApi
        .getProducts({
          type,
          page,
          size: pageSize,
          q: query || undefined,
          stockStatus: stock === 'ALL' ? undefined : (stock as ProductStockStatus),
        })
        .pipe(
          map(result => this.buildViewModel(result, { type, page, pageSize })),
          startWith(this.buildViewModel({ items: [], total: 0 }, { type, page, pageSize }, true)),
          catchError(() =>
            of(
              this.buildViewModel(
                { items: [], total: 0 },
                { type, page, pageSize },
                false,
                'Impossible de charger les produits pour le moment.',
              ),
            ),
          ),
        ),
    ),
  );

  constructor() {
    this.searchInput$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.query$.next(value.trim());
        this.page$.next(1);
      });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.searchInput$.next(value);
  }

  onStockChange(value: StockFilter): void {
    this.stockSelection = value;
    this.stock$.next(value);
    this.page$.next(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageSize$.next(size);
    this.page$.next(1);
  }

  goToPage(page: number): void {
    this.page$.next(page);
  }

  trackById(_: number, item: CatalogProduct): string {
    return item.id;
  }

  trackByPage(_: number, page: number): number {
    return page;
  }

  dismissMessage(): void {
    this.cartService.clearMessage();
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  handlePrimaryAction(product: CatalogProduct): void {
    if (product.inStock) {
      this.cartService.addProduct(product);
      return;
    }

    void this.router.navigate(['/precommande'], { queryParams: { productId: product.id, productType: product.type } });
  }

  getStockLabel(product: CatalogProduct): string {
    const status = this.resolveStockStatus(product);

    switch (status) {
      case 'IN_STOCK':
        return 'En stock';
      case 'PREORDER':
        return 'PRÉCOMMANDE';
      default:
        return 'PRÉCOMMANDE';
    }
  }

  isPreorder(product: CatalogProduct): boolean {
    return this.resolveStockStatus(product) === 'PREORDER';
  }

  private resetFilters(): void {
    this.searchText = '';
    this.stockSelection = 'ALL';
    this.pageSize = 12;
    this.query$.next('');
    this.stock$.next('ALL');
    this.pageSize$.next(12);
    this.page$.next(1);
  }

  private buildViewModel(
    result: ProductPage,
    options: { type: CatalogProductType; page: number; pageSize: number },
    loading = false,
    error?: string,
  ): ProductsViewModel {
    const totalPages = Math.max(1, Math.ceil(result.total / options.pageSize));
    const safePage = Math.min(options.page, totalPages);

    if (safePage !== options.page) {
      this.page$.next(safePage);
    }

    const title = options.type === 'spc' ? 'Revêtements SPC' : 'Panneaux acoustiques';
    const subtitle =
      options.type === 'spc'
        ? 'Liste complète de nos teintes SPC avec recherche et disponibilité.'
        : 'Nos panneaux acoustiques avec recherche rapide et statut de stock.';

    return {
      products: this.sortByAvailability(result.items),
      total: result.total,
      page: safePage,
      pageSize: options.pageSize,
      pages: Array.from({ length: totalPages }, (_, index) => index + 1),
      type: options.type,
      title,
      subtitle,
      loading,
      error,
    };
  }


  private sortByAvailability(items: CatalogProduct[]): CatalogProduct[] {
    return [...items].sort((a, b) => Number(Boolean(b.inStock)) - Number(Boolean(a.inStock)));
  }

  private resolveStockStatus(product: CatalogProduct): ProductStockStatus {
    const apiStatus = (product as { stockStatus?: ProductStockStatus }).stockStatus;

    if (apiStatus === 'IN_STOCK') {
      return 'IN_STOCK';
    }

    if (apiStatus === 'PREORDER' || apiStatus === 'OUT_OF_STOCK') {
      return 'PREORDER';
    }

    if (product.inStock === true) {
      return 'IN_STOCK';
    }

    return 'PREORDER';
  }
}
