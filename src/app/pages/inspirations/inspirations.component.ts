import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type InspirationCategory = 'spc' | 'panneaux';
type InspirationTab = 'all' | InspirationCategory;

interface InspirationItem {
  id: string;
  title: string;
  category: InspirationCategory;
  productId: string;
  productType: 'spc' | 'acoustic';
  cover: string;
  beforeImage?: string;
  afterImage?: string;
  badge: string;
}

@Component({
  selector: 'app-inspirations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inspirations.component.html',
  styleUrl: './inspirations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspirationsComponent {
  @ViewChild('modalContent') modalContent?: ElementRef<HTMLDivElement>;
  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

  tabs: { label: string; value: InspirationTab }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Sols SPC', value: 'spc' },
    { label: 'Panneaux', value: 'panneaux' },
  ];

  items: InspirationItem[] = [
    {
      id: 'spc006-natural-oak',
      title: 'Chêne naturel clair',
      category: 'spc',
      productId: 'spc006',
      productType: 'spc',
      cover: '/assets/spc/SPC006_home.png',
      beforeImage: '/assets/spc/spc_home_before.png',
      afterImage: '/assets/spc/SPC006_home.png',
      badge: 'SPC',
    },
    {
      id: 'spc014-dark-walnut',
      title: 'Noyer profond',
      category: 'spc',
      productId: 'spc014',
      productType: 'spc',
      cover: '/assets/spc/SPC014_home.png',
      beforeImage: '/assets/spc/spc_home_before.png',
      afterImage: '/assets/spc/SPC014_home.png',
      badge: 'SPC',
    },
    {
      id: 'spc001-light-wood',
      title: 'Bois clair moderne',
      category: 'spc',
      productId: 'spc001',
      productType: 'spc',
      cover: '/assets/spc/SPC001_home.png',
      beforeImage: '/assets/spc/spc_home_before.png',
      afterImage: '/assets/spc/SPC001_home.png',
      badge: 'SPC',
    },
    {
      id: 'spc008-warm-stone',
      title: 'Pierre beige chaleureuse',
      category: 'spc',
      productId: 'spc008',
      productType: 'spc',
      cover: '/assets/spc/SPC008_home.png',
      beforeImage: '/assets/spc/spc_home_before.png',
      afterImage: '/assets/spc/SPC008_home.png',
      badge: 'SPC',
    },
    {
      id: 'spc011-grey-mineral',
      title: 'Gris minéral contemporain',
      category: 'spc',
      productId: 'spc010',
      productType: 'spc',
      cover: '/assets/spc/SPC011_home.png',
      beforeImage: '/assets/spc/spc_home_before.png',
      afterImage: '/assets/spc/SPC011_home.png',
      badge: 'SPC',
    },
    {
      id: 'panel-tete-lit',
      title: 'Tête de lit',
      category: 'panneaux',
      productId: 'hexagonb',
      productType: 'acoustic',
      cover: '/assets/panels/bed_HEXAGONB.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-mur-tv',
      title: 'Mur TV',
      category: 'panneaux',
      productId: 'hexagonb',
      productType: 'acoustic',
      cover: '/assets/panels/wall_HEXAGONB.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-accueil',
      title: 'Mur d’accueil',
      category: 'panneaux',
      productId: 'm-60240-wave1',
      productType: 'acoustic',
      cover: '/assets/panels/wall_M-60240-WAVE1.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-chambre',
      title: 'Chambre cosy',
      category: 'panneaux',
      productId: 'm-60240-wave1',
      productType: 'acoustic',
      cover: '/assets/panels/bed_M-60240-WAVE1.png',
      badge: 'Panneaux',
    },
  ];

  activeTab: InspirationTab = 'all';
  selectedItem: InspirationItem | null = null;
  sliderValue = 50;

  get filteredItems(): InspirationItem[] {
    if (this.activeTab === 'all') {
      return this.items;
    }
    return this.items.filter(item => item.category === this.activeTab);
  }

  setTab(tab: InspirationTab): void {
    this.activeTab = tab;
  }

  openLightbox(item: InspirationItem): void {
    this.selectedItem = item;
    this.sliderValue = 50;
    setTimeout(() => {
      this.closeButton?.nativeElement.focus();
    });
  }

  closeLightbox(): void {
    this.selectedItem = null;
  }

  handleSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    this.sliderValue = Number(target.value);
  }

  handleModalKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      return;
    }
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.modalContent) {
      return [];
    }
    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.modalContent.nativeElement.querySelectorAll<HTMLElement>(selector)).filter(
      element => !element.hasAttribute('disabled'),
    );
  }

  get isBeforeAfter(): boolean {
    return !!this.selectedItem?.beforeImage && !!this.selectedItem?.afterImage && this.selectedItem?.category === 'spc';
  }

  get dialogTitleId(): string {
    return this.selectedItem ? `inspiration-title-${this.selectedItem.id}` : 'inspiration-title';
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.selectedItem) {
      return;
    }
    if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }
}
