import { Pipe, PipeTransform } from '@angular/core';

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Formats money the one allowed way: $1,234.56, true minus sign, optional +. */
export function formatMoney(value: number, signed = false): string {
  const abs = USD.format(Math.abs(value));
  if (value < 0) return `−${abs}`;
  return signed ? `+${abs}` : abs;
}

/** {{ 1234.5 | money }} → $1,234.50   ·   {{ -84.2 | money: true }} → −$84.20 */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, signed = false): string {
    return value == null ? '' : formatMoney(value, signed);
  }
}
