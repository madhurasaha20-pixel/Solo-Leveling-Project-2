import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionItemComponent } from './components/transaction-item/transaction-item.component';

@NgModule({
  declarations: [TransactionItemComponent],
  imports: [CommonModule],
  exports: [TransactionItemComponent]
})
export class UiModule {}

