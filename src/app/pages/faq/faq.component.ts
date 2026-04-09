import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqComparisonRow {
  critere: string;
  values: Array<number | string>;
}

interface FaqComparison {
  columns: string[];
  rows: FaqComparisonRow[];
}

interface FaqLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FaqTextItem {
  type: 'text';
  question: string;
  answer: string;
  bullets?: string[];
  links?: FaqLink[];
}

interface FaqComparisonItem {
  type: 'comparison';
  question: string;
  comparison: FaqComparison;
}

type FaqItem = FaqTextItem | FaqComparisonItem;

interface FaqCategory {
  label: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  readonly searchQuery = signal('');
  readonly activeCategory = signal<string | null>(null);

  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.activeCategory();

    return this.categories
      .filter(cat => category === null || cat.label === category)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
          if (!query) return true;
          if (item.question.toLowerCase().includes(query)) return true;
          if (item.type === 'text') {
            if (item.answer.toLowerCase().includes(query)) return true;
            if (item.bullets?.some(b => b.toLowerCase().includes(query))) return true;
          }
          return false;
        }),
      }))
      .filter(cat => cat.items.length > 0);
  });

  readonly resultCount = computed(() =>
    this.filteredCategories().reduce((sum, cat) => sum + cat.items.length, 0)
  );

  categories: FaqCategory[] = [
    {
      label: 'Paiement',
      items: [
        {
          type: 'text',
          question: 'Comment et quand payer ?',
          answer:
            'Pour la plupart des commandes : 50 % après validation (réservation / approvisionnement) et 50 % à la livraison. Pour les gros volumes ou les projets sur-mesure, un échéancier peut être proposé.',
        },
        {
          type: 'text',
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Wave, Orange Money, PayPal, cash et Revolut.',
        },
        {
          type: 'text',
          question: 'Puis-je payer en plusieurs fois ?',
          answer:
            'Oui, selon le montant et le produit. Contactez-nous avec les détails de votre projet (surface, ville, délai) et nous vous proposons un plan de paiement adapté.',
        },
        {
          type: 'text',
          question: 'Est-ce que je reçois une facture / reçu ?',
          answer:
            'Oui, facture et reçu de paiement sur demande — recommandé pour les professionnels.',
        },
      ],
    },
    {
      label: 'Commande et délais',
      items: [
        {
          type: 'text',
          question: 'Comment commander ?',
          answer:
            'Vous pouvez commander via le site, WhatsApp ou téléphone. Nous confirmons ensuite la disponibilité, le montant et les conditions de livraison.',
        },
        {
          type: 'text',
          question: 'Quels sont les délais de livraison ?',
          answer: 'Les délais varient selon la disponibilité du produit :',
          bullets: [
            'Produits en stock : livraison rapide (selon la ville).',
            'Produits sur commande : délai communiqué lors de la validation (import / arrivage).',
          ],
        },
        {
          type: 'text',
          question: 'Peut-on réserver un produit ?',
          answer: 'Oui. La réservation est confirmée après versement de l\u2019acompte (50 %).',
        },
        {
          type: 'text',
          question: 'Comment obtenir un devis ?',
          answer: 'Vous pouvez demander un devis via notre formulaire de contact ou directement sur WhatsApp.',
          links: [
            { label: 'Formulaire de contact', href: '/contact/' },
            {
              label: 'WhatsApp',
              href: 'https://wa.me/221773380463?text=Bonjour%2C%20je%20souhaite%20obtenir%20un%20devis.',
              external: true,
            },
          ],
        },
      ],
    },
    {
      label: 'Livraison',
      items: [
        {
          type: 'text',
          question: 'Livrez-vous partout au S\u00e9n\u00e9gal ?',
          answer:
            'Oui \u2014 Dakar, Thi\u00e8s, Saly, Mbour, Saint-Louis et partout ailleurs au S\u00e9n\u00e9gal. Les frais de livraison d\u00e9pendent de la ville et du volume.',
        },
        {
          type: 'text',
          question: 'Comment sont calcul\u00e9s les frais de livraison ?',
          answer:
            'Les frais d\u00e9pendent de plusieurs facteurs : ville, poids\u00a0/ volume, accessibilit\u00e9 et quantit\u00e9 command\u00e9e. Nous vous communiquons un prix clair avant validation de la commande.',
        },
        {
          type: 'text',
          question: 'Et si je veux r\u00e9cup\u00e9rer moi-m\u00eame ?',
          answer:
            'C\u2019est possible : retrait sur point de stockage selon disponibilit\u00e9. Contactez-nous pour convenir d\u2019un cr\u00e9neau.',
        },
      ],
    },
    {
      label: 'Produits SPC (sol vinyle)',
      items: [
        {
          type: 'text',
          question: 'C\u2019est quoi le SPC ?',
          answer:
            'Le SPC (Stone Plastic Composite) est un sol vinyle rigide tr\u00e8s r\u00e9sistant, 100\u00a0% \u00e9tanche, facile \u00e0 entretenir et simple \u00e0 poser. Id\u00e9al pour les maisons, bureaux et commerces.',
        },
        {
          type: 'text',
          question: 'Quelle diff\u00e9rence entre SPC, PVC vinyle et LVT ?',
          answer:
            'Le SPC est une \u00e9volution du sol PVC classique. Contrairement au PVC souple ou au LVT (Luxury Vinyl Tile) standard, le SPC poss\u00e8de un c\u0153ur composite pierre-plastique (calcaire + PVC) qui le rend totalement rigide, plus stable \u00e0 la chaleur et nettement plus r\u00e9sistant aux impacts. R\u00e9sum\u00e9 : SPC > LVT rigide > LVT souple > PVC standard en termes de durabilit\u00e9 et de stabilit\u00e9 thermique.',
          bullets: [
            'PVC souple : l\u00e9ger, peu co\u00fbteux, mais se d\u00e9forme avec la chaleur.',
            'LVT (Luxury Vinyl Tile) : meilleur que le PVC souple, mais \u00e2me en fibre de verre.',
            'SPC : \u00e2me pierre-plastique, 100\u00a0% \u00e9tanche, r\u00e9siste aux grandes amplitudes thermiques (id\u00e9al sous climat chaud comme au S\u00e9n\u00e9gal).',
          ],
        },
        {
          type: 'text',
          question: 'SPC ou parquet stratifi\u00e9 : quel rev\u00eatement de sol choisir au S\u00e9n\u00e9gal ?',
          answer:
            'Pour le climat s\u00e9n\u00e9galais (chaleur, humidit\u00e9, sable), le SPC est nettement pr\u00e9f\u00e9rable au parquet stratifi\u00e9. Le parquet stratifi\u00e9 gonfle, se soul\u00e8ve et se d\u00e9grade rapidement dans les pi\u00e8ces humides ou mal ventil\u00e9es. Le SPC, lui, est 100\u00a0% \u00e9tanche, ne craint pas l\u2019humidit\u00e9 ni les variations de temp\u00e9rature, et se pose facilement par clipsage sans colle. Autre avantage : son entretien est beaucoup plus simple (pas de cire, pas de ponc\u00e7age).',
        },
        {
          type: 'text',
          question: 'Le SPC est-il adapt\u00e9 aux pi\u00e8ces humides ?',
          answer:
            'Oui, il convient tr\u00e8s bien aux cuisines, couloirs et espaces \u00e0 fort passage. Pour les salles de bain, c\u2019est possible selon le type de pose et les finitions (joints d\u2019\u00e9tanch\u00e9it\u00e9 recommand\u00e9s).',
        },
        {
          type: 'text',
          question: 'Faut-il une sous-couche ?',
          answer:
            'Souvent oui, selon le mod\u00e8le choisi : certains SPC int\u00e8grent d\u00e9j\u00e0 une sous-couche IXPE. Nous vous conseillons en fonction de votre support existant.',
        },
        {
          type: 'text',
          question: 'Peut-on poser sur du carrelage ?',
          answer:
            'Oui, si le support est stable et suffisamment plan. En cas d\u2019irr\u00e9gularit\u00e9s importantes, un ragr\u00e9age pr\u00e9alable est conseill\u00e9.',
        },
        {
          type: 'comparison',
          question: 'Pourquoi choisir un sol SPC plut\u00f4t qu\u2019un autre rev\u00eatement ?',
          comparison: {
            columns: ['SPC vinyle', 'PVC / LVT souple', 'Carreaux', 'Parquet stratifi\u00e9'],
            rows: [
              { critere: '\u00c9tanch\u00e9it\u00e9', values: [5, 4, 5, 2] },
              { critere: 'R\u00e9sistance rayures', values: [4, 3, 5, 4] },
              { critere: 'Confort', values: [4, 4, 2, 5] },
              { critere: 'Facilit\u00e9 de pose', values: [5, 4, 2, 2] },
              { critere: 'Stabilit\u00e9 thermique', values: [5, 2, 2, 3] },
              { critere: 'Prix moyen', values: ['Moyen', 'Faible', 'Moyen', '\u00c9lev\u00e9'] },
              { critere: 'Durabilit\u00e9', values: [4, 3, 5, 4] },
            ],
          },
        },
      ],
    },
    {
      label: 'Panneaux acoustiques',
      items: [
        {
          type: 'text',
          question: 'Quelle diff\u00e9rence entre un panneau acoustique mural et un panneau phonique ?',
          answer:
            'Ce sont deux termes souvent utilis\u00e9s pour d\u00e9signer la m\u00eame chose. Un panneau phonique ou panneau acoustique mural d\u00e9coratif agit sur la r\u00e9verb\u00e9ration sonore \u00e0 l\u2019int\u00e9rieur d\u2019une pi\u00e8ce \u2014 il absorbe les ondes sonores pour r\u00e9duire l\u2019\u00e9cho et am\u00e9liorer le confort auditif. Nos panneaux sont des rev\u00eatements muraux d\u00e9coratifs : ils combin\u00e9ent traitement acoustique et esth\u00e9tique (bois, cannell\u00e9, relief), id\u00e9aux pour salons, bureaux, boutiques et espaces de vie.',
        },
        {
          type: 'text',
          question: 'Est-ce que \u00e7a insonorise compl\u00e8tement ?',
          answer:
            'Non, les panneaux acoustiques r\u00e9duisent la r\u00e9verb\u00e9ration et am\u00e9liorent le confort sonore dans une pi\u00e8ce \u2014 ils n\u2019isolent pas phon\u00e9quement contre les bruits ext\u00e9rieurs. L\u2019effet varie selon la surface couverte, la hauteur de plafond et le mobilier pr\u00e9sent.',
        },
        {
          type: 'text',
          question: 'O\u00f9 peut-on installer les panneaux acoustiques ?',
          answer:
            'Dans tous les espaces o\u00f9 le confort sonore compte : salon, chambre (t\u00eate de lit), bureau, couloir, mur TV, boutiques et espaces commerciaux.',
        },
        {
          type: 'text',
          question: 'Quel entretien pour les panneaux acoustiques ?',
          answer:
            'Un d\u00e9poussi\u00e9rage r\u00e9gulier suffit. Selon la finition, un chiffon l\u00e9g\u00e8rement humide peut \u00eatre utilis\u00e9 d\u00e9licatement.',
        },
      ],
    },
    {
      label: 'Pose / installation',
      items: [
        {
          type: 'text',
          question: 'Proposez-vous la pose ?',
          answer:
            'Oui, selon la zone g\u00e9ographique. Si la pose n\u2019est pas disponible directement, nous pouvons recommander un poseur de confiance.',
        },
        {
          type: 'text',
          question: 'Est-ce que je peux poser moi-m\u00eame ?',
          answer:
            'Oui, si vous \u00eates bricoleur. Nous fournissons des conseils pratiques : pr\u00e9paration du support, d\u00e9coupe, plinthes, etc. N\u2019h\u00e9sitez pas \u00e0 nous contacter avant de commencer.',
        },
      ],
    },
    {
      label: 'Retour / \u00e9change / garanties',
      items: [
        {
          type: 'text',
          question: 'Puis-je \u00e9changer ou retourner un produit ?',
          answer:
            'Un \u00e9change ou retour est possible selon l\u2019\u00e9tat du produit (non utilis\u00e9, emballage intact). Les produits command\u00e9s sur mesure ou en import sp\u00e9cifique peuvent \u00eatre exclus \u2014 contactez-nous pour \u00e9tudier votre situation.',
        },
        {
          type: 'text',
          question: 'Et si le produit est endommag\u00e9 \u00e0 la livraison ?',
          answer:
            'Signalez-le imm\u00e9diatement avec photos ou vid\u00e9o \u00e0 l\u2019appui. Nous traitons chaque cas rapidement et trouvons une solution : remplacement ou avoir selon la situation.',
        },
      ],
    },
  ];

  stars(n: number): string {
    const safeValue = Math.max(0, Math.min(5, Math.round(n)));

    return '★'.repeat(safeValue) + '☆'.repeat(5 - safeValue);
  }

  isNumber(v: number | string): v is number {
    return typeof v === 'number' && Number.isFinite(v);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setCategory(label: string | null): void {
    this.activeCategory.set(label);
  }
}
