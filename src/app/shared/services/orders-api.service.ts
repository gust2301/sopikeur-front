import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../utils/api-url';
import { OrderCreateRequest, OrderCreateResponse } from '../models/commerce.models';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly ordersEndpoint = apiUrl('/orders');

  constructor(private readonly http: HttpClient) {}

  createOrder(payload: OrderCreateRequest): Observable<OrderCreateResponse> {
    return this.http.post<OrderCreateResponse>(this.ordersEndpoint, payload);
  }
}
