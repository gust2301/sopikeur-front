import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-color-card',
  standalone: true,
  imports: [NgFor, ButtonComponent],
  templateUrl: './color-card.component.html',
  styleUrls: ['./color-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorCardComponent {
  @Input() name = '';
  @Input() gradient = '';
  @Input() badgeColor = '';
  @Input() specs: string[] = [];
  @Input() price = '';
  @Input() ctaLabel = 'Simuler';
}
