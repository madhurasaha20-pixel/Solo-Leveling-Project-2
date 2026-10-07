import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiError } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { AlertComponent, ButtonComponent, CardComponent, TextFieldComponent } from '../../shared/ui';
import { fieldError } from '../../shared/validators/form-errors';

type FieldName = 'email' | 'password';

/** Sign-in form. The mock backend answers through AuthService; see core/contracts/CONTRACTS.md for error codes. */
@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, AlertComponent, ButtonComponent, CardComponent, TextFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-full max-w-form">
      <bc-card>
        <h1 class="text-heading-1 font-semibold text-ink">Sign in</h1>
        <p class="mt-1 mb-6 text-body text-ink-muted">Sign in to view balances and move money.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
          @if (formError(); as err) {
            <bc-alert tone="error" title="We couldn’t sign you in">
              {{ err.message }}
              <span class="mt-1 block font-mono text-code text-ink-muted">Error code: {{ err.code }}</span>
            </bc-alert>
          }
          <bc-text-field label="Email" type="email" autocomplete="email" formControlName="email"
                         [error]="errorFor('email')" />
          <bc-text-field label="Password" type="password" autocomplete="current-password" formControlName="password"
                         [error]="errorFor('password')" />
          <bc-button type="submit" fullWidth [loading]="busy()">Sign in</bc-button>
        </form>
      </bc-card>
    </div>
  `,
})
export class AuthPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly busy = signal(false);
  protected readonly submitted = signal(false);
  /** Last failed request, if any. Field-level errors are shown under their field, the rest in the alert. */
  private readonly apiError = signal<ApiError | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

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

    this.busy.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigateByUrl('/dashboard'),
      error: (err: ApiError) => {
        this.apiError.set(err);
        this.busy.set(false);
      },
    });
  }

  private isFieldError(err: ApiError): boolean {
    return err.field === 'email' || err.field === 'password';
  }
}
