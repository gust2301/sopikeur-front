import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../utils/api-url';
import { PreorderCreateRequest, PreorderCreateResponse } from '../models/commerce.models';

@Injectable({ providedIn: 'root' })
export class PreordersApiService {
  private readonly preordersEndpoint = apiUrl('/preorders');

  constructor(private readonly http: HttpClient) {}

  createPreorder(payload: PreorderCreateRequest): Observable<PreorderCreateResponse> {
    return this.http.post<PreorderCreateResponse>(this.preordersEndpoint, payload);
  }
}
