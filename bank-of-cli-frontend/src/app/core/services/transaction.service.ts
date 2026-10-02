import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  listRecent(accountId: string): Promise<Transaction[]> {
    // Mocked transactions
    return Promise.resolve([
      { id: 't1', accountId, type: 'deposit', amount: 200, date: new Date().toISOString(), description: 'Paycheck' },
      { id: 't2', accountId, type: 'withdraw', amount: 50, date: new Date().toISOString(), description: 'ATM' }
    ]);
  }
}
