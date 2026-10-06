import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BASE =
  'relative inline-flex items-center justify-center gap-2 rounded-md border font-medium whitespace-nowrap ' +
  'transition-colors duration-[120ms] ease-out cursor-pointer disabled:cursor-not-allowed ' +
  'disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand text-on-brand enabled:hover:bg-brand-hover',
  secondary: 'border-border-strong bg-surface-raised text-ink enabled:hover:bg-surface-sunken',
  ghost: 'border-transparent bg-transparent text-brand enabled:hover:bg-brand-tint',
  danger: 'border-transparent bg-debit text-on-debit',
};

const SIZES = {
  md: 'h-10 px-4 text-body',
  sm: 'h-10 px-3 text-label md:h-8',
};

/**
 * The only button in the app.
 *   <bc-button (click)="save()">Save</bc-button>
 *   <bc-button type="submit" [loading]="saving()" fullWidth>Deposit {{ amount | money }}</bc-button>
 */
@Component({
  selector: 'bc-button',
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.flex]': 'fullWidth()',
    '[class.inline-flex]': '!fullWidth()',
  },
  template: `
    <button [type]="type()" [class]="classes()" [disabled]="disabled() || loading()"
            [attr.aria-busy]="loading() ? 'true' : null">
      <span class="inline-flex items-center gap-2" [class.invisible]="loading()"><ng-content /></span>
      @if (loading()) {
        <bc-spinner class="absolute" label="Working" />
      }
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<'md' | 'sm'>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly loading = input(false);
  readonly disabled = input(false);
  /** Stretches to the container (auth forms, mobile form footers). Use as a bare attribute. */
  readonly fullWidth = input(false, { transform: (v: boolean | string) => v !== false });

  protected readonly classes = computed(() =>
    [BASE, VARIANTS[this.variant()], SIZES[this.size()], this.fullWidth() ? 'w-full' : ''].join(' '),
  );
}
