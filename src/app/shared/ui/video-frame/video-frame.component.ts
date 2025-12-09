import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-video-frame',
  standalone: true,
  imports: [NgIf],
  templateUrl: './video-frame.component.html',
  styleUrls: ['./video-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoFrameComponent {
  @Input() videoUrl?: string;
  @Input() ariaLabel = 'Présentation vidéo Sopi Keur';
}
