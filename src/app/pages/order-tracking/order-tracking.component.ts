import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrderTracking } from '../../shared/models/order-tracking.model';
import { OrderTrackingService } from '../../shared/services/order-tracking.service';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';
import { getPaymentPlanLabel, getTimelineStepState, getTrackingStatusLabel, getTrackingStatusVariant } from './order-tracking.utils';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly trackingService = inject(OrderTrackingService);

  readonly currency = new Intl.NumberFormat('fr-FR');

  readonly vm$ = this.route.paramMap.pipe(
    map(params => params.get('publicId') ?? ''),
    switchMap(publicId =>
      this.trackingService.getByPublicId(publicId).pipe(
        map(order => ({ state: 'loaded' as const, publicId, order })),
        catchError(error =>
          of({
            state: 'error' as const,
            publicId,
            statusCode: error?.status ?? 0,
          }),
        ),
      ),
    ),
  );

  getStatusLabel(status: string): string {
    return getTrackingStatusLabel(status);
  }

  getStatusVariant(status: string): string {
    return `tracking-badge--${getTrackingStatusVariant(status)}`;
  }

  getPaymentPlanLabel(paymentPlan: string | null | undefined): string {
    return getPaymentPlanLabel(paymentPlan);
  }

  getTimelineStepState(order: OrderTracking, index: number): string {
    return getTimelineStepState(order.timeline, index);
  }

  getInstallationText(order: OrderTracking): string {
    if (!order.installationRequested) {
      return 'Non';
    }
    if (order.installationDate) {
      return this.formatDate(order.installationDate);
    }
    return order.installationDateText ?? 'À confirmer';
  }

  getDeliveryText(order: OrderTracking): string {
    return order.delivery?.expectedDeliveryDate ? this.formatDate(order.delivery.expectedDeliveryDate) : 'À confirmer';
  }

  getWhatsappHref(order: OrderTracking): string {
    return buildWhatsappLinkFromMessage(
      `Bonjour, je souhaite un point sur ma commande ${order.orderRef} (${order.publicId}).`,
    );
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'À confirmer';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
