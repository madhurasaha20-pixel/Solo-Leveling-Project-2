import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { ApiError } from '../../core/models';
import { AccountService } from '../../core/services/account.service';
import { PageShellComponent } from '../page-shell.component';
import { BalanceCardComponent } from './balance-card.component';
import { AuthService } from '../../core/services/auth.service';

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

      @for (account of accounts(); track account.id) {
        <app-balance-card
          [account]="account"
          [updatedAt]="updatedAt()"
          [error]="error()"
          (retry)="refresh()"
        />
      }

      <!-- Add Account button -->
      <button
         type="button"
         (click)="showAddAccount.set(true)"
         class="rounded-xl border border-dashed border-border
                bg-surface-raised p-6 text-body font-medium
                text-ink transition-colors hover:bg-surface-sunken"
            >
        + Add Account
      </button>

      <!-- Transaction history card goes here: <app-... class="lg:col-span-2" /> -->

    </div>
    @if (showAddAccount()) {
  <div class="fixed inset-0 z-50 flex items-center
              justify-center bg-black/50 p-4">

    <div
      class="w-full max-w-md rounded-xl border
             border-border bg-surface-raised p-6 shadow-raised"
    >
      <h2 class="text-heading-2 font-semibold text-ink">
        Add an Account
      </h2>

      <p class="mt-2 text-body-sm text-ink-muted">
        Choose the type of account you want to open.
      </p>

      <div class="mt-5 grid gap-3">
  <button
    type="button"
    (click)="selectedAccountType.set('checking')"
    class="rounded-md border p-4 text-left"
    [class.border-brand]="selectedAccountType() === 'checking'"
    [class.bg-brand-tint]="selectedAccountType() === 'checking'"
    [class.border-border]="selectedAccountType() !== 'checking'"
  >
    <span class="block font-medium text-ink">
      Checking Account
    </span>
    <span class="mt-1 block text-body-sm text-ink-muted">
      For everyday purchases and payments.
    </span>
  </button>

  <button
    type="button"
    (click)="selectedAccountType.set('savings')"
    class="rounded-md border p-4 text-left"
    [class.border-brand]="selectedAccountType() === 'savings'"
    [class.bg-brand-tint]="selectedAccountType() === 'savings'"
    [class.border-border]="selectedAccountType() !== 'savings'"
  >
    <span class="block font-medium text-ink">
      Savings Account
    </span>
    <span class="mt-1 block text-body-sm text-ink-muted">
      For setting aside money for the future.
    </span>
  </button>
</div>

      <div class="mt-6 flex justify-end gap-3">
        <button
            type="button"
            (click)="createAccount()"
            (click)="showAddAccount.set(false)"
            class="rounded-md bg-brand px-4 py-2
                   font-medium text-on-brand"
            >
            Continue
        </button>
        <button
          type="button"
          (click)="showAddAccount.set(false)"
          class="rounded-md border border-border px-4 py-2
                 text-body font-medium text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
}
  `,
})

export class DashboardComponent {
  //private readonly account = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly showAddAccount = signal(false);
  protected readonly selectedAccountType =
  signal<'checking' | 'savings'>('checking');

  protected createAccount(): void {
  const type = this.selectedAccountType();
  const userId = this.authService.currentUser?.id;

  if (!userId) {
    this.error.set('You must be logged in to create an account.');
    return;
  }

  this.accountService.createAccount(userId, type).subscribe({
    next: (account) => {
      console.log('Account created successfully:', account);
      this.showAddAccount.set(false);
    },
    error: (err: ApiError) => {
      console.error('Account creation failed:', err);
      this.error.set(err.message);
    }
  });
}

  /** Cached account; updates by itself after every deposit, withdraw or transfer. */
  //protected readonly account = toSignal(this.accounts.account$, { initialValue: null });
  //updated to deal with multiple accounts
  protected readonly accounts = toSignal(
  this.accountService.accounts$,
  { initialValue: [] }
);
  /** Time the balance last changed or was re-fetched; shown as "as of 12:31 PM". */
  /*
  protected readonly updatedAt = toSignal(
    this.accounts.account$.pipe(filter(a => a !== null), map(() => new Date())),
    { initialValue: null },
  );
  */
 //added to account for multiple accounts
 protected readonly updatedAt = toSignal(
  this.accountService.accounts$.pipe(
    filter(accounts => accounts.length > 0),
    map(() => new Date())
  ),
  { initialValue: null },
);
 
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  /** Re-fetch so the balance is current whenever the dashboard opens. A cached balance stays visible meanwhile. */
  protected refresh(): void {
    this.error.set(null);
    this.accountService
      .loadMyAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (err: ApiError) => this.error.set(err.message) });
  }
}
