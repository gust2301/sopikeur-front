import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-engagement-qualite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './engagement-qualite.component.html',
  styleUrl: './engagement-qualite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementQualiteComponent {}
