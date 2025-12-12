import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-link-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './link-button.component.html',
  styleUrl: './link-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkButtonComponent {
  @Input() href!: string;
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() size: 'md' | 'lg' = 'md';
  @Input() target?: string;
  @Input() rel?: string;
  @Input() block = false;

  @HostBinding('class.block')
  get blockClass(): boolean {
    return this.block;
  }

  get classes(): string {
    return `btn btn--${this.variant} btn--${this.size}`;
  }

  get computedRel(): string | null {
    if (!this.target || this.rel) {
      return this.rel ?? null;
    }

    return this.target === '_blank' ? 'noopener noreferrer' : null;
  }
}
