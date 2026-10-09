import { Component, input } from '@angular/core';
import { TransactionHistoryComponent } from '../transaction-history.component';

@Component({
  imports: [],
  selector: 'transaction-summary',
  //styleUrl: './transaction-summary.css',
  templateUrl: './transaction-summary.html',
})
export class TransactionSummary {
  readonly numberOfTransactions = input<number>(0);
}
