import { OrderTrackingTimelineStep } from '../../shared/models/order-tracking.model';

export type TrackingStepState = 'done' | 'current' | 'todo';

export function getTrackingStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return 'Commande recue';
    case 'CONFIRMED':
      return 'Confirmee';
    case 'CANCELLED':
      return 'Annulee';
    case 'FULFILLED':
      return 'Finalisee';
    case 'DELIVERED':
      return 'Livree';
    case 'INSTALLED':
      return 'Pose terminee';
    default:
      return status;
  }
}

export function getTrackingStatusVariant(status: string): 'info' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'FULFILLED':
    case 'DELIVERED':
    case 'INSTALLED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'CONFIRMED':
      return 'info';
    default:
      return 'warning';
  }
}

export function getPaymentPlanLabel(paymentPlan: string | null | undefined): string {
  switch (paymentPlan) {
    case 'CASH_ON_DELIVERY':
      return 'Paiement a la livraison';
    case 'DEPOSIT':
      return 'Acompte';
    case 'FULL':
      return 'Paiement integral';
    default:
      return 'A confirmer';
  }
}

export function getTimelineStepState(steps: OrderTrackingTimelineStep[], index: number): TrackingStepState {
  const step = steps[index];
  if (!step) return 'todo';

  switch (step.state) {
    case 'DONE':
      return 'done';
    case 'CURRENT':
      return 'current';
    default:
      return 'todo';
  }
}
