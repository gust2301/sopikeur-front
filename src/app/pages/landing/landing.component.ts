import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface ColorWay {
  name: string;
  gradient: string;
  badge: string;
  specs: string[];
  price: string;
}

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
  imports: [CommonModule],
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

  readonly colors: ColorWay[] = [
    {
      name: 'Chêne Naturel',
      gradient: 'linear-gradient(135deg, #D4A574 0%, #C9985E 100%)',
      badge: '#D4A574',
      specs: ['2,2 m²/boîte', 'Épaisseur 5 mm'],
      price: '12 500 FCFA/m²',
    },
    {
      name: 'Noyer Sombre',
      gradient: 'linear-gradient(135deg, #8B7355 0%, #6D5C4D 100%)',
      badge: '#8B7355',
      specs: ['2,2 m²/boîte', 'Épaisseur 5 mm'],
      price: '13 200 FCFA/m²',
    },
    {
      name: 'Marbre Blanc',
      gradient: 'linear-gradient(135deg, #E8E4DC 0%, #D5D1C8 100%)',
      badge: '#E8E4DC',
      specs: ['2,2 m²/boîte', 'Épaisseur 5 mm'],
      price: '14 800 FCFA/m²',
    },
    {
      name: 'Ardoise Graphite',
      gradient: 'linear-gradient(135deg, #5A5A5A 0%, #3D3D3D 100%)',
      badge: '#5A5A5A',
      specs: ['2,2 m²/boîte', 'Épaisseur 5 mm'],
      price: '13 900 FCFA/m²',
    },
    {
      name: 'Travertin Beige',
      gradient: 'linear-gradient(135deg, #C8B8A8 0%, #B5A393 100%)',
      badge: '#C8B8A8',
      specs: ['2,2 m²/boîte', 'Épaisseur 5 mm'],
      price: '12 800 FCFA/m²',
    },
  ];

  readonly acousticPoints = [
    'Parement mural texturé en bois massif',
    'Traitement phonique discret',
    'Fabrication locale à la demande',
  ];

  onSimulate(): void {
    // Placeholder pour futur simulateur
  }
}
