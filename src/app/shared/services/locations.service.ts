import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { apiUrl } from '../utils/api-url';

interface CitiesResponse {
  cities: string[];
}

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly citiesEndpoint = apiUrl('/locations/cities');
  private readonly loadErrorSubject = new BehaviorSubject<boolean>(false);
  readonly hasLoadError$ = this.loadErrorSubject.asObservable();
  private cities$?: Observable<string[]>;

  constructor(private readonly http: HttpClient) {}

  getCities(): Observable<string[]> {
    if (!this.cities$) {
      this.cities$ = this.http.get<CitiesResponse>(this.citiesEndpoint).pipe(
        map(response => response.cities ?? []),
        tap(() => this.loadErrorSubject.next(false)),
        catchError(() => {
          this.loadErrorSubject.next(true);
          return of([]);
        }),
        shareReplay(1),
      );
    }

    return this.cities$;
  }
}
