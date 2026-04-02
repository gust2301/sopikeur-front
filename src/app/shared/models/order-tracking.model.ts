export interface OrderTrackingTimelineStep {
  label: string;
  date: string | null;
  done: boolean;
}

export interface OrderTrackingItem {
  sku: string | null;
  name: string;
  unit: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderTrackingTotals {
  total: number;
  paid: number;
  due: number;
}

export interface OrderTrackingPayment {
  paymentPlan: string | null;
  paymentMethod: string | null;
}

export interface OrderTrackingDelivery {
  city: string | null;
  zone: string | null;
  cityZone: string | null;
  expectedDate: string | null;
  expectedDeliveryDate: string | null;
  note: string | null;
}

export interface OrderTrackingInstallation {
  requested: boolean;
  date: string | null;
  note: string | null;
}

export interface OrderTracking {
  orderRef: string;
  publicId: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  customerName: string | null;
  phone: string | null;
  delivery: OrderTrackingDelivery | null;
  installation: OrderTrackingInstallation | null;
  installationRequested: boolean;
  installationDate: string | null;
  installationDateText: string | null;
  items: OrderTrackingItem[];
  totals: OrderTrackingTotals;
  payment: OrderTrackingPayment | null;
  timeline: OrderTrackingTimelineStep[];
}
