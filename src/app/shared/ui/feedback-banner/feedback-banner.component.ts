import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface FeedbackAction {
  label: string;
  kind?: 'primary' | 'ghost';
  routerLink?: any[];
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'app-feedback-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feedback-banner.component.html',
  styleUrl: './feedback-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackBannerComponent implements AfterViewInit {
  @Input({ required: true }) type: 'success' | 'error' | 'info' = 'info';
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() referenceLabel?: string;
  @Input() referenceValue?: string;
  @Input() actions: FeedbackAction[] = [];

  @ViewChild('banner') private readonly bannerRef?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.bannerRef?.nativeElement.focus();
    });
  }

  get icon(): string {
    if (this.type === 'success') {
      return '✓';
    }

    if (this.type === 'error') {
      return '!';
    }

    return 'i';
  }

  get ariaLive(): 'polite' | 'assertive' {
    return this.type === 'error' ? 'assertive' : 'polite';
  }

  runAction(action: FeedbackAction): void {
    action.onClick?.();
  }
}
