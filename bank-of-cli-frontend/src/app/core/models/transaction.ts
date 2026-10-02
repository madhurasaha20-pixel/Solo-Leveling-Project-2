export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  date: string; // ISO
  description?: string;
}
