import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderTracking } from '../models/order-tracking.model';
import { apiUrl } from '../utils/api-url';

@Injectable({ providedIn: 'root' })
export class OrderTrackingService {
  constructor(private readonly http: HttpClient) {}

  getByPublicId(publicId: string): Observable<OrderTracking> {
    return this.http.get<OrderTracking>(apiUrl(`/public/orders/${publicId}/tracking`));
  }
}
