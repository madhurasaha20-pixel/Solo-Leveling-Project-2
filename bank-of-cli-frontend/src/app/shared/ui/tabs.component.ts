import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface TabItem { id: string; label: string; }

/**
 * Segmented switch between sibling views. Two-way bound:
 *   <bc-tabs label="Transaction type" [tabs]="tabs" [(value)]="mode" panelId="txn-panel" />
 */
@Component({
  selector: 'bc-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div role="tablist" [attr.aria-label]="label()" class="flex gap-1 rounded-md bg-surface-sunken p-1">
      @for (t of tabs(); track t.id; let i = $index) {
        <button
          type="button"
          role="tab"
          [id]="'tab-' + t.id"
          [attr.aria-selected]="t.id === value()"
          [attr.aria-controls]="panelId()"
          [tabIndex]="t.id === value() ? 0 : -1"
          (click)="value.set(t.id)"
          (keydown)="onKey($event, i)"
          class="h-8 flex-1 cursor-pointer rounded-sm text-label font-medium transition-colors duration-[120ms]"
          [class]="t.id === value() ? 'bg-surface-raised text-ink shadow-raised' : 'text-ink-muted hover:text-ink'"
        >{{ t.label }}</button>
      }
    </div>
  `,
})
export class TabsComponent {
  readonly tabs = input.required<TabItem[]>();
  readonly label = input.required<string>();
  readonly panelId = input<string | null>(null);
  readonly value = model.required<string>();

  protected onKey(e: KeyboardEvent, i: number): void {
    const n = this.tabs().length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : -1;
    if (j < 0) return;
    e.preventDefault();
    this.value.set(this.tabs()[j].id);
    const buttons = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]');
    buttons?.[j]?.focus();
  }
}
