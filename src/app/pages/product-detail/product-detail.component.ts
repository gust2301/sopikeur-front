import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, NgZone, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogProduct, CatalogProductType } from '../../shared/models/catalog-product.model';
import { CartService } from '../../shared/services/cart.service';
import { ProductsApi } from '../../shared/services/products-api.service';
import { environment } from '../../../environments/environment';
import { assetUrl } from '../../shared/utils/asset-url';
import { buildProductDetails, parseDescriptionContent } from './product-details.util';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [CommonModule, RouterModule, AssetUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements AfterViewInit {
  private static readonly placeholderImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="%23f4f0e7"/><rect x="120" y="160" width="960" height="580" rx="32" fill="%23ffffff" stroke="%23e6dfd2" stroke-width="6"/><path d="M340 610l150-190 130 160 190-240 190 270H340z" fill="%23e6dfd2"/><circle cx="480" cy="360" r="60" fill="%23e6dfd2"/><text x="600" y="520" font-family="Arial, sans-serif" font-size="42" fill="%23908978" text-anchor="middle">Aucune image</text></svg>';
  private readonly productSignal = signal<CatalogProduct | undefined>(undefined);
  private readonly relatedProductsSignal = signal<CatalogProduct[]>([]);
  private readonly galleryImagesSignal = signal<string[]>([]);
  private readonly selectedIndexSignal = signal(0);
  private touchStartX: number | null = null;

  readonly product = computed(() => this.productSignal());
  readonly galleryImages = computed(() => this.galleryImagesSignal());
  readonly selectedImage = computed(() => this.galleryImagesSignal()[this.selectedIndexSignal()] ?? undefined);
  readonly backToCatalogRoute = computed(() => (this.productSignal()?.type === 'acoustic' ? '/panneaux/' : '/spc/'));
  readonly productDetails = computed(() =>
    buildProductDetails({
      type: this.productSignal()?.type,
      descriptionShort: this.productSignal()?.shortDescription,
      descriptionLong: this.productSignal()?.descriptionLong ?? this.productSignal()?.description,
      dimensions: this.productSignal()?.dimensions ?? this.productSignal()?.specs?.join(' • '),
      features: this.productSignal()?.features,
    }),
  );
  readonly descriptionContent = computed(() => parseDescriptionContent(this.productDetails().longDescription));

  @ViewChild('hero', { static: false }) private readonly heroEl?: ElementRef<HTMLElement>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly cartService: CartService,
    private readonly productsApi: ProductsApi,
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const productId = params.get('id');
      const typeParam = params.get('type');
      const type = typeParam === 'acoustic' ? 'acoustic' : 'spc';

      if (!productId) {
        this.router.navigate(['/']);
        return;
      }

      this.productsApi.getProductById(type, productId).subscribe({
        next: foundProduct => {
          if (!foundProduct) {
            this.router.navigate(['/']);
            return;
          }

          this.productSignal.set(foundProduct);
          void this.updateGallery(foundProduct);
          this.loadRelatedProducts(type, foundProduct.id);
          this.scrollToHero();
        },
        error: () => this.router.navigate([type === 'acoustic' ? '/panneaux/' : '/spc/']),
      });
    });
  }

  ngAfterViewInit(): void {
    this.scrollToHero();
  }

  get relatedProducts(): CatalogProduct[] {
    return this.relatedProductsSignal();
  }

  navigateTo(product: CatalogProduct): void {
    this.router.navigate(['/product', product.type, product.id]);
  }

  getRelatedImage(product: CatalogProduct): string {
    if (product.type === 'spc') {
      return this.toAssetUrl(`spc/${product.sku}_lame.png`);
    }
    return this.toAssetUrl(product.image);
  }

  selectImage(image: string): void {
    const index = this.galleryImagesSignal().indexOf(image);
    if (index >= 0) {
      this.selectedIndexSignal.set(index);
    }
  }

  nextImage(): void {
    const images = this.galleryImagesSignal();
    if (images.length <= 1) {
      return;
    }
    this.selectedIndexSignal.set((this.selectedIndexSignal() + 1) % images.length);
  }

  previousImage(): void {
    const images = this.galleryImagesSignal();
    if (images.length <= 1) {
      return;
    }
    this.selectedIndexSignal.set((this.selectedIndexSignal() - 1 + images.length) % images.length);
  }

  onTouchStart(event: TouchEvent): void {
    if (this.galleryImagesSignal().length <= 1) {
      return;
    }
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null || this.galleryImagesSignal().length <= 1) {
      this.touchStartX = null;
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const deltaX = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(deltaX) < 40) {
      return;
    }
    if (deltaX < 0) {
      this.nextImage();
    } else {
      this.previousImage();
    }
  }

  readonly uiMessage = this.cartService.uiMessage;

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

  private loadRelatedProducts(type: CatalogProductType, currentId: string): void {
    this.productsApi.getProducts({ type, page: 1, size: 8 }).subscribe({
      next: response => {
        const items = response.items.filter(item => item.id !== currentId).slice(0, 3);
        this.relatedProductsSignal.set(items);
      },
    });
  }

  private async updateGallery(product: CatalogProduct): Promise<void> {
    const candidates = this.buildCandidateImages(product);
    if (candidates.length === 0) {
      this.galleryImagesSignal.set([ProductDetailComponent.placeholderImage]);
      this.selectedIndexSignal.set(0);
      return;
    }

    await this.zone.runOutsideAngular(async () => {
      const galleryImages = await this.filterExistingImages(candidates);
      const images = galleryImages.length > 0 ? galleryImages : [ProductDetailComponent.placeholderImage];
      this.zone.run(() => {
        this.galleryImagesSignal.set(images);
        this.selectedIndexSignal.set(0);
      });
    });
  }

  private buildCandidateImages(product: CatalogProduct): string[] {
    const sku = product.sku;
    const candidates =
      product.type === 'spc'
        ? [
            this.toAssetUrl(`spc/${sku}_lame.png`),
            this.toAssetUrl(`spc/${sku}.png`),
            this.toAssetUrl(`spc/${sku}_home.png`),
          ]
        : [
            this.toAssetUrl(`panels/${sku}.png`),
            this.toAssetUrl(`panels/bed_${sku}.png`),
            this.toAssetUrl(`panels/wall_${sku}.png`),
          ];
    const fallbackImages = [...(product.images ?? []), product.image]
      .filter(Boolean)
      .map(image => this.toAssetUrl(image));
    return Array.from(new Set([...candidates, ...fallbackImages]));
  }

  private async filterExistingImages(images: string[]): Promise<string[]> {
    if (typeof Image === 'undefined') {
      return images;
    }
    const checks = await Promise.all(
      images.map(
        image =>
          new Promise<boolean>(resolve => {
            const probe = new Image();
            probe.onload = () => resolve(true);
            probe.onerror = () => resolve(false);
            probe.src = image;
          }),
      ),
    );
    return images.filter((_, index) => checks[index]);
  }

  private scrollToHero(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const hero = this.heroEl?.nativeElement;
    if (hero) {
      setTimeout(() => {
        if (typeof hero.scrollIntoView === 'function') {
          hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
      return;
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  toAssetUrl(image: string | null | undefined): string {
    if (image?.startsWith('data:')) {
      return image;
    }
    return assetUrl(image, environment.assetBaseUrl);
  }
}
