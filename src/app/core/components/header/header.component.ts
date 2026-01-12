import { ChangeDetectionStrategy, Component, OnDestroy, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  isMobileMenuOpen = false;
  navLinks: NavLink[] = [
    { label: 'Accueil', href: '/#home' },
    { label: 'SPC', href: '/#spc' },
    { label: 'Panneaux', href: '/#panneaux' },
    { label: 'Inspirations', href: '/inspirations' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
  ];

  toggleMenu(): void {
    if (this.isMobileMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu(): void {
    this.isMobileMenuOpen = true;
    this.updateBodyLock(true);
  }

  closeMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateBodyLock(false);
  }

  ngOnDestroy(): void {
    this.updateBodyLock(false);
  }

  private updateBodyLock(locked: boolean): void {
    const body = this.document?.body;
    if (!body) {
      return;
    }

    if (locked) {
      this.renderer.addClass(body, 'body--locked');
    } else {
      this.renderer.removeClass(body, 'body--locked');
    }
  }
}
