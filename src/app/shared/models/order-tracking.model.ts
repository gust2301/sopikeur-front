export interface OrderTrackingTimelineStep {
  label: string;
  state: 'DONE' | 'CURRENT' | 'TODO';
  dateDisplay: string | null;
}

export interface OrderTrackingItem {
  sku: string | null;
  name: string;
  unit: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderTrackingPayment {
  total: number;
  paid: number;
  due: number;
  installationAmount: number | null;
  paymentPlan: string | null;
  paymentMethod: string | null;
}

export interface OrderTrackingSummary {
  customerName: string | null;
  phone: string | null;
  city: string | null;
  zone: string | null;
  cityZone: string | null;
}

export interface OrderTracking {
  reference: string;
  publicId: string;
  status: string;
  installationRequested: boolean;
  deliveryEtaDate: string | null;
  deliveredAt: string | null;
  installationEtaDate: string | null;
  installedAt: string | null;
  timelineSteps: OrderTrackingTimelineStep[];
  summary: OrderTrackingSummary;
  payment: OrderTrackingPayment;
  items: OrderTrackingItem[];
}
