import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html'
})

export class TransactionItemComponent {
    @Input() origin = '';
    @Input() amount = 0;
}