import { OrderTrackingTimelineStep } from '../../shared/models/order-tracking.model';

export type TrackingStepState = 'done' | 'current' | 'todo';

export function getTrackingStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return 'Commande reçue';
    case 'CONFIRMED':
      return 'Confirmée';
    case 'CANCELLED':
      return 'Annulée';
    case 'FULFILLED':
      return 'Finalisée';
    default:
      return status;
  }
}

export function getTrackingStatusVariant(status: string): 'info' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'FULFILLED':
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
      return 'Paiement à la livraison';
    case 'DEPOSIT':
      return 'Acompte';
    case 'FULL':
      return 'Paiement intégral';
    default:
      return 'À confirmer';
  }
}

export function getTimelineStepState(steps: OrderTrackingTimelineStep[], index: number): TrackingStepState {
  const step = steps[index];
  if (!step) return 'todo';
  if (step.done) return 'done';

  const hasEarlierPending = steps.slice(0, index).some(candidate => !candidate.done);
  return hasEarlierPending ? 'todo' : 'current';
}
