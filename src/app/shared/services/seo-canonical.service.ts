import { DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RouteSeoData {
  title?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoCanonicalService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

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
    this.updateMetaRobots('index, follow');
    this.updateOpenGraphUrl(canonicalHref);
    this.applyRouteSeoData();
  }

  private applyRouteSeoData(): void {
    const currentRoute = this.getDeepestRoute(this.activatedRoute);
    const routeSeoData = currentRoute.snapshot.data?.['seo'] as RouteSeoData | undefined;

    if (routeSeoData?.title?.trim()) {
      this.titleService.setTitle(routeSeoData.title.trim());
      this.updateOpenGraphTitle(routeSeoData.title.trim());
      this.updateTwitterTitle(routeSeoData.title.trim());
    }

    if (routeSeoData?.description?.trim()) {
      const description = routeSeoData.description.trim();
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
    }
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    let current = route;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return current;
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

  private updateOpenGraphUrl(url: string): void {
    this.metaService.updateTag({ property: 'og:url', content: url });
  }

  private updateOpenGraphTitle(title: string): void {
    this.metaService.updateTag({ property: 'og:title', content: title });
  }

  private updateTwitterTitle(title: string): void {
    this.metaService.updateTag({ name: 'twitter:title', content: title });
  }

  private updateMetaRobots(content: string): void {
    this.metaService.updateTag({ name: 'robots', content });
  }
}
