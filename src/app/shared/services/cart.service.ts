import { Injectable, computed, signal } from '@angular/core';
import { CatalogProduct } from '../models/catalog-product.model';
import { CartItem } from '../models/commerce.models';

interface CartState {
  items: CartItem[];
  message: string | null;
}

const STORAGE_KEY = 'sopiker_cart_v1';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly state = signal<CartState>({ items: this.readItemsFromStorage(), message: null });

  readonly items = computed(() => this.state().items);
  readonly count = computed(() => new Set(this.state().items.map(item => item.productId)).size);
  readonly totalAmountFcfa = computed(() =>
    this.state().items.reduce((acc, item) => acc + this.resolveUnitPrice(item) * item.quantity, 0),
  );
  readonly hasItems = computed(() => this.state().items.length > 0);
  readonly uiMessage = computed(() => this.state().message);

  isInCart(productId: string): boolean {
    return this.state().items.some(item => item.productId === productId);
  }

  addProduct(product: CatalogProduct, quantity?: number): { ok: boolean; reason?: string } {
    if (!product.inStock) {
      this.setMessage('Ce produit hors-stock se traite via la page Précommande.');
      return { ok: false, reason: 'PREORDER_SEPARATE' };
    }

    const normalizedQty = quantity ?? (product.type === 'spc' ? 50 : 1);

    const existing = this.state().items.find(item => item.productId === product.id);
    if (existing) {
      this.updateQuantity(product.id, existing.quantity + normalizedQty);
      return { ok: true };
    }

    const nextItem: CartItem = {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        type: product.type === 'spc' ? 'SPC' : 'PANNEAU',
        quantity: normalizedQty,
        unit: product.type === 'spc' ? 'M2' : 'PIECE',
        unitPriceLabel: `${product.effectivePrice} ${product.unit}`,
        unitPriceFcfa: this.parsePriceToFcfa(product.effectivePrice),
        inStock: true,
    };

    const nextItems: CartItem[] = [...this.state().items, nextItem];

    this.commitItems(nextItems);
    this.setMessage(`${product.name} ajouté au panier.`);
    return { ok: true };
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const nextItems = this.state().items.map(item => (item.productId === productId ? { ...item, quantity } : item));
    this.commitItems(nextItems);
  }

  removeItem(productId: string): void {
    const nextItems = this.state().items.filter(item => item.productId !== productId);
    this.commitItems(nextItems);
  }

  clear(): void {
    this.commitItems([]);
  }

  clearMessage(): void {
    this.state.update(current => ({ ...current, message: null }));
  }

  private setMessage(message: string): void {
    this.state.update(current => ({ ...current, message }));
  }

  private commitItems(items: CartItem[]): void {
    this.state.update(current => ({ ...current, items }));
    this.persist(items);
  }

  private persist(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }


  private parsePriceToFcfa(value: string): number {
    const normalized = value.replace(/[^0-9]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private resolveUnitPrice(item: CartItem): number {
    if (typeof item.unitPriceFcfa === 'number' && Number.isFinite(item.unitPriceFcfa)) {
      return item.unitPriceFcfa;
    }

    const parsed = this.parsePriceToFcfa(item.unitPriceLabel);
    return parsed;
  }
  private readItemsFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as CartItem[];
      const inStockItems = parsed.filter(item => item.inStock);
      return this.mergeItemsByProduct(inStockItems);
    } catch {
      return [];
    }
  }

  private mergeItemsByProduct(items: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    for (const item of items) {
      const existing = map.get(item.productId);

      if (!existing) {
        map.set(item.productId, { ...item });
        continue;
      }

      existing.quantity += item.quantity;
      map.set(item.productId, existing);
    }

    return Array.from(map.values());
  }
}
