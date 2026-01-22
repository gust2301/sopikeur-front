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
      { label: 'Notre équipe', href: '#' },
      { label: 'Nos valeurs', href: '#' },
      { label: 'Engagement qualité', href: '#' },
    ]},
    { title: 'Produits', links: [
      { label: 'SPC sol', href: '/spc' },
      { label: 'Wall panels', href: '/panneaux' },
      { label: 'Accessoires', href: '#catalogue' },
      { label: 'Échantillons', href: '#catalogue' },
    ]},
    { title: 'Aide', links: [
      { label: 'Guide d’installation', href: '#contact' },
      { label: 'Entretien', href: '#spc' },
      { label: 'FAQ', href: '#contact' },
      { label: 'Garanties', href: '#contact' },
    ]},
    { title: 'Contact', links: [
      { label: '+221 77 429 37 57', href: 'tel:+221774293757' },
      { label: 'contact@sopikeur.sn', href: 'mailto:contact@sopikeur.sn' },
      { label: 'Dakar, Sénégal', href: '#contact' },
      { label: 'Saly, Sénégal', href: '#contact' },
    ]},
  ];
}
