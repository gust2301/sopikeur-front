import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

type SectionAlign = 'center' | 'left';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() align: SectionAlign = 'center';
}
