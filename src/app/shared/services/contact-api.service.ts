import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {apiUrl} from "../utils/api-url";

export interface ContactRequest {
  customerType: 'Particulier' | 'Professionnel';
  name: string;
  phone: string;
  email?: string;
  message?: string;
  website?: string;
  turnstileToken?: string;
}

export interface ContactApiResponse {
  message: string;
  requestId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  private readonly endpoint = apiUrl('/contact');

  constructor(private readonly http: HttpClient) {}

  sendContactRequest(payload: ContactRequest): Observable<ContactApiResponse> {
    return this.http.post<ContactApiResponse>(this.endpoint, payload).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
    );
  }
}
