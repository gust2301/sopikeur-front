import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter, RouterOutlet, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import { Component } from '@angular/core';
import { SeoCanonicalService } from './app/shared/services/seo-canonical.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: '<router-outlet />'
})
export class AppRoot {
  constructor(private readonly seoCanonicalService: SeoCanonicalService) {
    this.seoCanonicalService.init();
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideClientHydration(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    ...appConfig.providers ?? []
  ]
}).catch(err => console.error(err));
