import { environment } from '../../../environments/environment';

const STAGING_HOSTS = new Set(['develop.sopikeur-front.pages.dev']);
const STAGING_API_BASE_URL = 'https://api-staging.sopikeur.sn';

export function apiUrl(path: string): string {
  // path doit commencer par "/" (ex: "/products", "/contact")
  return `${resolveApiBaseUrl()}${environment.apiPrefix}${path}`;
}

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined' && STAGING_HOSTS.has(window.location.hostname)) {
    return STAGING_API_BASE_URL;
  }

  return environment.apiBaseUrl;
}
