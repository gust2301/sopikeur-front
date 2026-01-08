import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { acousticPanels, CatalogProduct, spcProducts } from '../../shared/data/catalog';
import { buildWhatsappLink } from '../../shared/utils/whatsapp';

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
  @ViewChild('colorsTrack') colorsTrack?: ElementRef<HTMLDivElement>;
  @ViewChild('panelsTrack') panelsTrack?: ElementRef<HTMLDivElement>;

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

  readonly colors: CatalogProduct[] = spcProducts;
  readonly acousticPanels: CatalogProduct[] = acousticPanels;

  constructor(private readonly router: Router) {}

  viewProduct(product: CatalogProduct): void {
    this.router.navigate(['/product', product.type, product.id]);
  }

  scrollColors(direction: 'left' | 'right'): void {
    this.scrollByCard(this.colorsTrack?.nativeElement, direction);
  }

  scrollPanels(direction: 'left' | 'right'): void {
    this.scrollByCard(this.panelsTrack?.nativeElement, direction);
  }

  getWhatsappLink(product: CatalogProduct): string {
    return buildWhatsappLink(product.name, product.sku);
  }

  private scrollByCard(track: HTMLDivElement | undefined, direction: 'left' | 'right'): void {
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>('.color-card, .panel-card');
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0');
    const cardWidth = card?.getBoundingClientRect().width ?? track.clientWidth;
    const scrollAmount = (cardWidth + gap) * 0.8;
    track.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}
