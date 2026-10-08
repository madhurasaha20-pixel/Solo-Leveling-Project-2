import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Transaction } from '../../../core/models/transaction';

@Component({
    selector: 'app-transaction-item',
    standalone: true,
    imports: [CurrencyPipe, DatePipe, TitleCasePipe],
    templateUrl: './transaction-item.component.html'
})

export class TransactionItemComponent {
    @Input() origin = '';
    @Input() amount = 0;
    @Input() date = '';
    @Input() type: Transaction['type'] = 'deposit';

    get isCredit(): boolean {
        return this.type === 'deposit' || this.type === 'transfer-in';
    }
}