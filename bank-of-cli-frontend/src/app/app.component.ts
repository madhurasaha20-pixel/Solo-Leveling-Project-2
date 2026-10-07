import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main-content" class="sr-only fixed left-4 top-4 z-50 min-h-10 items-center rounded-md bg-brand px-4 py-3 text-label font-medium text-on-brand transition-colors duration-[120ms] ease-out focus:not-sr-only">Skip to content</a>
    @let user = auth.currentUser$ | async;
    <bc-app-header [userName]="user?.name ?? null" [links]="user ? links : []" (signOut)="signOut()" />
    <main id="main-content" tabindex="-1" class="mx-auto max-w-content px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
      <router-outlet />
      @if (signedOut() && router.url === '/login') {
        <p role="status" class="mt-4 text-body text-ink">You’re signed out.</p>
      }
    </main>
  `,
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly signedOut = signal(false);
  protected readonly links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/move-money', label: 'Move money' },
  ];

  protected signOut(): void {
    this.auth.logout();
    this.signedOut.set(true);
    void this.router.navigateByUrl('/login');
  }
}
