import { Injectable } from '@angular/core';
import { Account, Transaction, User } from '../models';

import seedUsers from '../../../assets/mock-data/users.json';
import seedAccounts from '../../../assets/mock-data/accounts.json';
import seedTransactions from '../../../assets/mock-data/transactions.json';

/** A user row in the fake database. Includes the password, which the API never returns. */
export interface UserRecord extends User {
  password: string;
}

interface DbState {
  users: UserRecord[];
  accounts: Account[];
  transactions: Transaction[];
  nextId: number;
}

const STORAGE_KEY = 'boc.mockDb';

/**
 * In-memory "database" behind the mock backend.
 * Seeded from src/assets/mock-data/*.json and saved to sessionStorage,
 * so deposits and new users survive a page refresh (but not closing the tab).
 *
 * ONLY the mock backend interceptor should use this.
 * Components and services must never import it.
 */
@Injectable({ providedIn: 'root' })
export class MockDb {
  private state: DbState = this.load();

  get users(): UserRecord[] { return this.state.users; }
  get accounts(): Account[] { return this.state.accounts; }
  get transactions(): Transaction[] { return this.state.transactions; }

  /**
   * Returns a new id like "u1000", "t1001" or "ACC-1002" that is not already
   * used by any user, account or transaction (including the seed data).
   */
  newId(prefix: string): string {
    const taken = new Set<string>([
      ...this.state.users.map(u => u.id),
      ...this.state.accounts.map(a => a.id),
      ...this.state.transactions.map(t => t.id)
    ]);
    let id: string;
    do {
      id = `${prefix}${this.state.nextId++}`;
    } while (taken.has(id));
    return id;
  }

  save(): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // storage unavailable; data just won't survive a refresh
    }
  }

  /** Throw away all changes and go back to the seed JSON. Useful during demos. */
  reset(): void {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    this.state = MockDb.seed();
  }

  private load(): DbState {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as DbState;
    } catch {
      // fall through to seed data
    }
    return MockDb.seed();
  }

  private static seed(): DbState {
    // structuredClone so mutations never touch the imported JSON modules
    return structuredClone({
      users: seedUsers as UserRecord[],
      accounts: seedAccounts as Account[],
      transactions: seedTransactions as Transaction[],
      nextId: 1000
    });
  }
}
