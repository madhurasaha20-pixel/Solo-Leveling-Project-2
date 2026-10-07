import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { IconComponent, IconName } from './icon.component';

/* ---------------------------------------------------------------- Card */

/**
 * The one container. Title renders as heading-2; put a small ghost button in [cardAction].
 *   <bc-card title="Recent transactions" flush>
 *     <bc-button cardAction variant="ghost" size="sm">View all</bc-button>
 *     <bc-transaction-list … />
 *   </bc-card>
 */
@Component({
  selector: 'bc-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-md border border-border bg-surface-raised shadow-raised' },
  template: `
    <section [class]="flush() ? '' : 'p-4 sm:p-6'">
      @if (title()) {
        <div class="mb-4 flex items-center justify-between gap-4" [class]="flush() ? 'px-4 pt-4 sm:px-6 sm:pt-6' : ''">
          <h2 class="text-heading-2 font-semibold text-ink">{{ title() }}</h2>
          <ng-content select="[cardAction]" />
        </div>
      }
      <ng-content />
    </section>
  `,
})
export class CardComponent {
  readonly title = input<string | null>(null);
  /** No padding, so lists run edge to edge. */
  readonly flush = input(false, { transform: (v: boolean | string) => v !== false });
}

/* ---------------------------------------------------------------- Badge */

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

/* ---------------------------------------------------------------- Alert */

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

/* ---------------------------------------------------------------- Tabs */

export interface TabItem { id: string; label: string; }

/**
 * Segmented switch between sibling views. Two-way bound:
 *   <bc-tabs label="Transaction type" [tabs]="tabs" [(value)]="mode" panelId="txn-panel" />
 */
@Component({
  selector: 'bc-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div role="tablist" [attr.aria-label]="label()" class="flex gap-1 rounded-md bg-surface-sunken p-1">
      @for (t of tabs(); track t.id; let i = $index) {
        <button
          type="button"
          role="tab"
          [id]="'tab-' + t.id"
          [attr.aria-selected]="t.id === value()"
          [attr.aria-controls]="panelId()"
          [tabIndex]="t.id === value() ? 0 : -1"
          (click)="value.set(t.id)"
          (keydown)="onKey($event, i)"
          class="h-8 flex-1 cursor-pointer rounded-sm text-label font-medium transition-colors duration-[120ms]"
          [class]="t.id === value() ? 'bg-surface-raised text-ink shadow-raised' : 'text-ink-muted hover:text-ink'"
        >{{ t.label }}</button>
      }
    </div>
  `,
})
export class TabsComponent {
  readonly tabs = input.required<TabItem[]>();
  readonly label = input.required<string>();
  readonly panelId = input<string | null>(null);
  readonly value = model.required<string>();

  protected onKey(e: KeyboardEvent, i: number): void {
    const n = this.tabs().length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : -1;
    if (j < 0) return;
    e.preventDefault();
    this.value.set(this.tabs()[j].id);
    const buttons = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]');
    buttons?.[j]?.focus();
  }
}

/* ---------------------------------------------------------------- Skeleton */

/** Placeholder shaped like the content it replaces. Heights: 16 body, 12 meta, 36 balance. */
@Component({
  selector: 'bc-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class:
      'relative block overflow-hidden rounded-sm bg-surface-sunken ' +
      'after:absolute after:inset-0 after:animate-shimmer after:bg-linear-to-r after:from-transparent ' +
      'after:via-surface-raised after:to-transparent after:opacity-60 motion-reduce:after:hidden',
    '[style.width]': 'width()',
    '[style.height.px]': 'height()',
  },
  template: ``,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input(16);
}
