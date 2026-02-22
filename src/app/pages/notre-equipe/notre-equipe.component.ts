import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notre-equipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notre-equipe.component.html',
  styleUrl: './notre-equipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotreEquipeComponent {}
