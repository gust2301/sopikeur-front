import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';

type SubmitState = 'idle' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  customerType = 'Particulier';
  name = '';
  contact = '';
  message = '';
  submitState: SubmitState = 'idle';

  constructor(private readonly viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  submit(): void {
    if (!this.name.trim() || !this.contact.trim()) {
      this.submitState = 'error';
      return;
    }

    const subject = 'Demande de contact';
    const body = [
      'Bonjour,',
      `Type de client: ${this.customerType}`,
      `Nom: ${this.name}`,
      `Contact: ${this.contact}`,
      `Besoin: ${this.message || '-'}`,
    ].join('\n');

    const mailto = `mailto:contact@sopikeur.sn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.submitState = 'success';
    window.location.href = mailto;
  }

  getWhatsappFallbackLink(): string {
    const message = [
      'Bonjour, je souhaite être recontacté.',
      `Type de client: ${this.customerType}`,
      this.name ? `Nom: ${this.name}` : '',
      this.contact ? `Contact: ${this.contact}` : '',
      this.message ? `Besoin: ${this.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return buildWhatsappLinkFromMessage(message);
  }
}
