import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Placeholder shaped like the content it replaces. Heights: 16 body, 12 meta, 36 balance. */
@Component({
  selector: 'bc-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class:
      'relative block overflow-hidden rounded-sm bg-surface-sunken ' +
      'after:absolute after:inset-0 after:animate-shimmer after:bg-linear-to-r after:from-transparent ' +
      'after:via-surface-raised after:to-transparent after:opacity-60 motion-reduce:after:hidden',
    '[style.width]': 'width()',
    '[style.height.px]': 'height()',
  },
  template: ``,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input(16);
}
