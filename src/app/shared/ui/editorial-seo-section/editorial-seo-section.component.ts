import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../section-title/section-title.component';

export interface EditorialSeoItem {
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  details?: string[];
}

@Component({
  selector: 'app-editorial-seo-section',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionTitleComponent],
  templateUrl: './editorial-seo-section.component.html',
  styleUrl: './editorial-seo-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialSeoSectionComponent {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) subtitle = '';
  @Input({ required: true }) intro = '';
  @Input({ required: true }) highlights: string[] = [];
  @Input({ required: true }) items: EditorialSeoItem[] = [];
  @Input() footerKicker = 'Projet sur mesure';
  @Input() footerText =
    "Besoin d'un avis sur la bonne finition, la quantité à prévoir ou la pose la plus adaptée à votre espace ?";
  @Input() ctaLabel = 'Demander un devis';
}
