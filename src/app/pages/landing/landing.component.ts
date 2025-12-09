import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { SectionComponent } from '../../shared/ui/section/section.component';
import { SectionTitleComponent } from '../../shared/ui/section-title/section-title.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { FeatureCardComponent } from '../../shared/ui/feature-card/feature-card.component';
import { ColorCardComponent } from '../../shared/ui/color-card/color-card.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame/video-frame.component';

declare const lucide: any; // Provided by CDN in index.html

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

interface ColorOption {
  name: string;
  gradient: string;
  badgeColor: string;
  specs: string[];
  price: string;
}

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    NgFor,
    NgIf,
    SectionComponent,
    SectionTitleComponent,
    ButtonComponent,
    FeatureCardComponent,
    ColorCardComponent,
    VideoFrameComponent
  ]
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private rafId: number | null = null;
  private readonly isBrowser: boolean;

  protected readonly uspCards: FeatureCard[] = [
    {
      title: '100% Étanche',
      description: 'Résistant à l\'eau, idéal pour cuisines, salles de bain et espaces humides.',
      icon: 'droplets'
    },
    {
      title: 'Pose Click Rapide',
      description: 'Installation facile sans colle, système de clipsage innovant pour un gain de temps.',
      icon: 'zap'
    },
    {
      title: 'Isolation Acoustique',
      description: 'Panels muraux pour réduire le bruit et améliorer le confort sonore.',
      icon: 'volume-2'
    }
  ];

  protected readonly colors: ColorOption[] = [
    {
      name: 'Chêne Naturel',
      gradient: 'linear-gradient(135deg, #D4A574 0%, #C9985E 100%)',
      badgeColor: '#D4A574',
      specs: ['2.2 m²/boîte', 'Épaisseur 5mm'],
      price: '12.500 FCFA/m²'
    },
    {
      name: 'Noyer Sombre',
      gradient: 'linear-gradient(135deg, #8B7355 0%, #6D5C4D 100%)',
      badgeColor: '#8B7355',
      specs: ['2.2 m²/boîte', 'Épaisseur 5mm'],
      price: '13.200 FCFA/m²'
    },
    {
      name: 'Marbre Blanc',
      gradient: 'linear-gradient(135deg, #E8E4DC 0%, #D5D1C8 100%)',
      badgeColor: '#E8E4DC',
      specs: ['2.2 m²/boîte', 'Épaisseur 5mm'],
      price: '14.800 FCFA/m²'
    },
    {
      name: 'Ardoise Graphite',
      gradient: 'linear-gradient(135deg, #5A5A5A 0%, #3D3D3D 100%)',
      badgeColor: '#5A5A5A',
      specs: ['2.2 m²/boîte', 'Épaisseur 5mm'],
      price: '13.900 FCFA/m²'
    },
    {
      name: 'Travertin Beige',
      gradient: 'linear-gradient(135deg, #C8B8A8 0%, #B5A393 100%)',
      badgeColor: '#C8B8A8',
      specs: ['2.2 m²/boîte', 'Épaisseur 5mm'],
      price: '12.800 FCFA/m²'
    }
  ];

  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    try { lucide?.createIcons?.(); } catch {}

    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

    anchors.forEach(anchor => {
      anchor.addEventListener('click', (event: Event) => {
        const href = (anchor.getAttribute('href') || '').trim();
        if (href.startsWith('#') && href.length > 1) {
          event.preventDefault();
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const track = this.host.nativeElement.querySelector<HTMLDivElement>('#colorsTrack');
    if (!track) return;

    let paused = false;
    const loop = () => {
      if (paused) {
        this.rafId = requestAnimationFrame(loop);
        return;
      }
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      track.scrollLeft = (track.scrollLeft + 0.5) % max;
      this.rafId = requestAnimationFrame(loop);
    };

    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(loop);
      track.addEventListener('mouseenter', () => (paused = true));
      track.addEventListener('mouseleave', () => (paused = false));
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null && this.isBrowser) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
