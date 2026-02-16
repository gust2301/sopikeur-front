import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqComparisonRow {
  critere: string;
  values: Array<number | string>;
}

interface FaqComparison {
  columns: string[];
  rows: FaqComparisonRow[];
}

interface FaqLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FaqTextItem {
  type: 'text';
  question: string;
  answer: string;
  links?: FaqLink[];
}

interface FaqComparisonItem {
  type: 'comparison';
  question: string;
  comparison: FaqComparison;
}

type FaqItem = FaqTextItem | FaqComparisonItem;

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  faqs: FaqItem[] = [
    {
      type: 'text',
      question: 'Livrez-vous partout au Sénégal ?',
      answer: 'Oui, Sopi Kër livre à Dakar et dans tout le Sénégal selon votre zone et le volume de commande.',
    },
    {
      type: 'text',
      question: 'Proposez-vous la pose ?',
      answer: 'Oui, la pose professionnelle est disponible sur devis pour les sols SPC et les panneaux acoustiques.',
    },
    {
      type: 'text',
      question: 'Le sol SPC résiste-t-il à l’eau ?',
      answer: 'Oui, le SPC est très résistant à l’humidité, ce qui en fait une solution idéale pour de nombreux projets résidentiels et commerciaux.',
    },
    {
      type: 'comparison',
      question: 'Pourquoi choisir un sol SPC plutôt qu’un autre revêtement ?',
      comparison: {
        columns: ['SPC vinyle', 'Carreaux', 'Parquet'],
        rows: [
          { critere: 'Étanchéité', values: [5, 5, 2] },
          { critere: 'Résistance rayures', values: [4, 5, 4] },
          { critere: 'Confort', values: [4, 2, 5] },
          { critere: 'Facilité de pose', values: [5, 2, 2] },
          { critere: 'Stabilité thermique', values: [5, 2, 3] },
          { critere: 'Prix moyen', values: ['Moyen', 'Moyen', 'Élevé'] },
          { critere: 'Durabilité', values: [4, 5, 4] },
        ],
      },
    },
    {
      type: 'text',
      question: 'Comment obtenir un devis ?',
      answer: 'Vous pouvez demander un devis via notre formulaire de contact ou directement sur WhatsApp.',
      links: [
        { label: 'Formulaire de contact', href: '/contact/' },
        {
          label: 'WhatsApp',
          href: 'https://wa.me/221774293757?text=Bonjour%2C%20je%20souhaite%20obtenir%20un%20devis.',
          external: true,
        },
      ],
    },
  ];

  stars(n: number): string {
    const safeValue = Math.max(0, Math.min(5, Math.round(n)));

    return '★'.repeat(safeValue) + '☆'.repeat(5 - safeValue);
  }

  isNumber(v: number | string): v is number {
    return typeof v === 'number' && Number.isFinite(v);
  }
}
