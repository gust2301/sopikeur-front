import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogProduct, catalogProducts } from '../../shared/data/catalog';

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

  readonly product = computed(() => this.productSignal());

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const productId = params.get('id');
      const foundProduct = catalogProducts.find(item => item.id === productId);

      if (!foundProduct) {
        this.router.navigate(['/']);
        return;
      }

      this.productSignal.set(foundProduct);
    });
  }

  get relatedProducts(): CatalogProduct[] {
    const currentId = this.productSignal()?.id;
    return catalogProducts.filter(item => item.id !== currentId).slice(0, 3);
  }

  navigateTo(product: CatalogProduct): void {
    this.router.navigate(['/product-detail', product.id]);
  }

  goToQuote(): void {
    this.router.navigate(['/'], { fragment: 'contact' });
  }
}
