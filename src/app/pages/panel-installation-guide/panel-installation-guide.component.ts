import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-panel-installation-guide',
  standalone: true,
  imports: [CommonModule, RouterModule, AssetUrlPipe],
  templateUrl: './panel-installation-guide.component.html',
  styleUrl: './panel-installation-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelInstallationGuideComponent {}
