import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { ApiError } from '../../core/models';
import { AccountService } from '../../core/services/account.service';
import { PageShellComponent } from '../page-shell.component';
import { BalanceCardComponent } from './balance-card.component';

/**
 * Dashboard page. Pages call services; the cards below only receive data.
 * Layout: 3 columns on large screens. The balance card takes 1; the
 * transaction history card should go next to it with class="lg:col-span-2".
 */
@Component({
  selector: 'app-dashboard',
  imports: [PageShellComponent, BalanceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell />
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <app-balance-card [account]="account()" [updatedAt]="updatedAt()" [error]="error()" (retry)="refresh()" />
      <!-- Transaction history card goes here: <app-... class="lg:col-span-2" /> -->
    </div>
  `,
})
export class DashboardComponent {
  private readonly accounts = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);

  /** Cached account; updates by itself after every deposit, withdraw or transfer. */
  protected readonly account = toSignal(this.accounts.account$, { initialValue: null });
  /** Time the balance last changed or was re-fetched; shown as "as of 12:31 PM". */
  protected readonly updatedAt = toSignal(
    this.accounts.account$.pipe(filter(a => a !== null), map(() => new Date())),
    { initialValue: null },
  );
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  /** Re-fetch so the balance is current whenever the dashboard opens. A cached balance stays visible meanwhile. */
  protected refresh(): void {
    this.error.set(null);
    this.accounts
      .loadMyAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (err: ApiError) => this.error.set(err.message) });
  }
}
