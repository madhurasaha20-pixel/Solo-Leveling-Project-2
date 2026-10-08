import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';

import { Account, User } from '../../core/models';
import { MoneyPipe } from '../pipes/money.pipe';
import { ButtonComponent } from './button.component';
import { IconComponent } from './icon.component';

type Appearance = 'light' | 'dark';

/**
 * Account pop-up in the header: identity, account number (copy), balance, appearance (mock), sign out.
 * Presentation only: the app shell passes the user and account in and handles sign-out.
 *   <bc-account-menu [user]="user" [account]="account" (signOut)="signOut()" />
 */
@Component({
  selector: 'bc-account-menu',
  imports: [DatePipe, MoneyPipe, ButtonComponent, IconComponent],
  templateUrl: './account-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class AccountMenuComponent {
  readonly user = input.required<User>();
  //readonly account = input<Account | null>(null);
  readonly accounts = input<Account[]>([]);
  readonly signOut = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private copiedTimer?: ReturnType<typeof setTimeout>;

  protected readonly open = signal(false);
  protected readonly copied = signal(false);

  /** Mock: the user's pick is shown in the menu but not applied to the page. Until they pick, show the device mode. */
  protected readonly pick = signal<Appearance | null>(null);
  private readonly deviceMode: Appearance = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  protected readonly appearance = computed(() => this.pick() ?? this.deviceMode);
  protected readonly appearanceOptions = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
  ] as const;

  protected readonly initials = computed(() =>
    this.user().name.trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(),
  );

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }

  protected onEscape(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.trigger().nativeElement.focus();
  }

  protected async copyAccountNumber(id: string): Promise<void> {
    await navigator.clipboard.writeText(id);
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
  }
}