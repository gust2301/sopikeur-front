import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cgv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cgv.component.html',
  styleUrl: './cgv.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CgvComponent {}
