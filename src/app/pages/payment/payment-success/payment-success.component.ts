import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../shared/services/payment.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './payment-success.component.html',
})
export class PaymentSuccessComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);

  /** Ref de commande récupérée depuis sessionStorage */
  readonly orderRef = signal<string | null>(null);
  /** true tant que la vérification du paiement est en cours */
  readonly verifying = signal(true);

  ngOnInit(): void {
    const piId = sessionStorage.getItem('sopikeur_payment_intent_id');
    const ref  = sessionStorage.getItem('sk_pending_order_ref');
    this.orderRef.set(ref);

    if (piId) {
      this.pollStatus(piId, 0);
    } else {
      // Pas d'intent en session (retour direct) : vider le panier et afficher le succès
      this.confirm();
    }
  }

  private pollStatus(piId: string, attempt: number): void {
    this.paymentService.getPaymentStatus(piId).subscribe({
      next: status => {
        if (status.status === 'SUCCEEDED' || attempt >= 4) {
          this.confirm();
        } else {
          // Webhook pas encore traité — réessayer dans 2 s
          setTimeout(() => this.pollStatus(piId, attempt + 1), 2000);
        }
      },
      error: () => this.confirm(), // En cas d'erreur réseau : confirmer quand même
    });
  }

  private confirm(): void {
    this.cartService.clear();
    this.verifying.set(false);
    sessionStorage.removeItem('sopikeur_payment_intent_id');
    sessionStorage.removeItem('sk_pending_order_ref');
    sessionStorage.removeItem('sk_pending_order_id');
  }
}
