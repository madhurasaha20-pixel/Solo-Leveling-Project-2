import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'bc-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <span role="status" [attr.aria-label]="label()"
          class="inline-block animate-spin rounded-full border-2 border-current border-r-transparent"
          [class]="sizeClass()"></span>
  `,
})
export class SpinnerComponent {
  readonly size = input<'md' | 'lg'>('md');
  readonly label = input('Loading');
  protected readonly sizeClass = computed(() => (this.size() === 'lg' ? 'size-6' : 'size-4'));
}
