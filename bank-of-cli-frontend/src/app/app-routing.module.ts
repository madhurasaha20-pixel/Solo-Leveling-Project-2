import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageShellComponent } from './features/page-shell.component';
import { TransactionsComponent } from './features/transactions/transactions.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: PageShellComponent, title: 'Dashboard · Bank of CLI', data: { title: 'Dashboard', description: 'Here is where your accounts stand today.', greeting: true } },
  { path: 'move-money', component: TransactionsComponent, title: 'Move money · Bank of CLI' },
  { path: 'login', component: PageShellComponent, title: 'Sign in · Bank of CLI', data: { title: 'Sign in', description: 'Sign in to view balances and move money.' } },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
