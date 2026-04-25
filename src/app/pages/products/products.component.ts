import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { CatalogProduct, CatalogProductType } from '../../shared/models/catalog-product.model';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import { CartService } from '../../shared/services/cart.service';
import { ProductPage, ProductStockStatus, ProductsApi } from '../../shared/services/products-api.service';
import { EditorialSeoItem, EditorialSeoSectionComponent } from '../../shared/ui/editorial-seo-section/editorial-seo-section.component';

const STOCK_FILTERS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'IN_STOCK', label: 'En stock' },
  { value: 'PREORDER', label: 'Précommande' },
] as const;

type StockFilter = (typeof STOCK_FILTERS)[number]['value'];

interface ProductsViewModel {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  pages: number[];
  type: CatalogProductType;
  title: string;
  subtitle: string;
  loading: boolean;
  error?: string;
}

interface EditorialSeoContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  highlights: string[];
  items: EditorialSeoItem[];
  footerKicker: string;
  footerText: string;
  ctaLabel: string;
}

const SEO_CONTENT: Record<CatalogProductType, EditorialSeoContent> = {
  spc: {
    eyebrow: 'Guide SPC',
    title: 'Revêtement de sol SPC au Sénégal',
    subtitle:
      'Découvrez les points essentiels pour choisir le bon sol SPC selon votre pièce, votre style d intérieur et votre niveau d usage.',
    intro:
      "Le sol SPC séduit par son rendu soigné, son entretien simple et sa bonne tenue dans les espaces résidentiels comme professionnels. Voici l'essentiel pour comparer les finitions, mieux vous projeter et préparer votre projet dans de bonnes conditions.",
    highlights: ['Sol SPC Dakar', 'Pose et livraison', 'Maison, bureau, commerce'],
    items: [
      {
        kicker: 'Choix du matériau',
        title: 'Pourquoi choisir un sol SPC à Dakar ?',
        summary:
          "Le revêtement de sol SPC est recherché à Dakar pour sa stabilité, son entretien simple et son rendu plus chaleureux qu'un carrelage classique. Il s'adapte bien aux pièces de vie comme aux espaces professionnels.",
        points: [
          "Bonne tenue face à l'humidité et au passage quotidien",
          "Confort de marche plus doux qu'un sol dur traditionnel",
          'Aspect bois ou minéral pour un intérieur plus soigné',
        ],
        details: [
          "Le SPC, pour Stone Plastic Composite, repose sur une âme rigide qui limite les déformations et facilite un usage régulier dans un appartement, une villa, un bureau ou un commerce. C'est une option pertinente quand on cherche un sol pratique sans sacrifier l'esthétique.",
          "Dans le contexte sénégalais, il intéresse aussi pour sa polyvalence : salon, chambre, couloir, boutique, réception ou showroom. Avec une finition bien choisie, il permet de moderniser un intérieur tout en gardant une maintenance légère au quotidien.",
        ],
      },
      {
        kicker: 'Finitions',
        title: 'Coloris, formats et usages pièce par pièce',
        summary:
          "Une page liste doit aider à se projeter vite. Les décors bois clairs, noyers, gris chauds ou effets minéraux ne répondent pas aux mêmes besoins selon la lumière, le mobilier et la fonction de la pièce.",
        points: [
          'Tons clairs pour agrandir visuellement une pièce',
          'Finitions plus soutenues pour bureaux, hôtels ou espaces premium',
          'Choix possible selon salon, chambre, commerce ou accueil client',
        ],
        details: [
          "Un sol SPC clair fonctionne bien dans les intérieurs contemporains et les pièces peu lumineuses. Les teintes plus profondes ou texturées renforcent au contraire une ambiance plus statutaire pour un bureau, un restaurant ou une zone de réception.",
          "Selon les références disponibles, vous pouvez comparer lames, finitions et disponibilité stock ou précommande directement depuis la liste produits. Cela permet de filtrer plus vite avant une demande de devis ou de pose.",
        ],
      },
      {
        kicker: 'Service',
        title: 'Livraison, disponibilité et pose de SPC',
        summary:
          "Au-delà du produit, les recherches portent souvent sur la disponibilité, la pose de SPC à Dakar et la capacité à livrer rapidement. Cette partie répond à ce besoin de réassurance commerciale.",
        points: [
          'Repérage simple entre produits en stock et références sur commande',
          'Livraison possible à Dakar et dans les principales villes',
          "Accompagnement pour chiffrer fourniture, surface et pose",
        ],
        details: [
          "La qualité d'un projet ne dépend pas seulement du décor choisi. La préparation du support, le niveau du sol, la découpe et les finitions jouent un rôle direct dans le rendu final. Une pose bien préparée évite les reprises et sécurise la durabilité du revêtement.",
          "Si vous avez un projet de maison, de bureau ou de commerce, vous pouvez demander un devis avec la surface à couvrir, la ville et le type d'usage. Cela permet d'orienter plus vite la bonne référence et le bon niveau d'intervention.",
        ],
      },
    ],
    footerKicker: 'Projet sol SPC',
    footerText:
      "Besoin de comparer plusieurs décors, d'estimer la quantité ou d'organiser une pose de SPC à Dakar ou ailleurs au Sénégal ?",
    ctaLabel: 'Recevoir un devis SPC',
  },
  acoustic: {
    eyebrow: 'Guide panneaux',
    title: 'Panneaux acoustiques décoratifs au Sénégal',
    subtitle:
      "Des repères simples pour choisir les bons panneaux selon votre style, le niveau de confort acoustique recherché et le type d'espace à aménager.",
    intro:
      "Les panneaux acoustiques décoratifs permettent d'améliorer l'ambiance sonore tout en valorisant un mur avec une finition plus haut de gamme. Cette sélection vous aide à comparer les usages, les rendus et les points à anticiper avant la pose.",
    highlights: ['Confort acoustique', 'Mur TV et tête de lit', 'Bureau, hôtel, restaurant'],
    items: [
      {
        kicker: 'Usage',
        title: 'Pourquoi intégrer des panneaux acoustiques décoratifs ?',
        summary:
          "Les panneaux acoustiques muraux améliorent le confort sonore tout en apportant une vraie valeur décorative. Ils répondent bien aux espaces où l'on veut réduire la réverbération sans perdre en style.",
        points: [
          "Moins d'écho dans un salon, un bureau ou une salle de réunion",
          'Habillage mural premium pour mur TV, tête de lit ou accueil',
          "Lecture plus calme de l'espace dans les lieux de passage",
        ],
        details: [
          "Dans un intérieur moderne, un hôtel, un restaurant ou un open space, les surfaces dures accentuent vite la résonance. Les panneaux acoustiques décoratifs permettent de corriger ce ressenti tout en structurant visuellement un mur important.",
          "Leur intérêt ne se limite pas à l'acoustique. Ils servent aussi à créer un point focal propre, à valoriser une zone de réception ou à renforcer l'identité visuelle d'un lieu commercial.",
        ],
      },
      {
        kicker: 'Collection',
        title: "Modèles, finitions et contextes d'usage",
        summary:
          "Le bon panneau dépend du style recherché, mais aussi du lieu. Un projet résidentiel, un restaurant, une boutique ou un bureau ne demandent pas le même rendu ni la même présence visuelle.",
        points: [
          'Panneaux cannelés pour un effet bois vertical et chaleureux',
          'Finitions graphiques ou micro perforées pour bureaux et commerces',
          'Ambiance plus premium pour salon, chambre ou suite hôtelière',
        ],
        details: [
          "Les modèles cannelés sont souvent choisis pour un mur TV, une tête de lit ou un salon contemporain. Les versions plus graphiques conviennent bien aux boutiques, cafés, restaurants et espaces où le mur participe à l'image de marque.",
          "La liste produits aide à comparer les références disponibles, les rendus et le statut de stock. C'est utile pour avancer rapidement sur un projet décoratif sans attendre un échange commercial pour chaque option.",
        ],
      },
      {
        kicker: 'Pose et devis',
        title: 'Livraison et installation de panneaux acoustiques',
        summary:
          "Au moment de choisir vos panneaux acoustiques, il est utile d'anticiper la livraison, les conditions de pose et le niveau de finition attendu, surtout pour un projet à Dakar ou dans une autre ville du Sénégal.",
        points: [
          'Livraison organisée selon la disponibilité des références et le volume du projet',
          'Installation adaptée au support, au calepinage et au rendu recherché',
          'Devis personnalisé pour maison, bureau, hôtel, restaurant ou commerce',
        ],
        details: [
          "La réussite du rendu dépend de la surface à couvrir, du type de support et du niveau de finition attendu. Une installation propre demande un repérage précis, surtout quand le mur devient un élément décoratif majeur.",
          "Pour un projet résidentiel ou professionnel, vous pouvez demander un chiffrage avec la surface, la ville et le contexte d'usage. Cela permet d'orienter plus vite le bon modèle, le bon volume et le bon niveau d'accompagnement.",
        ],
      },
    ],
    footerKicker: 'Projet mural acoustique',
    footerText:
      "Vous souhaitez habiller un mur TV, une tête de lit, un bureau ou un espace commercial avec une solution acoustique plus premium ?",
    ctaLabel: 'Recevoir un devis panneaux',
  },
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AssetUrlPipe, EditorialSeoSectionComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApi);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  readonly stockFilters = STOCK_FILTERS;
  readonly pageSizeOptions = [12, 16];

  searchText = '';
  stockSelection: StockFilter = 'ALL';
  pageSize = 12;

  private readonly searchInput$ = new Subject<string>();
  private readonly query$ = new BehaviorSubject<string>('');
  private readonly stock$ = new BehaviorSubject<StockFilter>('ALL');
  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly pageSize$ = new BehaviorSubject<number>(this.pageSize);

  private readonly type$ = this.route.data.pipe(
    map(data => (data['type'] as 'SPC' | 'PANEL' | undefined) ?? 'SPC'),
    map(type => (type === 'PANEL' ? 'acoustic' : 'spc') as CatalogProductType),
    tap(() => this.resetFilters()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly uiMessage = this.cartService.uiMessage;

  readonly vm$ = combineLatest({
    type: this.type$,
    query: this.query$,
    stock: this.stock$,
    page: this.page$,
    pageSize: this.pageSize$,
  }).pipe(
    switchMap(({ type, query, stock, page, pageSize }) =>
      this.productsApi
        .getProducts({
          type,
          page,
          size: pageSize,
          q: query || undefined,
          stock,
        })
        .pipe(
          map(result => this.buildViewModel(result, { type, page, pageSize })),
          startWith(this.buildViewModel({ items: [], total: 0 }, { type, page, pageSize }, true)),
          catchError(() =>
            of(
              this.buildViewModel(
                { items: [], total: 0 },
                { type, page, pageSize },
                false,
                'Impossible de charger les produits pour le moment.',
              ),
            ),
          ),
        ),
    ),
  );

  constructor() {
    this.searchInput$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.query$.next(value.trim());
        this.page$.next(1);
      });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.searchInput$.next(value);
  }

  onStockChange(value: StockFilter): void {
    this.stockSelection = value;
    this.stock$.next(value);
    this.page$.next(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageSize$.next(size);
    this.page$.next(1);
  }

  goToPage(page: number): void {
    this.page$.next(page);
  }

  trackById(_: number, item: CatalogProduct): string {
    return item.id;
  }

  trackByPage(_: number, page: number): number {
    return page;
  }

  getSeoContent(type: CatalogProductType): EditorialSeoContent {
    return SEO_CONTENT[type];
  }

  dismissMessage(): void {
    this.cartService.clearMessage();
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  handlePrimaryAction(product: CatalogProduct): void {
    if (product.inStock) {
      this.cartService.addProduct(product);
      return;
    }

    void this.router.navigate(['/precommande'], { queryParams: { productId: product.id, productType: product.type } });
  }

  getStockLabel(product: CatalogProduct): string {
    const status = this.resolveStockStatus(product);

    switch (status) {
      case 'IN_STOCK':
        return 'En stock';
      case 'PREORDER':
        return 'PRECOMMANDE';
      default:
        return 'PRECOMMANDE';
    }
  }

  isPreorder(product: CatalogProduct): boolean {
    return this.resolveStockStatus(product) === 'PREORDER';
  }

  private resetFilters(): void {
    this.searchText = '';
    this.stockSelection = 'ALL';
    this.pageSize = 12;
    this.query$.next('');
    this.stock$.next('ALL');
    this.pageSize$.next(12);
    this.page$.next(1);
  }

  private buildViewModel(
    result: ProductPage,
    options: { type: CatalogProductType; page: number; pageSize: number },
    loading = false,
    error?: string,
  ): ProductsViewModel {
    const totalPages = Math.max(1, Math.ceil(result.total / options.pageSize));
    const safePage = Math.min(options.page, totalPages);

    if (safePage !== options.page) {
      this.page$.next(safePage);
    }

    const title = options.type === 'spc' ? 'Revêtements SPC' : 'Panneaux acoustiques';
    const subtitle =
      options.type === 'spc'
        ? 'Liste complète de nos teintes SPC avec recherche et disponibilité.'
        : 'Nos panneaux acoustiques avec recherche rapide et statut de stock.';

    return {
      products: this.sortByAvailability(result.items),
      total: result.total,
      page: safePage,
      pageSize: options.pageSize,
      pages: Array.from({ length: totalPages }, (_, index) => index + 1),
      type: options.type,
      title,
      subtitle,
      loading,
      error,
    };
  }

  private sortByAvailability(items: CatalogProduct[]): CatalogProduct[] {
    return [...items].sort((a, b) => Number(Boolean(b.inStock)) - Number(Boolean(a.inStock)));
  }

  private resolveStockStatus(product: CatalogProduct): ProductStockStatus {
    const apiStatus = (product as { stockStatus?: ProductStockStatus }).stockStatus;

    if (apiStatus === 'IN_STOCK') {
      return 'IN_STOCK';
    }

    if (apiStatus === 'PREORDER' || apiStatus === 'OUT_OF_STOCK') {
      return 'PREORDER';
    }

    if (product.inStock === true) {
      return 'IN_STOCK';
    }

    return 'PREORDER';
  }
}
