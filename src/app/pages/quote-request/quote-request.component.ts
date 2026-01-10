import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogProduct, catalogProducts } from '../../shared/data/catalog';
import { QuoteIntent } from '../../shared/services/quote-nav.service';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';

interface QuoteProductSelection {
  product: CatalogProduct;
  selected: boolean;
  quantity: string;
}

@Component({
  selector: 'app-quote-request',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quote-request.component.html',
  styleUrl: './quote-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestComponent implements AfterViewInit {
  readonly projectTypes = ['Appartement', 'Villa', 'Bureau', 'Commerce', 'Autre'];
  readonly selections: QuoteProductSelection[] = catalogProducts.map(product => ({
    product,
    selected: false,
    quantity: '',
  }));

  intent: QuoteIntent = 'quote';

  readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    projectType: ['Appartement', Validators.required],
    city: [''],
    message: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(params => {
      const productId = params.get('productId');
      const qty = params.get('qty');
      const intent = params.get('intent');

      this.intent = intent === 'preorder' ? 'preorder' : 'quote';

      if (productId) {
        this.selections.forEach(selection => {
          if (selection.product.id === productId) {
            selection.selected = true;
            selection.quantity = qty ?? selection.quantity;
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSelection(selection: QuoteProductSelection, checked: boolean): void {
    selection.selected = checked;
    if (!checked) {
      selection.quantity = '';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const subject = this.intent === 'preorder' ? 'Demande de précommande' : 'Demande de devis';
    const message = this.buildMessage();
    const mailto = `mailto:contact@sopikeur.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  }

  getWhatsappLink(): string {
    return buildWhatsappLinkFromMessage(this.buildMessage());
  }

  trackByProductId(_: number, item: QuoteProductSelection): string {
    return item.product.id;
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

    return [
      'Bonjour,',
      `Type de demande: ${this.intent === 'preorder' ? 'Précommande' : 'Devis'}`,
      `Nom: ${value.name}`,
      `Téléphone: ${value.phone}`,
      `Email: ${value.email || 'Non précisé'}`,
      `Type de projet: ${value.projectType}`,
      `Ville / Zone: ${value.city || 'Non précisée'}`,
      'Produits demandés:',
      productLines.length > 0 ? productLines.join('\n') : '- À définir',
      value.message ? `Message: ${value.message}` : 'Message: -',
    ].join('\n');
  }
}
