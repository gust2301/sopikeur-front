import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon?: string;
}
