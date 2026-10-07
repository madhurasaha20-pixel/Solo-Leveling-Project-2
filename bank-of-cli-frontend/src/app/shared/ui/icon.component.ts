import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName = 'check' | 'check-circle' | 'x' | 'info' | 'alert' | 'chevron-down';

const PATHS: Record<IconName, string> = {
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  'check-circle': 'M7 10.2l2 2 4-4.4',
  x: 'M5 5l10 10M15 5L5 15',
  info: 'M10 9v5M10 6.5v.01',
  alert: 'M10 6v5M10 13.5v.01',
  'chevron-down': 'M6 8l4 4 4-4',
};
const CIRCLED: IconName[] = ['check-circle', 'info', 'alert'];

/**
 * 20px line icons, 1.75 stroke, currentColor — same geometry family as Lucide.
 * If you add lucide-angular later, keep size 20 and strokeWidth 1.75.
 */
@Component({
  selector: 'bc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 20 20" fill="none" stroke="currentColor"
         stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      @if (circled()) { <circle cx="10" cy="10" r="7.25" /> }
      <path [attr.d]="path()" />
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  protected readonly path = computed(() => PATHS[this.name()]);
  protected readonly circled = computed(() => CIRCLED.includes(this.name()));
}
