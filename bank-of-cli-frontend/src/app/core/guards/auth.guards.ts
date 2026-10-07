import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/** Pages that need a login. Logged-out visitors are sent to /login. */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).isLoggedIn() ? true : router.createUrlTree(['/login']);
};

/** The login page. People who are already signed in are sent to the dashboard. */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).isLoggedIn() ? router.createUrlTree(['/dashboard']) : true;
};
