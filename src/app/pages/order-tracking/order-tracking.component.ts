import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrderTracking } from '../../shared/models/order-tracking.model';
import { OrderTrackingService } from '../../shared/services/order-tracking.service';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';
import { getPaymentPlanLabel, getTimelineStepState, getTrackingStatusLabel, getTrackingStatusVariant } from './order-tracking.utils';

type TrackingServiceBreakdown = {
  subtotalProducts: number;
  delivery: number;
  installation: number;
  other: number;
};

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
    return getTimelineStepState(order.timelineSteps, index);
  }

  getDeliveryText(order: OrderTracking): string {
    return order.deliveredAt ? this.formatDate(order.deliveredAt) : this.formatDate(order.deliveryEtaDate);
  }

  getDeliveryLegend(order: OrderTracking): string {
    return order.deliveredAt ? 'Livree le' : 'Date previsionnelle de livraison';
  }

  getInstallationText(order: OrderTracking): string {
    if (!order.installationRequested) {
      return 'Non';
    }
    return order.installedAt ? this.formatDate(order.installedAt) : this.formatDate(order.installationEtaDate);
  }

  getInstallationLegend(order: OrderTracking): string {
    if (!order.installationRequested) {
      return 'Installation non demandee';
    }
    return order.installedAt ? 'Pose terminee le' : 'Date previsionnelle d installation';
  }

  getServiceBreakdown(order: OrderTracking): TrackingServiceBreakdown {
    return order.items.reduce<TrackingServiceBreakdown>((totals, item) => {
      const amount = item.lineTotal ?? item.unitPrice * item.quantity;
      const sku = (item.sku ?? '').toUpperCase();
      if (sku === 'SRV-LIVRAISON') {
        totals.delivery += amount;
        return totals;
      }
      if (sku === 'SRV-POSE') {
        totals.installation += amount;
        return totals;
      }
      if (sku.startsWith('SRV-')) {
        totals.other += amount;
        return totals;
      }
      totals.subtotalProducts += amount;
      return totals;
    }, { subtotalProducts: 0, delivery: 0, installation: 0, other: 0 });
  }

  getWhatsappHref(order: OrderTracking): string {
    return buildWhatsappLinkFromMessage(
      `Bonjour, je souhaite un point sur ma commande ${order.reference} (${order.publicId}).`,
    );
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'A confirmer';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: value.includes('T') || value.includes(':') ? '2-digit' : undefined,
      minute: value.includes('T') || value.includes(':') ? '2-digit' : undefined,
    }).format(date);
  }
}
