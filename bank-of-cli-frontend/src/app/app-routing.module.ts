import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageShellComponent } from './features/page-shell.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: PageShellComponent, title: 'Dashboard · Bank of CLI', data: { title: 'Dashboard', description: 'Here is where your accounts stand today.', greeting: true } },
  { path: 'move-money', component: PageShellComponent, title: 'Move money · Bank of CLI', data: { title: 'Move money', description: 'Deposit, withdraw or transfer money.' } },
  { path: 'login', component: PageShellComponent, title: 'Sign in · Bank of CLI', data: { title: 'Sign in', description: 'Sign in to view balances and move money.' } },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
