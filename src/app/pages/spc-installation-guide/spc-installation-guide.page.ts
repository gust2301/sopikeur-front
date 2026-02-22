import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-spc-installation-guide-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AssetUrlPipe],
  templateUrl: './spc-installation-guide.page.html',
  styleUrl: './spc-installation-guide.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpcInstallationGuidePageComponent {}
