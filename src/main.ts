import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {provideRouter, RouterOutlet} from '@angular/router';
import { routes } from './app/app.routes';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: '<router-outlet />'
})
export class AppRoot {}

bootstrapApplication(AppRoot, {
  providers: [
    provideClientHydration(),
    provideRouter(routes),
    ...appConfig.providers ?? []
  ]
}).catch(err => console.error(err));
