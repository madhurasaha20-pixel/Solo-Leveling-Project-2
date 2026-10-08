import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { TransactionService } from './transaction.service';

type TransactionAction = 'deposit' | 'withdraw' | 'transfer';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.components.html',
})
export class TransactionsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transactionsService = inject(TransactionService);
  private readonly accountService = inject(AccountService);

  protected readonly accounts = computed(() => this.accountService.accounts);


  protected readonly transactionTypes: TransactionAction[] = ['deposit', 'withdraw', 'transfer'];
  protected readonly selectedType = signal<TransactionAction>('deposit');
  protected readonly submitted = signal(false);
  protected readonly successMessage = signal('');
  protected readonly loading = signal(false);
  protected readonly selectedAccountId = signal<string | null>(null);

  protected setAccount(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.successMessage.set('');
  }

  protected readonly form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: [''],
    toAccountId: [''],
  });

  protected readonly helpText = computed(() => {
    switch (this.selectedType()) {
      case 'deposit':
        return 'Add funds to your account in a single step.';
      case 'withdraw':
        return 'Move money out of your account without leaving any blank fields.';
      case 'transfer':
        return 'Send money to another account using a valid destination account number.';
      default:
        return '';
    }
  });

  protected setTransactionType(type: TransactionAction): void {
    this.selectedType.set(type);
    this.successMessage.set('');

    if (type === 'transfer') {
      this.form.controls.toAccountId.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      this.form.controls.toAccountId.clearValidators();
    }

    this.form.controls.toAccountId.updateValueAndValidity();
  }

  protected isFieldInvalid(controlName: 'amount' | 'toAccountId'): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.selectedType() === 'transfer') {
      this.form.controls.toAccountId.setValidators([Validators.required, Validators.minLength(3)]);
      this.form.controls.toAccountId.updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    //const accountId = this.accountService.account?.id ?? 'ACC-1001';
    const accountId = this.selectedAccountId();

    if (!accountId) {
      this.successMessage.set('Please select an account.');
      return;
    }
    const amount = Number(this.form.value.amount);
    const description = this.form.value.description?.trim() ?? '';

    const request = {
      amount,
      description,
      toAccountId: this.form.value.toAccountId ?? '',
    };

    const action = this.selectedType();

    let call$;
    if (action === 'deposit') {
      call$ = this.transactionsService.deposit(accountId, { amount, description });
    } else if (action === 'withdraw') {
      call$ = this.transactionsService.withdraw(accountId, { amount, description });
    } else {
      call$ = this.transactionsService.transfer(accountId, {
        toAccountId: request.toAccountId,
        amount,
        description,
      });
    }

    this.loading.set(true);

    call$.subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(`${action.charAt(0).toUpperCase() + action.slice(1)} of $${amount.toFixed(2)} submitted successfully.`);
        this.form.reset({ amount: null, description: '', toAccountId: '' });
        this.form.markAsPristine();
        this.submitted.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.successMessage.set(err?.message ?? 'Transaction could not be processed.');
      },
    });
  }
}
