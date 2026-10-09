import { Injectable, inject, signal } from '@angular/core';

import { AuthService } from './auth.service';

/**
 * Whether the balance is hidden. Shared, so the Hide button on the dashboard
 * and the one in the account menu always agree.
 *
 */
@Injectable({ providedIn: 'root' })
export class BalanceVisibilityService {
  private readonly hiddenState = signal(false);

  /** True while the balance is hidden everywhere. */
  readonly hidden = this.hiddenState.asReadonly();

  constructor() {
    // Start every session with the balance visible.
    inject(AuthService).currentUser$.subscribe(user => {
      if (!user) this.hiddenState.set(false);
    });
  }

  toggle(): void {
    this.hiddenState.update(hidden => !hidden);
  }
}