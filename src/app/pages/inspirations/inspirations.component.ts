import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CatalogProduct } from '../../shared/models/catalog-product.model';
import { ProductsApi } from '../../shared/services/products-api.service';

type InspirationTag = 'spc' | 'panels';
type InspirationTab = 'all' | InspirationTag;
type InspirationType = 'single' | 'beforeAfter';
type ProductKind = 'spc' | 'panel';

interface ProductRef {
  kind: ProductKind;
  id: string;
}

interface InspirationItem {
  id: string;
  title: string;
  type: InspirationType;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  tags: InspirationTag[];
  productRefs?: ProductRef[];
}

interface InspirationProductLine {
  ref: ProductRef;
  product?: CatalogProduct;
  label: string;
}

const PANEL_ALIASES: Record<string, string> = {
  HXAGONB: 'HEXAGONB',
  HEGAGONB: 'HEXAGONB',
};

const NEW_INSPIRATION_IMAGES = [
  '/assets/spc/SPC001_store.png',
  '/assets/panels/SPC006_HXAGONB_office.png',
  '/assets/panels/SPC014_HXAGONB_office.png',
  '/assets/panels/HEXAGONB_office.png',
  '/assets/panels/HEGAGONB_light_home.png',
];

const PANEL_SKUS = ['M-60240-WAVE1', 'HEXAGON', 'HEXAGONB'];

const LEGACY_INSPIRATIONS: InspirationItem[] = [
  {
    id: 'spc006-natural-oak',
    title: 'Chêne naturel clair',
    type: 'beforeAfter',
    beforeImage: '/assets/spc/spc_home_before.png',
    afterImage: '/assets/spc/SPC006_home.png',
    tags: ['spc'],
    productRefs: [{ kind: 'spc', id: 'spc006' }],
  },
  {
    id: 'spc014-dark-walnut',
    title: 'Noyer profond',
    type: 'beforeAfter',
    beforeImage: '/assets/spc/spc_home_before.png',
    afterImage: '/assets/spc/SPC014_home.png',
    tags: ['spc'],
    productRefs: [{ kind: 'spc', id: 'spc014' }],
  },
  {
    id: 'spc001-light-wood',
    title: 'Bois clair moderne',
    type: 'beforeAfter',
    beforeImage: '/assets/spc/spc_home_before.png',
    afterImage: '/assets/spc/SPC001_home.png',
    tags: ['spc'],
    productRefs: [{ kind: 'spc', id: 'spc001' }],
  },
  {
    id: 'spc008-warm-stone',
    title: 'Pierre beige chaleureuse',
    type: 'beforeAfter',
    beforeImage: '/assets/spc/spc_home_before.png',
    afterImage: '/assets/spc/SPC008_home.png',
    tags: ['spc'],
    productRefs: [{ kind: 'spc', id: 'spc008' }],
  },
  {
    id: 'spc011-grey-mineral',
    title: 'Gris minéral contemporain',
    type: 'beforeAfter',
    beforeImage: '/assets/spc/spc_home_before.png',
    afterImage: '/assets/spc/SPC011_home.png',
    tags: ['spc'],
    productRefs: [{ kind: 'spc', id: 'spc010' }],
  },
  {
    id: 'panel-tete-lit',
    title: 'Tête de lit',
    type: 'single',
    image: '/assets/panels/bed_HEXAGONB.png',
    tags: ['panels'],
    productRefs: [{ kind: 'panel', id: 'hexagonb' }],
  },
  {
    id: 'panel-mur-tv',
    title: 'Mur TV',
    type: 'single',
    image: '/assets/panels/wall_HEXAGONB.png',
    tags: ['panels'],
    productRefs: [{ kind: 'panel', id: 'hexagonb' }],
  },
  {
    id: 'panel-accueil',
    title: 'Mur d’accueil',
    type: 'single',
    image: '/assets/panels/wall_M-60240-WAVE1.png',
    tags: ['panels'],
    productRefs: [{ kind: 'panel', id: 'm-60240-wave1' }],
  },
  {
    id: 'panel-chambre',
    title: 'Chambre cosy',
    type: 'single',
    image: '/assets/panels/bed_M-60240-WAVE1.png',
    tags: ['panels'],
    productRefs: [{ kind: 'panel', id: 'm-60240-wave1' }],
  },
];

const ENV_LABELS: Record<string, string> = {
  office: 'Bureau',
  home: 'Salon',
  bed: 'Chambre',
  wall: 'Mur',
  store: 'Boutique',
};

const normalizeFilename = (path: string): string => path.split('/').pop() ?? path;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const extractSpcCodes = (filename: string): string[] => {
  const matches = filename.toUpperCase().match(/SPC\d{3}/g);
  return matches ? Array.from(new Set(matches)) : [];
};

const extractPanelCodes = (filename: string): string[] => {
  const upper = filename.toUpperCase();
  const matches = PANEL_SKUS.filter(code => upper.includes(code));
  const aliasMatches = Object.keys(PANEL_ALIASES).filter(alias => upper.includes(alias));
  const mappedAliases = aliasMatches.map(alias => PANEL_ALIASES[alias]);
  return Array.from(new Set([...matches, ...mappedAliases]));
};

const buildProductRefs = (spcCodes: string[], panelCodes: string[]): ProductRef[] => {
  const refs: ProductRef[] = [];
  spcCodes.forEach(code => refs.push({ kind: 'spc', id: code.toLowerCase() }));
  panelCodes.forEach(code => refs.push({ kind: 'panel', id: code.toLowerCase() }));
  return refs;
};

const buildTitleFromFilename = (path: string): string => {
  const basename = normalizeFilename(path);
  const raw = basename.replace(/\.[^.]+$/, '');
  const tokens = raw.split('_');
  const cleanTokens = tokens.filter(token => {
    const upper = token.toUpperCase();
    return !upper.startsWith('SPC') && !PANEL_SKUS.includes(upper) && !Object.keys(PANEL_ALIASES).includes(upper);
  });
  const lastToken = cleanTokens[cleanTokens.length - 1]?.toLowerCase();
  const label = lastToken ? ENV_LABELS[lastToken] : undefined;
  return label ? `Ambiance ${label}` : 'Nouvelle inspiration';
};

const buildInspirationFromImage = (path: string): InspirationItem => {
  const filename = normalizeFilename(path);
  const spcCodes = extractSpcCodes(filename);
  const panelCodes = extractPanelCodes(filename);
  const tags = new Set<InspirationTag>();
  if (spcCodes.length > 0) {
    tags.add('spc');
  }
  if (panelCodes.length > 0) {
    tags.add('panels');
  }
  if (tags.size === 0) {
    tags.add(path.includes('/panels/') ? 'panels' : 'spc');
  }
  const productRefs = buildProductRefs(spcCodes, panelCodes);
  return {
    id: slugify(filename.replace(/\.[^.]+$/, '')),
    title: buildTitleFromFilename(path),
    type: 'single',
    image: path,
    tags: Array.from(tags),
    productRefs: productRefs.length > 0 ? productRefs : undefined,
  };
};

@Component({
  selector: 'app-inspirations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inspirations.component.html',
  styleUrl: './inspirations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspirationsComponent {
  @ViewChild('modalContent') modalContent?: ElementRef<HTMLDivElement>;
  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

  tabs: { label: string; value: InspirationTab }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Sols SPC', value: 'spc' },
    { label: 'Panneaux', value: 'panels' },
  ];

  readonly newItems: InspirationItem[] = NEW_INSPIRATION_IMAGES.map(buildInspirationFromImage);
  readonly legacyItems: InspirationItem[] = LEGACY_INSPIRATIONS;

  activeTab: InspirationTab = 'all';
  selectedItem: InspirationItem | null = null;
  sliderValue = 50;
  showProductSheet = false;

  private catalogProducts: CatalogProduct[] = [];

  constructor(private readonly router: Router, private readonly productsApi: ProductsApi) {
    this.productsApi.getCatalogProducts().subscribe({
      next: products => {
        this.catalogProducts = products;
      },
    });
  }

  get filteredNewItems(): InspirationItem[] {
    return this.filterItems(this.newItems);
  }

  get filteredLegacyItems(): InspirationItem[] {
    return this.filterItems(this.legacyItems);
  }

  get selectedProductLines(): InspirationProductLine[] {
    if (!this.selectedItem?.productRefs?.length) {
      return [];
    }
    return this.selectedItem.productRefs.map(ref => this.buildProductLine(ref)).filter(Boolean) as InspirationProductLine[];
  }

  get hasSingleProduct(): boolean {
    return this.selectedProductLines.length === 1;
  }

  get hasMultipleProducts(): boolean {
    return this.selectedProductLines.length > 1;
  }

  get hasProductLinks(): boolean {
    return this.selectedProductLines.length > 0;
  }

  getCardImage(item: InspirationItem): string {
    if (item.type === 'beforeAfter') {
      return item.afterImage ?? '';
    }
    return item.image ?? '';
  }

  getDetailImage(item: InspirationItem): string {
    return item.type === 'single' ? item.image ?? '' : item.afterImage ?? '';
  }

  getBadgeLabels(item: InspirationItem): string[] {
    const labels: string[] = [];
    if (item.tags.includes('spc')) {
      labels.push('SPC');
    }
    if (item.tags.includes('panels')) {
      labels.push('PANNEAUX');
    }
    return labels;
  }

  openProductSheet(): void {
    if (!this.hasMultipleProducts) {
      return;
    }
    this.showProductSheet = true;
  }

  closeProductSheet(): void {
    this.showProductSheet = false;
  }

  setTab(tab: InspirationTab): void {
    this.activeTab = tab;
  }

  openLightbox(item: InspirationItem): void {
    this.selectedItem = item;
    this.sliderValue = 50;
    setTimeout(() => {
      this.closeButton?.nativeElement.focus();
    });
  }

  closeLightbox(): void {
    this.selectedItem = null;
    this.showProductSheet = false;
  }

  handleSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      return;
    }
    this.sliderValue = Number(target.value);
  }

  handleModalKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      return;
    }
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.modalContent) {
      return [];
    }
    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.modalContent.nativeElement.querySelectorAll<HTMLElement>(selector)).filter(
      element => !element.hasAttribute('disabled'),
    );
  }

  navigateToProduct(ref: ProductRef): void {
    const product = this.findCatalogProduct(ref);
    const type = product?.type ?? (ref.kind === 'panel' ? 'acoustic' : 'spc');
    const id = product?.id ?? ref.id;
    this.router.navigate(['/product', type, id]);
    this.closeLightbox();
  }

  handlePrimaryCta(): void {
    if (!this.selectedItem) {
      return;
    }
    if (this.hasSingleProduct) {
      const target = this.selectedProductLines[0];
      this.navigateToProduct(target.ref);
      return;
    }
    this.openProductSheet();
  }

  get isBeforeAfter(): boolean {
    return this.selectedItem?.type === 'beforeAfter';
  }

  get dialogTitleId(): string {
    return this.selectedItem ? `inspiration-title-${this.selectedItem.id}` : 'inspiration-title';
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.selectedItem) {
      return;
    }
    if (event.key === 'Escape') {
      if (this.showProductSheet) {
        this.closeProductSheet();
      } else {
        this.closeLightbox();
      }
    }
  }

  private filterItems(items: InspirationItem[]): InspirationItem[] {
    const activeTab = this.activeTab;
    if (activeTab === 'all') {
      return items;
    }
    return items.filter(item => item.tags.includes(activeTab));
  }

  private buildProductLine(ref: ProductRef): InspirationProductLine | undefined {
    const product = this.findCatalogProduct(ref);
    const baseLabel = ref.kind === 'spc' ? 'Produit SPC' : 'Panneau';
    const label = product ? `${baseLabel} • ${product.sku}` : baseLabel;
    return { ref, product, label };
  }

  private findCatalogProduct(ref: ProductRef): CatalogProduct | undefined {
    return this.catalogProducts.find(product => {
      if (ref.kind === 'spc') {
        return product.type === 'spc' && product.id === ref.id;
      }
      return product.type === 'acoustic' && product.id === ref.id;
    });
  }
}
