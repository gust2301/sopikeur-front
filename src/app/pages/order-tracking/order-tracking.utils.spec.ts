import { getPaymentPlanLabel, getTimelineStepState, getTrackingStatusLabel, getTrackingStatusVariant } from './order-tracking.utils';

describe('order tracking utils', () => {
  it('maps tracking statuses to readable labels and variants', () => {
    expect(getTrackingStatusLabel('PENDING_CONFIRMATION')).toBe('Commande recue');
    expect(getTrackingStatusLabel('INSTALLED')).toBe('Pose terminee');
    expect(getTrackingStatusVariant('CONFIRMED')).toBe('info');
    expect(getTrackingStatusVariant('DELIVERED')).toBe('success');
    expect(getTrackingStatusVariant('CANCELLED')).toBe('danger');
  });

  it('maps payment plans to readable labels', () => {
    expect(getPaymentPlanLabel('CASH_ON_DELIVERY')).toBe('Paiement a la livraison');
    expect(getPaymentPlanLabel('DEPOSIT')).toBe('Acompte');
    expect(getPaymentPlanLabel('FULL')).toBe('Paiement integral');
    expect(getPaymentPlanLabel(undefined)).toBe('A confirmer');
  });

  it('reads timeline states from API values', () => {
    const steps = [
      { label: 'A', dateDisplay: '2026-04-01', state: 'DONE' as const },
      { label: 'B', dateDisplay: null, state: 'CURRENT' as const },
      { label: 'C', dateDisplay: null, state: 'TODO' as const },
    ];

    expect(getTimelineStepState(steps, 0)).toBe('done');
    expect(getTimelineStepState(steps, 1)).toBe('current');
    expect(getTimelineStepState(steps, 2)).toBe('todo');
  });
});
