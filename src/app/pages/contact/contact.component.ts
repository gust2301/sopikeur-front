import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';
import { ContactApiService } from '../../shared/services/contact-api.service';
import { environment } from '../../../environments/environment';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type CustomerType = 'Particulier' | 'Professionnel';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const DEFAULT_CUSTOMER_TYPE: CustomerType = 'Particulier';
const PRO_CUSTOMER_TYPE: CustomerType = 'Professionnel';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  customerType: CustomerType = DEFAULT_CUSTOMER_TYPE;
  name = '';
  email = '';
  phone = '';
  message = '';
  website = '';
  turnstileToken = '';
  submitted = false;
  submitState: SubmitState = 'idle';
  submitErrorMessage = '';
  readonly turnstileSiteKey = environment.turnstileSiteKey;
  private turnstileWidgetId: string | null = null;

  constructor(
    private readonly viewportScroller: ViewportScroller,
    private readonly route: ActivatedRoute,
    private readonly contactApiService: ContactApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    const queryCustomerType = this.route.snapshot.queryParamMap.get('customerType');
    if (queryCustomerType === PRO_CUSTOMER_TYPE) {
      this.customerType = PRO_CUSTOMER_TYPE;
    }

    if (this.hasTurnstileEnabled()) {
      this.initTurnstileWidget();
    }

    this.cdr.markForCheck();
  }

  submit(): void {
    this.submitted = true;
    this.submitErrorMessage = '';

    if (this.website.trim()) {
      this.submitState = 'error';
      this.submitErrorMessage = 'Une erreur est survenue.';
      return;
    }

    if (!this.isFormValid()) {
      this.submitState = 'error';
      this.submitErrorMessage = 'Veuillez vérifier les champs du formulaire.';
      return;
    }

    if (this.hasTurnstileEnabled() && !this.turnstileToken.trim()) {
      this.submitState = 'error';
      this.submitErrorMessage = 'Merci de valider la vérification anti-spam.';
      return;
    }

    this.submitState = 'loading';

    this.contactApiService
      .sendContactRequest({
        customerType: this.customerType,
        name: this.name.trim(),
        email: this.email.trim() || undefined,
        phone: this.phone.trim(),
        message: this.message.trim() || undefined,
        website: this.website.trim(),
        turnstileToken: this.hasTurnstileEnabled() ? this.turnstileToken.trim() || undefined : undefined,
      })
      .pipe(finalize(() => {
        this.submitted = false;
        this.resetTurnstileToken();
      }))
      .subscribe({
        next: () => {
          this.submitState = 'success';
          this.resetFormValues();
          this.cdr.markForCheck();
        },
        error: () => {
          this.submitState = 'error';
          this.submitErrorMessage = 'Impossible d’envoyer. Vérifiez les champs ou essayez WhatsApp.';
          this.cdr.markForCheck();
        },
      });
  }

  isNameInvalid(): boolean {
    return this.name.trim().length < 2;
  }

  isEmailInvalid(): boolean {
    const email = this.email.trim();

    if (!email) {
      return false;
    }

    return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  isPhoneInvalid(): boolean {
    const normalizedPhone = this.phone.replace(/\s+/g, '').trim();
    return normalizedPhone.length < 8;
  }

  isMessageInvalid(): boolean {
    const trimmedMessage = this.message.trim();

    if (!trimmedMessage) {
      return false;
    }

    return trimmedMessage.length < 5;
  }

  canShowError(fieldInvalid: boolean): boolean {
    return this.submitted && fieldInvalid;
  }

  get isLoading(): boolean {
    return this.submitState === 'loading';
  }

  getWhatsappFallbackLink(): string {
    const message = [
      'Bonjour, je souhaite être recontacté.',
      `Type de client: ${this.customerType}`,
      this.name ? `Nom: ${this.name}` : '',
      this.phone ? `Téléphone: ${this.phone}` : '',
      this.email ? `Email: ${this.email}` : '',
      this.message ? `Besoin: ${this.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return buildWhatsappLinkFromMessage(message);
  }

  private isFormValid(): boolean {
    return !this.isNameInvalid() && !this.isEmailInvalid() && !this.isPhoneInvalid() && !this.isMessageInvalid();
  }

  private resetFormValues(): void {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.message = '';
    this.website = '';
    this.customerType = DEFAULT_CUSTOMER_TYPE;
  }

  private hasTurnstileEnabled(): boolean {
    return this.turnstileSiteKey.trim().length > 0;
  }

  private initTurnstileWidget(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      if (!window.turnstile) {
        return;
      }

      this.turnstileWidgetId = window.turnstile.render('#turnstile-widget', {
        sitekey: this.turnstileSiteKey,
        callback: (token: string) => {
          this.turnstileToken = token;
          this.cdr.markForCheck();
        },
        'expired-callback': () => {
          this.turnstileToken = '';
          this.cdr.markForCheck();
        },
        'error-callback': () => {
          this.turnstileToken = '';
          this.cdr.markForCheck();
        },
      });
    });
  }

  private resetTurnstileToken(): void {
    this.turnstileToken = '';

    if (typeof window !== 'undefined' && window.turnstile && this.turnstileWidgetId) {
      window.turnstile.reset(this.turnstileWidgetId);
    }

    this.cdr.markForCheck();
  }
}
