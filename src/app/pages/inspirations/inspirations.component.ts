import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type InspirationCategory = 'spc' | 'panneaux';
type InspirationTab = 'all' | InspirationCategory;

interface InspirationItem {
  id: string;
  title: string;
  category: InspirationCategory;
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
      id: 'spc-salon',
      title: 'Salon chaleureux',
      category: 'spc',
      cover: 'assets/spc/SPC001_home.png',
      beforeImage: 'assets/spc/SPC001_home.png',
      afterImage: 'assets/spc/before_home.png',
      badge: 'SPC',
    },
    {
      id: 'spc-chambre',
      title: 'Chambre zen',
      category: 'spc',
      cover: 'assets/spc/SPC006_home.png',
      beforeImage: 'assets/spc/SPC006_home.png',
      afterImage: 'assets/spc/SPC006.png',
      badge: 'SPC',
    },
    {
      id: 'spc-salle-manger',
      title: 'Salle à manger',
      category: 'spc',
      cover: 'assets/spc/SPC008_home.png',
      beforeImage: 'assets/spc/SPC008_home.png',
      afterImage: 'assets/spc/SPC008.png',
      badge: 'SPC',
    },
    {
      id: 'spc-couloir',
      title: 'Couloir lumineux',
      category: 'spc',
      cover: 'assets/spc/SPC011_home.png',
      beforeImage: 'assets/spc/SPC011_home.png',
      afterImage: 'assets/spc/SPC011.png',
      badge: 'SPC',
    },
    {
      id: 'spc-bureau',
      title: 'Bureau moderne',
      category: 'spc',
      cover: 'assets/spc/SPC014_home.png',
      beforeImage: 'assets/spc/SPC014_home.png',
      afterImage: 'assets/spc/SPC014.png',
      badge: 'SPC',
    },
    {
      id: 'panel-tete-lit',
      title: 'Tête de lit',
      category: 'panneaux',
      cover: 'assets/panels/bed_HEXAGONB.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-mur-tv',
      title: 'Mur TV',
      category: 'panneaux',
      cover: 'assets/panels/wall_HEXAGONB.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-accueil',
      title: 'Mur d’accueil',
      category: 'panneaux',
      cover: 'assets/panels/wall_M-60240-WAVE1.png',
      badge: 'Panneaux',
    },
    {
      id: 'panel-chambre',
      title: 'Chambre cosy',
      category: 'panneaux',
      cover: 'assets/panels/bed_M-60240-WAVE1.png',
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
