import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';
import { BudgetsPendingApprovalComponent } from './budgets-pending-approval.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsPendingApprovalComponent,
    children: [{ path: '**', component: NotFoundComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetsPendingApprovalRoutingModule {}
