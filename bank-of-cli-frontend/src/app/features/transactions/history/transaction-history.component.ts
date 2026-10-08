import { Component } from '@angular/core';
import { Transaction } from '../../../core/models/transaction';
import { TransactionItemComponent } from '../../../shared/components/transaction-item/transaction-item.component';

@Component({
    selector: 'app-transaction-history',
    standalone: true,
    imports: [TransactionItemComponent],
    templateUrl: './transaction-history.component.html',
    // styleUrls: ['./transaction-history.component.css']
})

export class TransactionHistoryComponent {
    accountId = '000123456789';

    private allTransactions: Transaction[] = [
        {
            id: '1',
            accountId: this.accountId,
            type: 'deposit',
            amount: 1500,
            balanceAfter: 1500,
            date: '2026-10-01',
            description: 'DEPOSIT'
        },
        {
            id: '2',
            accountId: this.accountId,
            type: 'withdraw',
            amount: 200,
            balanceAfter: 1300,
            date: '2026-10-05',
            description: 'WITHDRAW'
        },
        {
            id: '3',
            accountId: this.accountId,
            type: 'transfer-out',
            amount: 20.62,
            balanceAfter: 1279.38,
            date: '2026-10-07',
            description: 'TRANSFER to CHECKING ********3210',
            counterpartyAccountId: 'ACC-1002'
        }
    ];

    get transactions(): Transaction[] {
        return this.allTransactions.filter(t => t.accountId === this.accountId);
    }
}