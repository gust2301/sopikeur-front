import { environment } from '../../../environments/environment';

export function buildTrackingUrl(publicId: string): string {
  return `${environment.publicSiteBaseUrl}/suivi/${publicId}`;
}
