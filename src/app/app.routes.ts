import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
      {
        path: 'inspirations',
        loadComponent: () =>
          import('./pages/inspirations/inspirations.component').then(m => m.InspirationsComponent),
      },
      {
        path: 'product/:type/:id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
