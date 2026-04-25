import { ChangeDetectionStrategy, Component, OnDestroy, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { assetUrl } from '../../../shared/utils/asset-url';

interface NavLink {
  label: string;
  path: string;
  fragment?: string;
  exact?: boolean;
  featured?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  isMobileMenuOpen = false;
  private readonly cartService = inject(CartService);
  readonly cartCount = this.cartService.count;
  readonly logoUrl = assetUrl('logos/sopiker-logo-light-h40.png', environment.assetBaseUrl);

  navLinks: NavLink[] = [
    { label: 'Accueil', path: '/', fragment: 'home', exact: true },
    { label: 'SPC', path: '/spc/' },
    { label: 'Panneaux', path: '/panneaux/' },
    { label: 'Inspirations', path: '/inspirations/' },
    { label: 'Blog', path: '/blog/' },
    { label: 'FAQ', path: '/faq/', featured: true },
    { label: 'Contact', path: '/contact/' },
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
