import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
