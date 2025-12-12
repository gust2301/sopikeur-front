import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [NgIf],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() align: 'left' | 'center' = 'center';
}
