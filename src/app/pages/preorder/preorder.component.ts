import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CatalogProduct, CatalogProductType } from '../../shared/models/catalog-product.model';
import { ProductsApi } from '../../shared/services/products-api.service';
import { FeedbackAction, FeedbackBannerComponent } from '../../shared/ui/feedback-banner/feedback-banner.component';
import { PreordersApiService } from '../../shared/services/preorders-api.service';
import { LocationsService } from '../../shared/services/locations.service';
import { environment } from '../../../environments/environment';
import { CitySelectComponent } from '../../shared/ui/city-select/city-select.component';

@Component({
  selector: 'app-preorder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FeedbackBannerComponent, CitySelectComponent],
  templateUrl: './preorder.component.html',
  styleUrl: './preorder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreorderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly preorderApi = inject(PreordersApiService);
  private readonly locationsService = inject(LocationsService);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApi);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  submitted = false;
  responseRef?: string;
  errorMessage?: string;
  selectedProduct?: CatalogProduct;

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    city: ['', Validators.required],
    area: [''],
    address: [''],
    notes: [''],
    installRequested: [false],
    quantity: [1, [Validators.required, Validators.min(1)]],
    message: [''],
    acceptsDelay: [false, Validators.requiredTrue],
  });

  cities: string[] = [];
  cityLoadError = false;

  get successActions(): FeedbackAction[] {
    return [
      { label: 'Nouvelle demande', kind: 'ghost', onClick: () => this.resetStatus() },
      { label: 'Continuer mes achats', kind: 'ghost', routerLink: ['/spc'] },
    ];
  }
  constructor() {
    const productId = this.route.snapshot.queryParamMap.get('productId');
    const productType = this.route.snapshot.queryParamMap.get('productType');

    this.locationsService.getCities().subscribe(cities => {
      this.cities = cities;
      this.cdr.markForCheck();
    });

    this.locationsService.hasLoadError$.subscribe(hasError => {
      this.cityLoadError = hasError;
      this.cdr.markForCheck();
    });

    if (!productId) {
      return;
    }

    const preferredType: CatalogProductType = productType === 'acoustic' ? 'acoustic' : 'spc';
    const secondaryType: CatalogProductType = preferredType === 'spc' ? 'acoustic' : 'spc';

    forkJoin([
      this.productsApi.getProductById(preferredType, productId),
      this.productsApi.getProductById(secondaryType, productId),
    ]).subscribe({
      next: ([preferred, secondary]) => {
        this.ngZone.run(() => {
          this.selectedProduct = preferred ?? secondary;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.selectedProduct = undefined;
          this.cdr.markForCheck();
        });
      },
    });
  }

  get hasSelectedProduct(): boolean {
    return Boolean(this.selectedProduct);
  }

  shouldShowError(control: AbstractControl | null): boolean {
    if (!control) {
      return false;
    }

    return this.submitted || control.touched || control.dirty;
  }

  shouldShowCityError(): boolean {
    const control = this.form.get('city');
    return Boolean(control?.invalid && this.shouldShowError(control));
  }

  private toOptionalText(value: string | null | undefined): string | undefined {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  submitPreorder(): void {
    const product = this.selectedProduct;

    if (!product) {
      this.status = 'error';
      this.errorMessage = 'Choisissez un produit hors-stock depuis le catalogue.';
      return;
    }

    if (product.inStock) {
      this.status = 'error';
      this.errorMessage = 'Ce produit est en stock. Merci de l’ajouter au panier.';
      return;
    }

    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.status = 'error';
      this.errorMessage = 'Merci de renseigner les champs obligatoires.';
      return;
    }

    this.status = 'loading';
    this.errorMessage = undefined;

    const value = this.form.getRawValue();
    const payload = {
      contact: {
        fullName: (value.fullName ?? '').trim(),
        phone: (value.phone ?? '').trim(),
        email: this.toOptionalText(value.email),
      },
      delivery: {
        city: (value.city ?? '').trim(),
        area: this.toOptionalText(value.area),
        address: this.toOptionalText(value.address),
        notes: this.toOptionalText(value.notes),
      },
      installRequested: value.installRequested === true,
      acceptsDelay: value.acceptsDelay === true,
      message: this.toOptionalText(value.message),
      items: [
        {
          sku: product.sku,
          productId: String(product.id),
          qty: Number(value.quantity) || 1,
          unit: product.type === 'spc' ? 'M2' as const : 'PIECE' as const,
        },
      ],
    };

    if (!environment.production) {
      console.debug('PreorderCreateRequest payload', payload);
    }

    this.preorderApi.createPreorder(payload).subscribe({
        next: response => {
          this.ngZone.run(() => {
            this.status = 'success';
            this.responseRef = response?.preorderNumber ?? response?.id;
            this.form.reset({
              fullName: '',
              phone: '',
              email: '',
              city: '',
              area: '',
              address: '',
              notes: '',
              installRequested: false,
              quantity: 1,
              message: '',
              acceptsDelay: false,
            });
            this.submitted = false;
            this.cdr.markForCheck();
          });
        },
        error: error => {
          this.ngZone.run(() => {
            const backendMessage = error?.error?.message || error?.error?.detail;
            this.status = 'error';
            this.errorMessage = backendMessage || 'Impossible d’envoyer la précommande pour le moment. Merci de réessayer.';
            this.cdr.markForCheck();
          });
        },
      });
  }

  private resetStatus(): void {
    this.status = 'idle';
    this.responseRef = undefined;
    this.errorMessage = undefined;
    this.submitted = false;
  }
}
