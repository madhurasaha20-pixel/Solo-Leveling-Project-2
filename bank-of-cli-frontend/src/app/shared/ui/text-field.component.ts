import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from './icon.component';

let nextId = 0;

/** Classes shared by TextField and Select so the two always match. */
export const FIELD_BOX =
  'flex h-10 items-center rounded-md border bg-surface-raised px-3 transition-colors duration-[120ms] ' +
  'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus';

/**
 * Labelled input that works with reactive forms.
 *   <bc-text-field label="Amount" type="amount" formControlName="amount"
 *                  [hint]="'Available: ' + (balance() | money)" [error]="amountError()" />
 */
@Component({
  selector: 'bc-text-field',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextFieldComponent), multi: true }],
  host: { class: 'block' },
  template: `
    <div class="flex flex-col gap-2">
      <label [for]="inputId" class="text-label font-medium text-ink">{{ label() }}</label>
      <div [class]="boxClass()">
        @if (isAmount()) {
          <span aria-hidden="true" class="mr-2 font-mono text-ink-muted">$</span>
        }
        <input
          [id]="inputId"
          [type]="isAmount() ? 'text' : type()"
          [attr.inputmode]="isAmount() ? 'decimal' : null"
          [attr.autocomplete]="autocomplete()"
          [placeholder]="placeholder()"
          [value]="value()"
          [disabled]="isDisabled()"
          [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-describedby]="describedBy()"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed disabled:text-ink-muted"
          [class.font-mono]="isAmount()"
          [class.tabular-nums]="isAmount()"
        />
      </div>
      @if (error()) {
        <p [id]="inputId + '-err'" role="alert" class="flex gap-1 text-body-sm text-debit">
          <span class="flex h-5 items-center"><bc-icon name="alert" [size]="16" /></span>{{ error() }}
        </p>
      } @else if (hint()) {
        <p [id]="inputId + '-hint'" class="text-body-sm text-ink-muted">{{ hint() }}</p>
      }
    </div>
  `,
})
export class TextFieldComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  /** "amount" adds a $ prefix, mono digits and the decimal keypad. */
  readonly type = input<'text' | 'email' | 'password' | 'amount'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);
  readonly hint = input<string | null>(null);
  /** Pass the message to show; null hides it. Use fieldError() from the validators file. */
  readonly error = input<string | null>(null);

  protected readonly inputId = `bc-field-${++nextId}`;
  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly isAmount = computed(() => this.type() === 'amount');
  protected readonly describedBy = computed(() =>
    this.error() ? `${this.inputId}-err` : this.hint() ? `${this.inputId}-hint` : null,
  );
  protected readonly boxClass = computed(() =>
    [
      FIELD_BOX,
      this.error() ? 'border-debit' : 'border-border-strong',
      this.isDisabled() ? 'bg-surface-sunken' : '',
    ].join(' '),
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: unknown): void { this.value.set(v == null ? '' : String(v)); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }
}
