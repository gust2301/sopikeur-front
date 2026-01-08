import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkButtonComponent } from '../../../shared/ui/link-button/link-button.component';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LinkButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  navLinks: NavLink[] = [
    { label: 'SPC', href: '#spc' },
    { label: 'Packs', href: '#packs' },
    { label: 'Catalogue', href: '#catalogue' },
    { label: 'Simulateur', href: '#simulateur' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];
}
