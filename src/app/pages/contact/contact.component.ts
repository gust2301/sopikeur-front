import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { buildWhatsappLinkFromMessage } from '../../shared/utils/whatsapp';
import { ContactApiService } from '../../shared/services/contact-api.service';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type CustomerType = 'Particulier' | 'Professionnel';

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
  submitted = false;
  submitState: SubmitState = 'idle';

  constructor(
    private readonly viewportScroller: ViewportScroller,
    private readonly route: ActivatedRoute,
    private readonly contactApiService: ContactApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    if (this.route.snapshot.queryParamMap.get('customerType') === PRO_CUSTOMER_TYPE) {
      this.customerType = PRO_CUSTOMER_TYPE;
      this.cdr.markForCheck();
    }
  }

  submit(): void {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.submitState = 'error';
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
      })
      .pipe(finalize(() => this.submitted = false))
      .subscribe({
        next: () => {
          this.submitState = 'success';
          this.resetFormValues();
          this.cdr.markForCheck();
        },
        error: () => {
          this.submitState = 'error';
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
    this.customerType = DEFAULT_CUSTOMER_TYPE;
  }
}
