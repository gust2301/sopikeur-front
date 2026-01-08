import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CatalogProduct, catalogProducts } from '../../shared/data/catalog';

interface UspCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly uspCards: UspCard[] = [
    {
      title: '100% étanche',
      description: 'Résiste à l’eau : parfait pour cuisines, salles de bain et zones humides.',
      icon: '💧',
    },
    {
      title: 'Pose click rapide',
      description: 'Installation propre sans colle avec un système de clipsage fiable.',
      icon: '⚡',
    },
    {
      title: 'Isolation acoustique',
      description: 'Wall panels et lames SPC qui atténuent les bruits du quotidien.',
      icon: '🔉',
    },
  ];

  readonly colors: CatalogProduct[] = catalogProducts;

  readonly acousticPoints = [
    'Parement mural texturé en bois massif',
    'Traitement phonique discret',
    'Fabrication locale à la demande',
  ];

  constructor(private readonly router: Router) {}

  viewProduct(product: CatalogProduct): void {
    this.router.navigate(['/product-detail', product.id]);
  }
}
