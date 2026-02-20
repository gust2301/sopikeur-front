import { CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogProduct } from '../../shared/models/catalog-product.model';
import { ProductsApi } from '../../shared/services/products-api.service';
import { FeedbackAction, FeedbackBannerComponent } from '../../shared/ui/feedback-banner/feedback-banner.component';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';
import { QuotesApiService } from '../../shared/services/quotes-api.service';
import { LocationsService } from '../../shared/services/locations.service';
import { environment } from '../../../environments/environment';
import { CitySelectComponent } from '../../shared/ui/city-select/city-select.component';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

interface QuoteProductSelection {
  product: CatalogProduct;
  selected: boolean;
  quantity: string;
}

interface PackSelection {
  id: string;
  label: string;
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-quote-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FeedbackBannerComponent, CitySelectComponent],
  templateUrl: './quote-request.component.html',
  styleUrl: './quote-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestComponent implements AfterViewInit, OnInit {
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  submitted = false;
  responseRef?: string;
  errorMessage?: string;
  readonly projectTypes = ['Appartement', 'Villa', 'Bureau', 'Commerce', 'Autre'];
  selections: QuoteProductSelection[] = [];
  readonly packSelections: PackSelection[] = [
    {
      id: 'ACCESSOIRES',
      label: 'SPC + accessoires',
      description: 'Plinthes, profils et sous-couche.',
      selected: false,
    },
    {
      id: 'MIXTE_SPC_PANNEAUX',
      label: 'Pack mixte SPC + panneaux acoustiques',
      description: 'Solution complète pour sol et mur.',
      selected: false,
    },
  ];


  readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    projectType: ['Appartement'],
    city: ['', Validators.required],
    area: [''],
    address: [''],
    notes: [''],
    installRequested: [false],
    message: [''],
    productsSelection: [0, Validators.min(1)],
  });

  cities: string[] = [];
  cityLoadError = false;

  get successActions(): FeedbackAction[] {
    return [
      { label: 'Nouvelle demande', kind: 'ghost', onClick: () => this.resetAfterSuccess() },
      { label: 'Retour à l’accueil', routerLink: ['/'] },
    ];
  }
  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller,
    private readonly productsApi: ProductsApi,
    private readonly quotesApi: QuotesApiService,
    private readonly locationsService: LocationsService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.productsApi
      .getCatalogProducts()
      .subscribe({
        next: products => {
          this.selections = products.map(product => ({
            product,
            selected: false,
            quantity: '',
          }));

          const productId = this.route.snapshot.queryParamMap.get('productId');
          const qty = this.route.snapshot.queryParamMap.get('qty');

          if (productId) {
            this.selections.forEach(selection => {
              if (selection.product.id === productId) {
                selection.selected = true;
                selection.quantity = qty ?? selection.quantity;
              }
            });
          }

          this.syncProductsSelectionControl();
          this.cdr.markForCheck();
        },
      });

    this.locationsService.getCities().subscribe(cities => {
      this.cities = cities;
      this.cdr.markForCheck();
    });

    this.locationsService.hasLoadError$.subscribe(hasError => {
      this.cityLoadError = hasError;
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleSelection(selection: QuoteProductSelection, checked: boolean): void {
    selection.selected = checked;
    if (!checked) {
      selection.quantity = '';
    }

    this.syncProductsSelectionControl();
  }

  togglePackSelection(selection: PackSelection, checked: boolean): void {
    selection.selected = checked;
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

  private toRequiredText(value: string | null | undefined, fallback: string): string {
    const normalized = (value ?? '').trim();
    return normalized.length > 0 ? normalized : fallback;
  }

  private buildCityZone(city: string | null | undefined, area: string | null | undefined): string | undefined {
    const zone = [this.toOptionalText(city), this.toOptionalText(area)].filter(Boolean).join(' / ');
    return zone || undefined;
  }

  isProductsSelectionInvalid(): boolean {
    const control = this.form.get('productsSelection');
    return Boolean(control?.invalid && this.shouldShowError(control));
  }

  private syncProductsSelectionControl(): void {
    const selectedCount = this.selections.filter(selection => selection.selected).length;
    this.form.get('productsSelection')?.setValue(selectedCount);
    this.form.get('productsSelection')?.updateValueAndValidity({ emitEvent: false });
  }

  submit(): void {
    this.submitted = true;
    this.syncProductsSelectionControl();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.status = 'error';
      this.errorMessage = 'Merci de renseigner les champs obligatoires.';
      return;
    }

    const value = this.form.getRawValue();
    const selectedItems = this.selections.filter(selection => selection.selected);

    this.status = 'loading';
    this.errorMessage = undefined;

    const payload = {
      customer: {
        fullName: (value.name ?? '').trim(),
        phone: (value.phone ?? '').trim(),
        email: this.toOptionalText(value.email),
      },
      projectType: this.toRequiredText(value.projectType, 'Appartement'),
      delivery: {
        city: (value.city ?? '').trim(),
        area: this.toOptionalText(value.area),
        address: this.toOptionalText(value.address),
        notes: this.toOptionalText(value.notes),
      },
      cityZone: this.buildCityZone(value.city, value.area),
      installRequested: value.installRequested === true,
      message: this.toOptionalText(value.message),
      intent: 'quote',
      items: selectedItems.map(selection => ({
        productId: selection.product.id,
        sku: selection.product.sku,
        qty: Number(selection.quantity) || 1,
        unit: selection.product.type === 'spc' ? 'M2' as const : 'PIECE' as const,
      })),
      packs: this.packSelections.filter(pack => pack.selected).map(pack => pack.id),
    };

    if (!environment.production) {
      console.debug('QuoteCreateRequest payload', payload);
    }

    this.quotesApi.createQuote(payload)
      .pipe(
        tap(response => {
          const responseRef = response?.quoteNumber ?? response?.id;
          this.handleSuccess(responseRef);
        }),
        catchError(error => {
          this.handleError(error, 'Impossible d’envoyer la demande. Merci de réessayer.');
          return EMPTY;
        }),
        finalize(() => this.cdr.markForCheck()),
      )
      .subscribe();
  }


  private handleSuccess(reference: string): void {
    this.status = 'success';
    this.responseRef = reference;
    this.resetFormState();
    this.submitted = false;
  }

  private handleError(error: any, fallbackMessage: string): void {
    this.status = 'error';
    this.errorMessage = this.extractBackendMessage(error) || fallbackMessage;
  }

  private extractBackendMessage(error: any): string | null {
    return error?.error?.message || error?.error?.detail || null;
  }

  private resetFormState(): void {
    this.form.reset({
      name: '',
      phone: '',
      email: '',
      projectType: 'Appartement',
      city: '',
      area: '',
      address: '',
      notes: '',
      installRequested: false,
      message: '',
      productsSelection: 0,
    });
    this.selections = this.selections.map(selection => ({
      ...selection,
      selected: false,
      quantity: '',
    }));
    this.packSelections.forEach(pack => {
      pack.selected = false;
    });
  }

  getWhatsappLink(): string {
    return buildWhatsappLinkFromMessage(this.buildMessage());
  }

  trackByProductId(_: number, item: QuoteProductSelection): string {
    return item.product.id;
  }

  private resetAfterSuccess(): void {
    this.status = 'idle';
    this.responseRef = undefined;
    this.errorMessage = undefined;
    this.submitted = false;
  }

  private buildMessage(): string {
    const value = this.form.getRawValue();
    const productLines = this.selections
      .filter(selection => selection.selected)
      .map(selection => {
        const unitLabel = selection.product.type === 'spc' ? 'm²' : 'pièces';
        const quantity = selection.quantity ? `${selection.quantity} ${unitLabel}` : 'Quantité à confirmer';
        return `- ${selection.product.name} (${selection.product.sku}) : ${quantity}`;
      });
    const packLines = this.packSelections.filter(selection => selection.selected).map(selection => `- ${selection.label}`);

    return [
      'Bonjour,',
      'Type de demande: Devis',
      `Nom: ${value.name}`,
      `Téléphone: ${value.phone}`,
      `Email: ${value.email || 'Non précisé'}`,
      `Type de projet: ${value.projectType}`,
      `Ville: ${value.city || 'Non précisée'}`,
      `Zone / Quartier: ${value.area || 'Non précisée'}`,
      `Adresse: ${value.address || 'Non précisée'}`,
      'Produits demandés:',
      productLines.length > 0 ? productLines.join('\n') : '- À définir',
      'Packs sur devis:',
      packLines.length > 0 ? packLines.join('\n') : '- Aucun',
      value.message ? `Message: ${value.message}` : 'Message: -',
    ].join('\n');
  }
}
