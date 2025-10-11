import {Component, AfterViewInit, ElementRef, NgZone, Inject, PLATFORM_ID, OnDestroy} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {BeforeAfterComponent} from "../../shared/app-before-after/before-after.component";

declare const lucide: any; // Provided by CDN in index.html

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],

  imports: [
    BeforeAfterComponent
  ]
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private rafId: number | null = null;
  private readonly isBrowser: boolean;
  positionPct = 45;
  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // ❗ rien côté serveur

    // Init icônes Lucide (browser only)
    try { lucide?.createIcons?.(); } catch {}

    const root = this.host.nativeElement;

    // Smooth scroll ancres internes (browser only)
    root.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e: Event) => {
        const href = (a.getAttribute('href') || '').trim();
        if (href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = root.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Auto-scroll du slider (browser only)
    const track = root.querySelector<HTMLDivElement>('#colorsTrack');
    if (!track) return;

    let paused = false;
    const loop = () => {
      if (paused) {
        this.rafId = requestAnimationFrame(loop);
        return;
      }
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      track.scrollLeft = (track.scrollLeft + 0.5) % max;
      this.rafId = requestAnimationFrame(loop);
    };

    // Lance l’animation hors Angular pour perf
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(loop);
      track.addEventListener('mouseenter', () => (paused = true));
      track.addEventListener('mouseleave', () => (paused = false));
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null && this.isBrowser) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
