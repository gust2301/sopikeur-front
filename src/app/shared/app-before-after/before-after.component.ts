import { isPlatformBrowser, NgStyle} from '@angular/common';
import {
  Component, Input, ElementRef, Inject, PLATFORM_ID,
  NgZone, HostListener, OnInit
} from '@angular/core';

@Component({
  selector: 'app-before-after',
  standalone: true,
  templateUrl: './before-after.component.html',
  styleUrls: ['./before-after.component.scss'],
  imports: [NgStyle]
})
export class BeforeAfterComponent implements OnInit {
  /** Deux images séparées (optionnel) */
  @Input() beforeUrl?: string;
  @Input() afterUrl?: string;

  /** Sprite unique 2-colonnes (gauche=avant, droite=après) (optionnel) */
  @Input() spriteUrl?: string;

  /** Position initiale du curseur (0–100) */
  @Input() start = 50;
  beforeBg = `url('${this.spriteUrl ?? this.beforeUrl}')`;
  beforeSize = this.spriteUrl ? '200% 100%' : 'cover';
  beforePos  = this.spriteUrl ? '0% 50%' : 'center';

  afterBg = `url('${this.spriteUrl ?? this.afterUrl}')`;
  afterSize = this.spriteUrl ? '200% 100%' : 'cover';
  afterPos  = this.spriteUrl ? '100% 50%' : 'center';
  positionPct = 50;
  private dragging = false;
  private readonly isBrowser: boolean;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    console.log("beforeUrl "+this.beforeUrl)
    this.positionPct = Math.min(100, Math.max(0, this.start));
  }

  /** Styles dynamiques pour la couche “avant” */
  get beforeStyle(): Record<string,string> {
    if (this.spriteUrl) {
      return {
        'background-image': `url('${this.spriteUrl}')`,
        'background-size': '200% 100%',
        'background-position': '0% 50%',
      };
    }

    return { 'background-image': `url('${this.beforeUrl ?? ''}')` };
  }

  /** Styles dynamiques pour la couche “après” */
  get afterStyle(): Record<string,string> {
    if (this.spriteUrl) {
      return {
        'background-image': `url('${this.spriteUrl}')`,
        'background-size': '200% 100%',
        'background-position': '100% 50%',
      };
    }
    return { 'background-image': `url('${this.afterUrl ?? ''}')` };
  }

  /** Début du drag */
  startDrag(e: PointerEvent) {
    if (!this.isBrowser) return;
    this.dragging = true;
    try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); } catch {}
    this.zone.runOutsideAngular(() => this.onPointerMove(e));
  }

  /** Déplacement */
  @HostListener('document:pointermove', ['$event'])
  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    this.positionPct = +(x / rect.width * 100).toFixed(2);
  }

  /** Fin du drag */
  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  stopDrag() {
    this.dragging = false;
  }
}
