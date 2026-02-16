import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nos-valeurs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nos-valeurs.component.html',
  styleUrl: './nos-valeurs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NosValeursComponent {}
