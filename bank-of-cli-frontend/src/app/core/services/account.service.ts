import { Injectable } from '@angular/core';
import { Account } from '../models/account';

@Injectable({ providedIn: 'root' })
export class AccountService {
  getAccountForUser(userId: string): Promise<Account> {
    // Mocked account
    return Promise.resolve({ id: 'a1', userId, balance: 1250.75, currency: 'USD' });
  }
}
