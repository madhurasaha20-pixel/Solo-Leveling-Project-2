import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { TransactionService } from './transaction.service';
import { Account } from '../../core/models';

type TransactionAction = 'deposit' | 'withdraw' | 'transfer';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './transactions.components.html',
})
export class TransactionsComponent {
    private readonly fb = inject(FormBuilder);
    private readonly transactionsService = inject(TransactionService);
    private readonly accountService = inject(AccountService);
    //protected readonly accounts$ = this.accountService.accounts$;
    protected readonly accountList = signal<Account[]>([]);
    protected readonly currentAccount = signal(this.accountService.account);

    constructor() {
        this.accountService.loadMyAccounts().subscribe({
            next: (accounts) => {
                this.accountList.set(accounts);

                const current = accounts.find(a => a.type === 'checking') ?? accounts[0] ?? null;
                this.currentAccount.set(current);

                if (current) {
                    this.accountService.updateCachedAccount(current);
                    this.form.controls.fromAccountId.setValue(current.id);
                }
            },
            error: (err) => {
                this.toastMessage.set(err?.message ?? 'Could not load your accounts.');
                this.toastType.set('error');
            }
        });
    }

    protected readonly transactionTypes: TransactionAction[] = ['deposit', 'withdraw', 'transfer'];
    protected readonly selectedType = signal<TransactionAction>('deposit');
    protected readonly submitted = signal(false);
    //protected readonly successMessage = signal('');
    //protected readonly errorMessage = signal('');
    protected readonly toastMessage = signal('');
    protected readonly toastType = signal<'success' | 'error'>('success');
    protected readonly loading = signal(false);

    protected readonly form = this.fb.group({
        fromAccountId: [''],
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
        //this.successMessage.set('');
        //this.errorMessage.set('');

        if (type === 'transfer') {
            this.form.controls.toAccountId.setValidators([Validators.required, Validators.minLength(3)]);
        } else {
            this.form.controls.toAccountId.clearValidators();
        }

        this.form.controls.toAccountId.updateValueAndValidity();

    }

    protected onSourceAccountChange(accountId: string): void {
        const account = this.accountList().find(a => a.id === accountId);

        this.currentAccount.set(account ?? null);

        if (account) {
            this.accountService.updateCachedAccount(account);
        }
    }

    protected isFieldInvalid(controlName: 'amount' | 'toAccountId'): boolean {
        const control = this.form.get(controlName);
        return !!control && control.invalid && (control.touched || this.submitted());
    }

    protected submit(): void {
        this.submitted.set(true);
        //this.successMessage.set('');
        this.form.markAllAsTouched();

        if (this.selectedType() === 'transfer') {
            this.form.controls.toAccountId.setValidators([Validators.required, Validators.minLength(3)]);
            this.form.controls.toAccountId.updateValueAndValidity();
        }

        if (this.form.invalid) {
            return;
        }

        const accountId = this.form.value.fromAccountId;

        if (!accountId) {
            this.toastMessage.set('Please select a source account.');
            this.toastType.set('error');
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
            next: (response) => {
                this.loading.set(false);
                //this.errorMessage.set('');
                /*this.successMessage.set(
                    `${action.charAt(0).toUpperCase() + action.slice(1)} of $${amount.toFixed(2)} submitted successfully. Your new balance is $${response.account.balance.toFixed(2)}.`
                );*/
                this.toastMessage.set(
                    `${action.charAt(0).toUpperCase() + action.slice(1)} of $${amount.toFixed(2)} submitted successfully. Your new balance is $${response.account.balance.toFixed(2)}.`
                );
                this.toastType.set('success');
                this.form.reset({ amount: null, description: '', toAccountId: '' });
                this.form.markAsPristine();
                this.submitted.set(false);
            },
            error: (err) => {
                this.loading.set(false);

                const message = err?.message ?? 'Transaction could not be processed.';

                //this.errorMessage.set(message);
                this.toastMessage.set(message);
                this.toastType.set('error');
            },
        });
    }
}
