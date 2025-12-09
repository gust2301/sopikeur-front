import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly columns: FooterColumn[] = [
    {
      title: 'À propos',
      links: [
        { label: 'Notre histoire', href: '#' },
        { label: 'Nos valeurs', href: '#' },
        { label: 'Engagement qualité', href: '#' },
      ],
    },
    {
      title: 'Produits',
      links: [
        { label: 'SPC Sol', href: '#' },
        { label: 'Wall Panels', href: '#' },
        { label: 'Accessoires', href: '#' },
        { label: 'Échantillons', href: '#' },
      ],
    },
    {
      title: 'Aide',
      links: [
        { label: "Guide d'installation", href: '#' },
        { label: 'Entretien', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Garanties', href: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: '+221 680 63 15', href: 'tel:+2216806315' },
        { label: 'mail', href: 'mailto:contact@sopikeur.com' },
        { label: 'Dakar, Sénégal', href: '#' },
        { label: 'Saly, Sénégal', href: '#' },
      ],
    },
  ];
}
