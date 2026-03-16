export type ProductUnit = 'M2' | 'PIECE';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  type: 'SPC' | 'PANNEAU';
  unit: ProductUnit;
  unitPriceLabel: string;
  unitPriceFcfa: number;
  quantity: number;
  inStock: boolean;
}

export interface CustomerDto {
  fullName: string;
  phone: string;
  email?: string;
}

export interface ContactDto {
  fullName: string;
  phone: string;
  email?: string;
}

export interface DeliveryDto {
  city: string;
  area?: string;
  address?: string;
  notes?: string;
}

export type PaymentPlan = 'CASH_ON_DELIVERY' | 'DEPOSIT_50' | 'FULL_ONLINE';

export type PaymentProvider = 'STRIPE' | 'WAVE' | 'ORANGE_MONEY';

export interface OrderCreateRequest {
  customer: CustomerDto;
  delivery?: DeliveryDto;
  cityZone?: string;
  installRequested?: boolean;
  paymentPlan: PaymentPlan;
  paymentMethodSelected?: string;
  items: Array<{
    productId: string;
    sku?: string;
    unit: ProductUnit;
    qty: number;
  }>;
}

export interface OrderCreateResponse {
  id: string;
  orderNumber?: string;
  status: string;
  paymentPlan: PaymentPlan;
  paymentStatus: string;
  createdAt: string;
}

export interface PreorderCreateRequest {
  contact: ContactDto;
  delivery: DeliveryDto;
  installRequested: boolean;
  acceptsDelay: boolean;
  message?: string;
  items: Array<{
    sku: string;
    productId?: string;
    unit: ProductUnit;
    qty: number;
  }>;
}

export interface PreorderCreateResponse {
  id: string;
  preorderNumber?: string;
  status: 'NEW' | 'CONTACTED' | 'RESERVED' | 'CANCELLED' | 'CONVERTED';
  createdAt: string;
}

export interface QuoteCreateRequest {
  customer: CustomerDto;
  projectType: string;
  delivery: DeliveryDto;
  cityZone?: string;
  installRequested: boolean;
  message?: string;
  intent: string;
  items: Array<{
    productId: string;
    sku: string;
    unit: ProductUnit;
    qty?: number;
  }>;
  packs?: string[];
}

export interface QuoteCreateResponse {
  id: string;
  quoteNumber?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CANCELLED';
  createdAt: string;
}
