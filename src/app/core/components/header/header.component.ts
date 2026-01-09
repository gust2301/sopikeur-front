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
    { label: 'Accueil', href: '/#home' },
    { label: 'SPC', href: '/#spc' },
    { label: 'Panneaux', href: '/#panneaux' },
    { label: 'Inspirations', href: '/inspirations' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
  ];
}
