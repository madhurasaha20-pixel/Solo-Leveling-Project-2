import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formatMoney } from '../pipes/money.pipe';

/**
 * Amount validator for the Transaction Center.
 * Accepts strings like "120", "120.5", "120.50". `available` is read at validation time
 * so withdrawals/transfers can't exceed the current balance.
 */
export function amountValidator(opts: { max?: number; available?: () => number | undefined } = {}): ValidatorFn {
  const max = opts.max ?? 10_000;
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (raw === '') return { amount: 'Enter an amount.' };
    if (!/^\d+(\.\d{1,2})?$/.test(raw)) return { amount: 'Use numbers only, with up to two decimals.' };
    const n = Number(raw);
    if (n <= 0) return { amount: 'Amount must be greater than $0.00.' };
    if (n > max) return { amount: `The limit is ${formatMoney(max)} per transaction.` };
    const available = opts.available?.();
    if (available !== undefined && n > available) {
      return { amount: `That's more than the ${formatMoney(available)} available.` };
    }
    return null;
  };
}

/** Group validator: transfer source and destination must differ. */
export function differentAccountsValidator(fromKey: string, toKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromKey)?.value;
    const to = group.get(toKey)?.value;
    return from && to && from === to ? { sameAccount: 'Choose a different account.' } : null;
  };
}
