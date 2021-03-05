import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsDailyEntriesComponent } from './budgets-daily-entries.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsDailyEntriesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetsDailyEntriesRoutingModule { }
