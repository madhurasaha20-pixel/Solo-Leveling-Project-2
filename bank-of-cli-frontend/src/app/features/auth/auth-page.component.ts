import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiError } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { AlertComponent, ButtonComponent, CardComponent, TabItem, TabsComponent, TextFieldComponent } from '../../shared/ui';
import { fieldError } from '../../shared/validators/form-errors';

type Mode = 'signin' | 'register';
type FieldName = 'name' | 'email' | 'password';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Sign-in / create-account form, switched with a toggle. Talks to AuthService (mock backend);
 * see core/contracts/CONTRACTS.md for the error codes.
 */
@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, AlertComponent, ButtonComponent, CardComponent, TabsComponent, TextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-full max-w-form">
      <bc-card>
        <h1 class="text-heading-1 font-semibold text-ink">{{ isRegister() ? 'Create account' : 'Sign in' }}</h1>
        <p class="mt-1 mb-6 text-body text-ink-muted">
          {{ isRegister() ? 'Open an account to start moving money.' : 'Sign in to view balances and move money.' }}
        </p>

        <bc-tabs label="Account access" [tabs]="tabs" [value]="mode()" (valueChange)="setMode($event)" />

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="mt-6 flex flex-col gap-4">
          @if (formError(); as err) {
            <bc-alert tone="error" [title]="isRegister() ? 'We couldn’t create your account' : 'We couldn’t sign you in'">
              {{ err.message }}
              <span class="mt-1 block font-mono text-code text-ink-muted">Error code: {{ err.code }}</span>
            </bc-alert>
          }
          @if (isRegister()) {
            <bc-text-field label="Full name" autocomplete="name" formControlName="name" [error]="errorFor('name')" />
          }
          <bc-text-field label="Email" type="email" autocomplete="email" formControlName="email"
                         [error]="errorFor('email')" />
          <bc-text-field label="Password" type="password" formControlName="password" [error]="errorFor('password')"
                         [autocomplete]="isRegister() ? 'new-password' : 'current-password'"
                         [hint]="isRegister() ? 'At least ${MIN_PASSWORD_LENGTH} characters.' : null" />
          <bc-button type="submit" fullWidth [loading]="busy()">{{ isRegister() ? 'Create account' : 'Sign in' }}</bc-button>
        </form>
      </bc-card>
    </div>
  `,
})
export class AuthPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly tabs: TabItem[] = [
    { id: 'signin', label: 'Sign in' },
    { id: 'register', label: 'Create account' },
  ];
  protected readonly mode = signal<Mode>('signin');
  protected readonly busy = signal(false);
  protected readonly submitted = signal(false);
  /** Last failed request, if any. Field-level errors show under their field, the rest in the alert. */
  private readonly apiError = signal<ApiError | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.applyMode();
  }

  protected isRegister(): boolean {
    return this.mode() === 'register';
  }

  protected setMode(id: string): void {
    if (id === this.mode() || this.busy()) return;
    this.mode.set(id as Mode);
    this.submitted.set(false);
    this.apiError.set(null);
    this.form.controls.password.reset('');
    this.applyMode();
  }

  protected formError(): ApiError | null {
    const err = this.apiError();
    return err && !this.isFieldError(err) ? err : null;
  }

  protected errorFor(name: FieldName): string | null {
    const err = this.apiError();
    if (err?.field === name) return err.message;
    return fieldError(this.form.controls[name], this.submitted());
  }

  protected submit(): void {
    if (this.busy()) return;
    this.submitted.set(true);
    this.apiError.set(null);
    if (this.form.invalid) return;

    const { name, email, password } = this.form.getRawValue();
    const request$ = this.isRegister()
      ? this.auth.register({ name: name.trim(), email, password })
      : this.auth.login({ email, password });

    this.busy.set(true);
    request$.subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: (err: ApiError) => {
        this.apiError.set(err);
        this.busy.set(false);
      },
    });
  }

  /** The name field and the password length rule only apply when creating an account. */
  private applyMode(): void {
    const { name, password } = this.form.controls;
    if (this.isRegister()) {
      name.enable();
      password.setValidators([Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]);
    } else {
      name.disable();
      password.setValidators([Validators.required]);
    }
    password.updateValueAndValidity();
  }

  private isFieldError(err: ApiError): boolean {
    return err.field === 'name' || err.field === 'email' || err.field === 'password';
  }
}
