import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/** Metadata for API-backed pages, shared by browser navigation and prerender. */
@Injectable({ providedIn: 'root' })
export class PageSeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  setPage(title: string, description: string, image?: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }
  }

  setStructuredData(data: Record<string, unknown>): void {
    let script = this.document.getElementById('page-structured-data');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'page-structured-data';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    // Avoid a closing script tag in API-supplied strings in server-rendered HTML.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  clearStructuredData(): void {
    this.document.getElementById('page-structured-data')?.remove();
  }
}
