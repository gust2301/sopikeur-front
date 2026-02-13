import { DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SeoCanonicalService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.handleRouteUpdate(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.handleRouteUpdate(event.urlAfterRedirects));
  }

  private handleRouteUpdate(urlAfterRedirects: string): void {
    const parsedUrl = this.parseUrl(urlAfterRedirects);
    const normalizedPath = this.withTrailingSlash(parsedUrl.path);
    const normalizedBrowserUrl = `${normalizedPath}${parsedUrl.query}${parsedUrl.fragment}`;

    if (normalizedBrowserUrl !== urlAfterRedirects) {
      this.location.replaceState(normalizedBrowserUrl);
    }

    const canonicalBase = this.resolveCanonicalBaseUrl();
    const canonicalHref = `${canonicalBase}${normalizedPath}${parsedUrl.query}`;
    this.updateCanonicalTag(canonicalHref);
  }

  private parseUrl(url: string): { path: string; query: string; fragment: string } {
    const [withoutFragment, fragment = ''] = url.split('#', 2);
    const [path = '/', query = ''] = withoutFragment.split('?', 2);

    return {
      path: path || '/',
      query: query ? `?${query}` : '',
      fragment: fragment ? `#${fragment}` : '',
    };
  }

  private withTrailingSlash(path: string): string {
    if (path === '/' || path.endsWith('/')) {
      return path;
    }

    return `${path}/`;
  }

  private resolveCanonicalBaseUrl(): string {
    const configuredBase = environment.siteUrl?.trim();
    if (configuredBase) {
      return configuredBase.replace(/\/$/, '');
    }

    return window.location.origin.replace(/\/$/, '');
  }

  private updateCanonicalTag(href: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    let canonical = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      head.appendChild(canonical);
    }

    canonical.setAttribute('href', href);
  }
}
