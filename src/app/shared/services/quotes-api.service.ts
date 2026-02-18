import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../utils/api-url';
import { QuoteCreateRequest, QuoteCreateResponse } from '../models/commerce.models';

@Injectable({ providedIn: 'root' })
export class QuotesApiService {
  private readonly quotesEndpoint = apiUrl('/quotes');

  constructor(private readonly http: HttpClient) {}

  createQuote(payload: QuoteCreateRequest): Observable<QuoteCreateResponse> {
    return this.http.post<QuoteCreateResponse>(this.quotesEndpoint, payload);
  }
}
