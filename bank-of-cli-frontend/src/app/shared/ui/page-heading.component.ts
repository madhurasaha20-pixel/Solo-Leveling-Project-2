import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'bc-page-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <h1 class="text-heading-1 font-semibold text-ink">{{ title() }}</h1>
    @if (description()) {
      <p class="mt-1 text-body text-ink-muted">{{ description() }}</p>
    }
  `,
})
export class PageHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input('');
}
