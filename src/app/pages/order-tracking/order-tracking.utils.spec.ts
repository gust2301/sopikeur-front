import { getPaymentPlanLabel, getTimelineStepState, getTrackingStatusLabel, getTrackingStatusVariant } from './order-tracking.utils';

describe('order tracking utils', () => {
  it('maps tracking statuses to readable labels and variants', () => {
    expect(getTrackingStatusLabel('PENDING_CONFIRMATION')).toBe('Commande reçue');
    expect(getTrackingStatusLabel('FULFILLED')).toBe('Finalisée');
    expect(getTrackingStatusVariant('CONFIRMED')).toBe('info');
    expect(getTrackingStatusVariant('CANCELLED')).toBe('danger');
  });

  it('maps payment plans to readable labels', () => {
    expect(getPaymentPlanLabel('CASH_ON_DELIVERY')).toBe('Paiement à la livraison');
    expect(getPaymentPlanLabel('DEPOSIT')).toBe('Acompte');
    expect(getPaymentPlanLabel('FULL')).toBe('Paiement intégral');
    expect(getPaymentPlanLabel(undefined)).toBe('À confirmer');
  });

  it('computes timeline states from done flags', () => {
    const steps = [
      { label: 'A', date: '2026-04-01', done: true },
      { label: 'B', date: null, done: false },
      { label: 'C', date: null, done: false },
    ];

    expect(getTimelineStepState(steps, 0)).toBe('done');
    expect(getTimelineStepState(steps, 1)).toBe('current');
    expect(getTimelineStepState(steps, 2)).toBe('todo');
  });
});
