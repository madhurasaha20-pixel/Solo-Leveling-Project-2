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

  //private accountSubject = new BehaviorSubject<Account | null>(null);
  //adjusted to support multiple accounts
  private accountsSubject = new BehaviorSubject<Account[]>([]);

  /** Current account, or null before loading / after logout. */
  //readonly account$: Observable<Account | null> = this.accountSubject.asObservable();
  //adjusted to handle multiple accounts
  readonly accounts$: Observable<Account[]> =
  this.accountsSubject.asObservable();

  /*
  constructor() {
    inject(AuthService).currentUser$.subscribe(user => {
      if (!user) this.accountSubject.next(null);
    });
  }
    */
//adjusted to handle multiple accounts
  constructor() {
  inject(AuthService).currentUser$.subscribe(user => {
    if (!user) this.accountsSubject.next([]);
  });
}

  /*
  get account(): Account | null {
    return this.accountSubject.value;
  }
*/
//adjusted to handle multiple accounts
get accounts(): Account[] {
  return this.accountsSubject.value;
}
  /** GET /accounts/me. Errors: UNAUTHORIZED, ACCOUNT_NOT_FOUND */
  /*
  loadMyAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.api}/accounts/me`).pipe(
      tap(account => this.accountSubject.next(account)),
      catchError(err => throwError(() => toApiError(err)))
    );
  }
*/
//adjusted to handle multiple accounts
loadMyAccounts(): Observable<Account[]> {
  return this.http.get<Account[]>(`${this.api}/accounts/me`).pipe(
    tap(accounts => this.accountsSubject.next(accounts)),
    catchError(err => throwError(() => toApiError(err)))
  );
}


  /** Called by TransactionService after a successful transaction. Components don't need this. */
  /*
  updateCachedAccount(account: Account): void {
    this.accountSubject.next(account);
  }
}
*/
//adjusted to handle multiple accounts
  updateCachedAccount(updatedAccount: Account): void {
    const accounts = this.accountsSubject.value.map(account =>
      account.id === updatedAccount.id ? updatedAccount : account
    );
  
    this.accountsSubject.next(accounts);
  }

  
/** POST /accounts. Creates a new checking or savings account. */
createAccount(
  userId: string,
  type: 'checking' | 'savings'
): Observable<Account> {
  return this.http.post<Account>(`${this.api}/accounts`, {
    userId,
    type
  }).pipe(
    tap(newAccount => {
      this.accountsSubject.next([
        ...this.accountsSubject.value,
        newAccount
      ]);
    }),
    catchError(err => throwError(() => toApiError(err)))
  );
}
}