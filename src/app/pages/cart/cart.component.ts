import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { CitySelectComponent } from '../../shared/ui/city-select/city-select.component';
import { RouterModule } from '@angular/router';
import { FeedbackBannerComponent, FeedbackAction } from '../../shared/ui/feedback-banner/feedback-banner.component';
import { CartItem } from '../../shared/models/commerce.models';
import { CartService } from '../../shared/services/cart.service';
import { OrdersApiService } from '../../shared/services/orders-api.service';
import { LocationsService } from '../../shared/services/locations.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FeedbackBannerComponent, CitySelectComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  readonly currency = new Intl.NumberFormat('fr-FR');
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderApi = inject(OrdersApiService);
  private readonly locationsService = inject(LocationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('feedbackAnchor') private readonly feedbackAnchor?: ElementRef<HTMLElement>;
  @ViewChild('successState') private readonly successState?: ElementRef<HTMLElement>;

  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  responseRef?: string;
  errorMessage?: string;

  isMobile = false;
  productsOpen = true;
  deliveryOpen = true;

  private mediaQueryList?: MediaQueryList;
  private readonly onViewportChange = (event: MediaQueryListEvent): void => {
    this.applyViewportState(event.matches);
  };

  readonly items = this.cartService.items;
  readonly totalItems = this.cartService.count;
  readonly totalAmountFcfa = this.cartService.totalAmountFcfa;
  readonly isEmpty = computed(() => this.items().length === 0);

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    city: ['', Validators.required],
    area: [''],
    address: [''],
    installRequested: [false],
    notes: [''],
  });

  cities: string[] = [];
  cityLoadError = false;

  get installationLabel(): string {
    return this.form.get('installRequested')?.value ? 'Sur devis' : 'Non incluse (sur devis)';
  }

  shouldShowCityError(): boolean {
    const control = this.form.get('city');
    return Boolean(control?.invalid && (control.touched || control.dirty || this.status === 'error'));
  }


  ngOnInit(): void {
    this.locationsService.getCities().subscribe(cities => {
      this.cities = cities;
      this.cdr.markForCheck();
    });

    this.locationsService.hasLoadError$.subscribe(hasError => {
      this.cityLoadError = hasError;
      this.cdr.markForCheck();
    });

    if (typeof window === 'undefined' || !window.matchMedia) {
      this.applyViewportState(false);
      return;
    }

    this.mediaQueryList = window.matchMedia('(max-width: 900px)');
    this.applyViewportState(this.mediaQueryList.matches);
    this.mediaQueryList.addEventListener('change', this.onViewportChange);
  }

  ngOnDestroy(): void {
    this.mediaQueryList?.removeEventListener('change', this.onViewportChange);
  }

  toggleProducts(): void {
    if (!this.isMobile) {
      return;
    }

    this.productsOpen = !this.productsOpen;
  }

  toggleDelivery(): void {
    if (!this.isMobile) {
      return;
    }

    this.deliveryOpen = !this.deliveryOpen;
  }


  get successActions(): FeedbackAction[] {
    return [
      { label: 'Retour à l’accueil', routerLink: ['/'] }
    ];
  }

  increment(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty + 1);
  }

  decrement(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty - 1);
  }

  remove(productId: string): void {
    this.cartService.removeItem(productId);
  }


  getItemTitle(item: CartItem): string {
    return item.name || item.sku;
  }

  getTypeLabel(item: CartItem): string {
    return item.type === 'SPC' ? 'Sol SPC' : 'Panneau acoustique';
  }

  getUnitLabel(item: CartItem): string {
    return item.unit === 'M2' ? 'm²' : 'pièce';
  }

  onQuantityInput(productId: string, rawValue: string): void {
    const nextValue = Number.parseFloat(rawValue);
    if (Number.isNaN(nextValue)) {
      return;
    }

    this.cartService.updateQuantity(productId, nextValue);
  }

  private toOptionalText(value: string | null | undefined): string | undefined {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  submitOrder(): void {
    if (this.form.invalid || this.isEmpty()) {
      this.form.markAllAsTouched();
      this.status = 'error';
      this.errorMessage = 'Merci de compléter les champs obligatoires et d’ajouter au moins un produit.';
      this.scrollToFeedback();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      customer: {
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
      cityZone: [this.toOptionalText(value.city), this.toOptionalText(value.area)].filter(Boolean).join(' / '),
      installRequested: value.installRequested === true,
      items: this.items().map(item => ({
        productId: String(item.productId),
        sku: item.sku,
        qty: Number(item.quantity),
        unit: item.unit,
      })),
    };

    if (!payload.cityZone) {
      payload.cityZone = undefined;
    }

    this.status = 'loading';
    this.errorMessage = undefined;

    this.orderApi
      .createOrder(payload)
      .pipe(
        tap(response => {
          const responseRef = response?.orderNumber ?? response?.id;
          this.handleSuccess(responseRef);
        }),
        catchError(error => {
          this.handleError(error, 'Impossible d’envoyer la commande, réessayez.');
          return EMPTY;
        }),
        finalize(() => this.cdr.markForCheck()),
      )
      .subscribe();
  }

  private handleSuccess(reference: string): void {
    this.status = 'success';
    this.responseRef = reference;
    this.scrollToFeedback();
    this.cartService.clear();
    this.focusSuccessState();
  }

  private handleError(error: any, fallbackMessage: string): void {
    this.status = 'error';
    this.errorMessage = this.extractBackendMessage(error) || fallbackMessage;
    this.scrollToFeedback();
  }

  private extractBackendMessage(error: any): string | null {
    return error?.error?.message || error?.error?.detail || null;
  }

  private focusSuccessState(): void {
    setTimeout(() => {
      this.successState?.nativeElement.focus();
    }, 0);
  }


  private applyViewportState(isMobile: boolean): void {
    this.isMobile = isMobile;

    if (isMobile) {
      this.productsOpen = false;
      this.deliveryOpen = true;
    } else {
      this.productsOpen = true;
      this.deliveryOpen = true;
    }

    this.cdr.markForCheck();
  }

  private scrollToFeedback(): void {
    setTimeout(() => {
      this.feedbackAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }
}
