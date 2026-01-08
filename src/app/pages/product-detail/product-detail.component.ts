import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogProduct, catalogProducts } from '../../shared/data/catalog';
import { buildWhatsappLink } from '../../shared/utils/whatsapp';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private readonly productSignal = signal<CatalogProduct | undefined>(undefined);
  private readonly selectedImageSignal = signal<string | undefined>(undefined);

  readonly product = computed(() => this.productSignal());
  readonly selectedImage = computed(() => this.selectedImageSignal());

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const productId = params.get('id');
      const type = params.get('type');
      const foundProduct = catalogProducts.find(item => item.id === productId && item.type === type);

      if (!foundProduct) {
        this.router.navigate(['/']);
        return;
      }

      this.productSignal.set(foundProduct);
      this.selectedImageSignal.set(foundProduct.images?.[0] ?? foundProduct.image);
    });
  }

  get relatedProducts(): CatalogProduct[] {
    const currentId = this.productSignal()?.id;
    const type = this.productSignal()?.type;
    return catalogProducts.filter(item => item.type === type && item.id !== currentId).slice(0, 3);
  }

  navigateTo(product: CatalogProduct): void {
    this.router.navigate(['/product', product.type, product.id]);
  }

  selectImage(image: string): void {
    this.selectedImageSignal.set(image);
  }

  getWhatsappLink(product: CatalogProduct): string {
    return buildWhatsappLink(product.name, product.sku);
  }
}
