import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';
import { BudgetsPendingSendComponent } from './budgets-pending-send.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsPendingSendComponent  ,
    children: [{ path: '**', component: NotFoundComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetsPendingSendRoutingModule {}
