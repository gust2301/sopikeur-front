import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly navLinks: NavLink[] = [
    { label: 'SPC', href: '#spc' },
    { label: 'CATALOGUE', href: '#catalogue' },
    { label: 'SIMULATEUR', href: '#simulateur' },
    { label: 'SERVICES', href: '#services' },
    { label: 'CONTACT', href: '#contact' },
  ];

  protected navOpen = signal(false);

  toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }
}
