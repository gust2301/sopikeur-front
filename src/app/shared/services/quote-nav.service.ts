import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogProduct } from '../data/catalog';

export type QuoteIntent = 'quote' | 'preorder';

export interface QuoteNavigationOptions {
  product?: CatalogProduct;
  intent?: QuoteIntent;
  quantity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteNavService {
  constructor(private readonly router: Router) {}

  openQuote(options: QuoteNavigationOptions = {}): void {
    const queryParams: Record<string, string> = {};

    if (options.product) {
      queryParams.productId = options.product.id;
      queryParams.productType = options.product.type;
    }

    if (options.intent && options.intent !== 'quote') {
      queryParams.intent = options.intent;
    }

    if (options.quantity) {
      queryParams.qty = options.quantity;
    }

    this.router.navigate(['/devis'], { queryParams });
  }
}
