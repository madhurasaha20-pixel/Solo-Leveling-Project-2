import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guards';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { PageShellComponent } from './features/page-shell.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'dashboard', canActivate: [authGuard], component: PageShellComponent, title: 'Dashboard · Bank of CLI', data: { title: 'Dashboard', description: 'Here is where your accounts stand today.', greeting: true } },
  { path: 'move-money', canActivate: [authGuard], component: PageShellComponent, title: 'Move money · Bank of CLI', data: { title: 'Move money', description: 'Deposit, withdraw or transfer money.' } },
  { path: 'login', canActivate: [guestGuard], component: AuthPageComponent, title: 'Sign in · Bank of CLI' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
