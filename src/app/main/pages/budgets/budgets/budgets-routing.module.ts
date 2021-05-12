import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';
import { BudgetsComponent } from './budgets.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./budgets-summary/budgets-summary.module').then(
            (m) => m.BudgetsSummaryModule
          ),
      },
      {
        path: 'pending-send',
        loadChildren: () =>
          import('./budgets-pending-send/budgets-pending-send.module').then(
            (m) => m.BudgetsPendingSendModule
          ),
      },
      {
        path: 'pending-approval',
        loadChildren: () =>
          import(
            './budgets-pending-approval/budgets-pending-approval.module'
          ).then((m) => m.BudgetsPendingApprovalModule),
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetsRoutingModule {}
