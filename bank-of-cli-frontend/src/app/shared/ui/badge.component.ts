import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'credit' | 'debit' | 'pending';
const BADGE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-ink-muted',
  credit: 'bg-credit-tint text-credit',
  debit: 'bg-debit-tint text-debit',
  pending: 'bg-pending-tint text-pending',
};

/** Always a word ("Deposit", "Pending") — never an icon or emoji alone. */
@Component({
  selector: 'bc-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'cls()' },
  template: `<ng-content />`,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
  protected readonly cls = computed(
    () => `inline-flex items-center gap-1 rounded-sm px-2 py-1 text-label font-medium ${BADGE[this.tone()]}`,
  );
}
