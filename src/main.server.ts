import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config.server';
import { provideRouter, RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { Component } from '@angular/core';
import { SeoCanonicalService } from './app/shared/services/seo-canonical.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppRoot {
  constructor(private readonly seoCanonicalService: SeoCanonicalService) {
    this.seoCanonicalService.init();
  }
}

const bootstrap = () => bootstrapApplication(AppRoot, {
  providers: [
    provideRouter(routes),
    ...appConfig.providers ?? []
  ]
});

export default bootstrap;
