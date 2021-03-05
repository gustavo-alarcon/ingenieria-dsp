import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsDailyEntriesRoutingModule } from './budgets-daily-entries-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { BudgetsDailyEntriesComponent } from './budgets-daily-entries.component';


@NgModule({
  declarations: [
    BudgetsDailyEntriesComponent
  ],
  exports: [
    BudgetsDailyEntriesComponent
  ],
  imports: [
    CommonModule,
    BudgetsDailyEntriesRoutingModule,
    MaterialModule
  ]
})
export class BudgetsDailyEntriesModule { }
