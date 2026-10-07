import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  DepositRequest,
  Transaction,
  TransactionResponse,
  TransferRequest,
  WithdrawRequest
} from '../models';
import { toApiError } from './api-error.util';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

/**
 * Transaction history plus deposit / withdraw / transfer.
 *
 * Usage (Transaction History card):
 *   recent$ = this.transactions.recent$;   // newest first
 *   ngOnInit() { this.transactions.loadRecent(accountId).subscribe(); }
 *
 * Usage (forms):
 *   this.loading = true;
 *   this.transactions.withdraw(accountId, { amount: 50 }).subscribe({
 *     next: res => { this.loading = false; this.toast.success(`New balance $${res.account.balance}`); },
 *     error: (err: ApiError) => { this.loading = false; this.toast.error(err.message); }
 *   });
 *
 * After any successful transaction, recent$ and AccountService.account$
 * both update on their own, so the dashboard cards refresh automatically.
 */
@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private accounts = inject(AccountService);
  private api = environment.apiBase;

  private recentSubject = new BehaviorSubject<Transaction[]>([]);
  private recentLimit = 10;

  /** Most recent transactions for the current account, newest first. */
  readonly recent$: Observable<Transaction[]> = this.recentSubject.asObservable();

  constructor() {
    inject(AuthService).currentUser$.subscribe(user => {
      if (!user) this.recentSubject.next([]);
    });
  }

  /** GET /accounts/{id}/transactions?limit=N. Errors: UNAUTHORIZED, FORBIDDEN, ACCOUNT_NOT_FOUND */
  loadRecent(accountId: string, limit = 10): Observable<Transaction[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http
      .get<Transaction[]>(`${this.api}/accounts/${encodeURIComponent(accountId)}/transactions`, { params })
      .pipe(
        tap(list => {
          this.recentLimit = limit; // only remember the page size when the load worked
          this.recentSubject.next(list);
        }),
        catchError(err => throwError(() => toApiError(err)))
      );
  }

  /** Errors: VALIDATION_ERROR */
  deposit(accountId: string, req: DepositRequest): Observable<TransactionResponse> {
    return this.post(accountId, 'deposit', req);
  }

  /** Errors: VALIDATION_ERROR, INSUFFICIENT_FUNDS */
  withdraw(accountId: string, req: WithdrawRequest): Observable<TransactionResponse> {
    return this.post(accountId, 'withdraw', req);
  }

  /** Errors: VALIDATION_ERROR, ACCOUNT_NOT_FOUND (bad toAccountId), INSUFFICIENT_FUNDS */
  transfer(accountId: string, req: TransferRequest): Observable<TransactionResponse> {
    return this.post(accountId, 'transfer', req);
  }

  private post(
    accountId: string,
    action: 'deposit' | 'withdraw' | 'transfer',
    body: DepositRequest | WithdrawRequest | TransferRequest
  ): Observable<TransactionResponse> {
    return this.http
      .post<TransactionResponse>(`${this.api}/accounts/${encodeURIComponent(accountId)}/${action}`, body)
      .pipe(
        tap(res => {
          this.accounts.updateCachedAccount(res.account);
          this.recentSubject.next([res.transaction, ...this.recentSubject.value].slice(0, this.recentLimit));
        }),
        catchError(err => throwError(() => toApiError(err)))
      );
  }
}
