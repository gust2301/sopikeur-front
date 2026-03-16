import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { assetUrl } from '../../../shared/utils/asset-url';

interface FooterBaseItem {
  label: string;
}

interface FooterRouterLinkItem extends FooterBaseItem {
  type: 'router';
  to: string;
}

interface FooterHrefLinkItem extends FooterBaseItem {
  type: 'href';
  href: string;
}

interface FooterTextItem extends FooterBaseItem {
  type: 'text';
}

type FooterItem = FooterRouterLinkItem | FooterHrefLinkItem | FooterTextItem;

interface FooterColumn {
  title: string;
  items: FooterItem[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly logoUrl = assetUrl('logos/sopiker-logo-dark-h32.png', environment.assetBaseUrl);

  columns: FooterColumn[] = [
    {
      title: 'À propos',
      items: [
        { type: 'router', label: 'Notre équipe', to: '/notre-equipe' },
        { type: 'router', label: 'Nos valeurs', to: '/nos-valeurs' },
        { type: 'router', label: 'Engagement qualité', to: '/engagement-qualite' },
      ],
    },
    {
      title: 'Produits',
      items: [
        { type: 'router', label: 'SPC sol', to: '/spc' },
        { type: 'router', label: 'Wall panels', to: '/panneaux' },
        { type: 'href', label: 'Accessoires', href: '#catalogue' },
        { type: 'router', label: 'Échantillons', to: '/contact' },
      ],
    },
    {
      title: 'Aide',
      items: [
        { type: 'router', label: 'Guide d’installation panneaux', to: '/guide-installation-panneaux' },
        { type: 'router', label: 'Guide d’installation SPC', to: '/guide-installation-spc' },
        { type: 'router', label: 'Questions fréquentes', to: '/faq' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { type: 'href', label: '+221 77 338 04 63', href: 'tel:+221773380463' },
        { type: 'href', label: 'contact@sopikeur.sn', href: 'mailto:contact@sopikeur.sn' },
        { type: 'text', label: 'Dakar, Sénégal' },
        { type: 'text', label: 'Saly, Sénégal' },
      ],
    },
  ];
}
