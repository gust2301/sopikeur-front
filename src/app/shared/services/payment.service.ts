import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../utils/api-url';

export interface StripeCheckoutRequest {
  orderId: string;
  purpose: string;
  amountXof: number;
  description?: string;
}

export interface StripeCheckoutResponse {
  checkoutUrl: string;
  paymentIntentId: string;
}

export interface PaymentStatusResponse {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED';
  purpose: string;
  amount: number;
  currency: string;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly depositEndpoint = apiUrl('/checkout/stripe/deposit');
  private readonly paymentsEndpoint = apiUrl('/payments');

  constructor(private readonly http: HttpClient) {}

  /**
   * Crée une session Stripe Checkout pour un acompte.
   * @returns l'URL Stripe vers laquelle rediriger le client.
   */
  createDepositSession(request: StripeCheckoutRequest): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(this.depositEndpoint, request);
  }

  /**
   * Crée une session Stripe Checkout pour une commande existante.
   * Le montant est calculé automatiquement selon le plan de paiement de la commande.
   */
  createOrderPaymentSession(orderPublicId: string): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(
      apiUrl(`/orders/${orderPublicId}/payments/stripe`),
      {}
    );
  }

  /**
   * Récupère le statut d'un paiement par notre publicId interne.
   */
  getPaymentStatus(paymentIntentId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.paymentsEndpoint}/${paymentIntentId}`);
  }
}
