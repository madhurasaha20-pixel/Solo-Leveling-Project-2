import { Component } from '@angular/core';
import { Transaction } from '../../../core/models/transaction';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html'
})

export class TransactionHistoryComponent {
    accountId = '000123456789';

    private allTransactions: Transaction[] = [
        {
            id: '1',
            accountId: this.accountId,
            type: 'deposit',
            amount: 1500,
            date: '2026-10-01',
            description: 'DEPOSIT'
        },
        {
            id: '2',
            accountId: this.accountId,
            type: 'withdraw',
            amount: 200,
            date: '2026-10-05',
            description: 'WITHDRAW'
        },
        {
            id: '3',
            accountId: this.accountId,
            type: 'transfer',
            amount: 20.62,
            date: '2026-10-10',
            description: 'TRANSFER to CHECKING ********3210'
        }
    ];

    get transactions(): Transaction[] {
        return this.allTransactions;
    }
}