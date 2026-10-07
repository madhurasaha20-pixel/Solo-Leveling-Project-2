import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent, IconName } from './icon.component';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';
const ALERT: Record<AlertTone, { box: string; icon: string; name: IconName }> = {
  info: { box: 'bg-brand-tint', icon: 'text-brand', name: 'info' },
  success: { box: 'bg-credit-tint', icon: 'text-credit', name: 'check-circle' },
  warning: { box: 'bg-pending-tint', icon: 'text-pending', name: 'alert' },
  error: { box: 'bg-debit-tint', icon: 'text-debit', name: 'alert' },
};

/** Inline, persistent message — e.g. invalid credentials above the sign-in form. */
@Component({
  selector: 'bc-alert',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div [attr.role]="tone() === 'error' ? 'alert' : 'status'"
         class="flex gap-3 rounded-md px-4 py-3 text-body-sm text-ink" [class]="style().box">
      <bc-icon [name]="style().name" [class]="style().icon" />
      <div>
        @if (title()) { <strong class="block font-semibold">{{ title() }}</strong> }
        <ng-content />
      </div>
    </div>
  `,
})
export class AlertComponent {
  readonly tone = input<AlertTone>('info');
  readonly title = input<string | null>(null);
  protected readonly style = computed(() => ALERT[this.tone()]);
}
