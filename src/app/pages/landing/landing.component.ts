import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { CatalogProduct } from '../../shared/models/catalog-product.model';
import { CartService } from '../../shared/services/cart.service';
import { ProductsApi } from '../../shared/services/products-api.service';

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  imports: [CommonModule, RouterModule, AssetUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  @ViewChild('colorsTrack') colorsTrack?: ElementRef<HTMLDivElement>;
  @ViewChild('panelsTrack') panelsTrack?: ElementRef<HTMLDivElement>;

  colors: CatalogProduct[] = [];
  acousticPanels: CatalogProduct[] = [];

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly productsApi = inject(ProductsApi);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.productsApi.getProducts({ type: 'spc', page: 1, size: 20 }).subscribe({
      next: response => {
        this.colors = this.sortByAvailability(response.items);
        this.cdr.markForCheck();
      },
    });

    this.productsApi.getProducts({ type: 'acoustic', page: 1, size: 20 }).subscribe({
      next: response => {
        this.acousticPanels = this.sortByAvailability(response.items);
        this.cdr.markForCheck();
      },
    });
  }

  viewProduct(product: CatalogProduct): void {
    this.router.navigate(['/product', product.type, product.id]);
  }

  scrollColors(direction: 'left' | 'right'): void {
    this.scrollByCard(this.colorsTrack?.nativeElement, direction);
  }

  scrollPanels(direction: 'left' | 'right'): void {
    this.scrollByCard(this.panelsTrack?.nativeElement, direction);
  }

  handlePrimaryAction(product: CatalogProduct): void {
    if (product.inStock) {
      this.cartService.addProduct(product);
      return;
    }

    void this.router.navigate(['/precommande'], { queryParams: { productId: product.id, productType: product.type } });
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  openProQuoteForm(): void {
    void this.router.navigate(['/devis'], { queryParams: { intent: 'quote', customerType: 'Professionnel' } });
  }

  private sortByAvailability(items: CatalogProduct[]): CatalogProduct[] {
    return [...items].sort((a, b) => Number(Boolean(b.inStock)) - Number(Boolean(a.inStock)));
  }

  private scrollByCard(track: HTMLDivElement | undefined, direction: 'left' | 'right'): void {
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>('.catalog-card');
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0');
    const cardWidth = card?.getBoundingClientRect().width ?? track.clientWidth;
    const scrollAmount = (cardWidth + gap) * 0.8;
    track.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}
