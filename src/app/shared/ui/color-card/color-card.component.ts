import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-color-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './color-card.component.html',
  styleUrl: './color-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorCardComponent {
  @Input() name = '';
  @Input() gradient = '';
  @Input() badgeColor = '';
  @Input() specs: string[] = [];
  @Input() price?: string;
  @Output() simulate = new EventEmitter<void>();
}
