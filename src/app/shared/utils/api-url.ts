import { environment } from '../../../environments/environment';

export function apiUrl(path: string): string {
  // path doit commencer par "/" (ex: "/products", "/contact")
  return `${environment.apiBaseUrl}${environment.apiPrefix}${path}`;
}
