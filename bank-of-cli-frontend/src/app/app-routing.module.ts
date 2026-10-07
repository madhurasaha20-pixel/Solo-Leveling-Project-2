import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guards';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { PageShellComponent } from './features/page-shell.component';
import { TransactionsComponent } from './features/transactions/transactions.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: PageShellComponent,
    title: 'Dashboard · Bank of CLI',
    data: {
      title: 'Dashboard',
      description: 'Here is where your accounts stand today.',
      greeting: true
    }
  },
  {
    path: 'move-money',
    canActivate: [authGuard],
    component: TransactionsComponent,
    title: 'Move money · Bank of CLI'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: AuthPageComponent,
    title: 'Sign in · Bank of CLI'
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
