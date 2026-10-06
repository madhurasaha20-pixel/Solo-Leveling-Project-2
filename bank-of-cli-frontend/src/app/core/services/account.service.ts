import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Account } from '../models';
import { toApiError } from './api-error.util';
import { AuthService } from './auth.service';

/**
 * The logged-in user's account and balance.
 *
 * Usage (Balance card):
 *   account$ = this.accounts.account$;            // template: (account$ | async)?.balance
 *   ngOnInit() { this.accounts.loadMyAccount().subscribe({ error: e => ... }); }
 *
 * account$ updates automatically after every deposit/withdraw/transfer,
 * so the Balance card never has to reload by hand.
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private api = environment.apiBase;

  private accountSubject = new BehaviorSubject<Account | null>(null);

  /** Current account, or null before loading / after logout. */
  readonly account$: Observable<Account | null> = this.accountSubject.asObservable();

  constructor() {
    inject(AuthService).currentUser$.subscribe(user => {
      if (!user) this.accountSubject.next(null);
    });
  }

  get account(): Account | null {
    return this.accountSubject.value;
  }

  /** GET /accounts/me. Errors: UNAUTHORIZED, ACCOUNT_NOT_FOUND */
  loadMyAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.api}/accounts/me`).pipe(
      tap(account => this.accountSubject.next(account)),
      catchError(err => throwError(() => toApiError(err)))
    );
  }

  /** Called by TransactionService after a successful transaction. Components don't need this. */
  updateCachedAccount(account: Account): void {
    this.accountSubject.next(account);
  }
}
