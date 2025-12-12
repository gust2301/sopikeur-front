import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  columns: FooterColumn[] = [
    { title: 'À propos', links: [
      { label: 'Notre histoire', href: '#' },
      { label: 'Nos valeurs', href: '#' },
      { label: 'Engagement qualité', href: '#' },
    ]},
    { title: 'Produits', links: [
      { label: 'SPC sol', href: '#catalogue' },
      { label: 'Wall panels', href: '#spc' },
      { label: 'Accessoires', href: '#services' },
      { label: 'Échantillons', href: '#catalogue' },
    ]},
    { title: 'Aide', links: [
      { label: 'Guide d’installation', href: '#services' },
      { label: 'Entretien', href: '#spc' },
      { label: 'FAQ', href: '#contact' },
      { label: 'Garanties', href: '#contact' },
    ]},
    { title: 'Contact', links: [
      { label: '+221 680 63 15', href: 'tel:+2216806315' },
      { label: 'contact@sopikeur.com', href: 'mailto:contact@sopikeur.com' },
      { label: 'Dakar, Sénégal', href: '#contact' },
      { label: 'Saly, Sénégal', href: '#contact' },
    ]},
  ];
}
