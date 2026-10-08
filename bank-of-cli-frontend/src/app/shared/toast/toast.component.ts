import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visibleMessage()) {
     <div
        class="fixed bottom-20 right-6 z-50 rounded-md border px-4 py-3 text-body-sm shadow-overlay animate-toast-in"
        [class.border-brand/30]="type() === 'success'"
        [class.bg-brand-tint]="type() === 'success'"
        [class.text-brand]="type() === 'success'"
        [class.border-debit/30]="type() === 'error'"
        [class.bg-debit-tint]="type() === 'error'"
        [class.text-debit]="type() === 'error'"
        role="alert"
    >
        {{ visibleMessage() }}
    </div>
    }
  `,
})
export class ToastComponent implements OnDestroy {
  readonly message = input('');
  readonly type = input<'success' | 'error'>('success');
  readonly visibleMessage = signal('');

  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const message = this.message();

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.visibleMessage.set(message);

      if (message) {
        this.timeoutId = setTimeout(() => {
          this.visibleMessage.set('');
        }, 4000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}