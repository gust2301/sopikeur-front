import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
        data: {
          seo: {
            title: 'Revêtement de sol SPC au Sénégal | Sopi Kër Dakar',
            description:
              'Sopi Kër vous propose des revêtements de sol SPC et panneaux muraux acoustiques au Sénégal. Commande en ligne, livraison et pose à Dakar et partout au pays.',
          },
        },
      },
      {
        path: 'inspirations',
        loadComponent: () =>
          import('./pages/inspirations/inspirations.component').then(m => m.InspirationsComponent),
        data: {
          seo: {
            title: 'Inspirations déco SPC & panneaux acoustiques | Sopi Kër Sénégal',
            description:
              'Explorez nos réalisations SPC et panneaux acoustiques pour villas, bureaux et commerces à Dakar et partout au Sénégal.',
          },
        },
      },
      {
        path: 'spc',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: {
          type: 'SPC',
          seo: {
            title: 'Sol SPC clipsable Dakar | Prix, livraison et pose au Sénégal',
            description:
              'Découvrez notre sol SPC clipsable: résistant à l’eau, durable et élégant. Devis rapide, livraison et pose professionnelle à Dakar et dans tout le Sénégal.',
          },
        },
      },
      {
        path: 'panneaux',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        data: {
          type: 'PANEL',
          seo: {
            title: 'Panneaux muraux acoustiques Dakar | Design & isolation sonore',
            description:
              'Améliorez l’acoustique de votre intérieur avec nos panneaux muraux décoratifs. Livraison et pose à Dakar et partout au Sénégal.',
          },
        },
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
        data: {
          seo: {
            title: 'Contact Sopi Kër | Devis SPC et panneaux acoustiques au Sénégal',
            description:
              'Demandez votre devis SPC ou panneaux acoustiques. Livraison et pose disponibles à Dakar, Saly et partout au Sénégal.',
          },
        },
      },
      {
        path: 'product/:type/:id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'panier',
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        data: {
          seo: {
            title: 'Panier | Sopi Kër Sénégal',
            description: 'Validez votre commande de produits en stock avec options de livraison et pose.',
          },
        },
      },
      {
        path: 'precommande',
        loadComponent: () => import('./pages/preorder/preorder.component').then(m => m.PreorderComponent),
        data: {
          seo: {
            title: 'Précommande | Sopi Kër Sénégal',
            description: 'Réservez vos produits hors-stock et recevez la confirmation des délais et modalités.',
          },
        },
      },
      {
        path: 'devis',
        loadComponent: () =>
          import('./pages/quote-request/quote-request.component').then(m => m.QuoteRequestComponent),
        data: {
          seo: {
            title: 'Demande de devis | Sopi Kër Sénégal',
            description:
              'Recevez un devis personnalisé pour vos revêtements SPC et panneaux acoustiques avec livraison et pose au Sénégal.',
          },
        },
      },
      {
        path: 'guide-installation-panneaux',
        loadComponent: () =>
          import('./pages/panel-installation-guide/panel-installation-guide.component').then(
            m => m.PanelInstallationGuideComponent,
          ),
        data: {
          seo: {
            title: 'Guide d’installation panneaux acoustiques | Sopi Kër',
            description:
              'Suivez le guide d’installation des panneaux muraux acoustiques Sopi Kër: outils, étapes de pose et conseils pratiques.',
          },
        },
      },
      {
        path: 'guide-installation-spc',
        loadComponent: () =>
          import('./pages/spc-installation-guide/spc-installation-guide.page').then(m => m.SpcInstallationGuidePageComponent),
        data: {
          seo: {
            title: 'Guide d’installation SPC | SOPIKËR',
            description:
              'Tutoriel complet pour installer un sol SPC clipsable: préparation, pose, découpes et finitions adaptées au climat sénégalais.',
          },
        },
      },
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent),
        data: {
          seo: {
            title: 'FAQ | Revêtements SPC et panneaux acoustiques au Sénégal',
            description:
              'Toutes les réponses sur les prix, la pose, la livraison et l’entretien de vos revêtements SPC et panneaux acoustiques.',
          },
        },
      },

      {
        path: 'notre-equipe',
        title: 'Notre équipe | Sopi Kër',
        loadComponent: () =>
          import('./pages/notre-equipe/notre-equipe.component').then(m => m.NotreEquipeComponent),
        data: {
          seo: {
            title: 'Notre équipe | Sopi Kër Sénégal',
            description:
              'Découvrez l’équipe Sopi Kër, sa mission, son organisation et son accompagnement pour vos projets SPC et panneaux acoustiques.',
          },
        },
      },
      {
        path: 'nos-valeurs',
        title: 'Nos valeurs | Sopi Kër',
        loadComponent: () => import('./pages/nos-valeurs/nos-valeurs.component').then(m => m.NosValeursComponent),
        data: {
          seo: {
            title: 'Nos valeurs | Sopi Kër Sénégal',
            description:
              'Découvrez les valeurs de Sopi Kër: transparence, durabilité, service et équilibre entre esthétique et fonctionnalité.',
          },
        },
      },
      {
        path: 'engagement-qualite',
        title: 'Engagement qualité | Sopi Kër',
        loadComponent: () =>
          import('./pages/engagement-qualite/engagement-qualite.component').then(
            m => m.EngagementQualiteComponent,
          ),
        data: {
          seo: {
            title: 'Engagement qualité | Sopi Kër Sénégal',
            description:
              'Consultez l’engagement qualité Sopi Kër: sélection produits, contrôle, conseils de pose et suivi après-vente.',
          },
        },
      },
      {
        path: 'cgv',
        loadComponent: () => import('./pages/cgv/cgv.component').then(m => m.CgvComponent),
        data: {
          seo: {
            title: 'CGV | Sopi Kër Sénégal',
            description:
              'Consultez les conditions générales de vente Sopi Kër: commandes, paiement, livraison, pose, retours et garanties.',
          },
        },
      },
      {
        path: 'mentions-legales',
        loadComponent: () => import('./pages/legal-notice/legal-notice.component').then(m => m.LegalNoticeComponent),
        data: {
          seo: {
            title: 'Mentions légales | Sopi Kër',
            description:
              'Retrouvez les mentions légales du site sopikeur.sn: éditeur, hébergement, propriété intellectuelle et contact.',
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
