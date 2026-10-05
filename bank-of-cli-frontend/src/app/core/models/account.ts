/**
 * A bank account. Each user has one checking account.
 * `id` is the public account number, so it is also what a user types
 * into the Transfer form as the destination.
 * See core/contracts/CONTRACTS.md.
 */
export interface Account {
  id: string;       // e.g. "ACC-1001"
  userId: string;
  type: 'checking';
  balance: number;  // dollars, max 2 decimal places
  currency: 'USD';
}
