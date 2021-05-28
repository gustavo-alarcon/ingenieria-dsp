import { ComponentsModule } from './../../../../shared/components/components.module';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsDailyEntriesRoutingModule } from './budgets-daily-entries-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { BudgetsDailyEntriesComponent } from './budgets-daily-entries.component';

@NgModule({
  declarations: [BudgetsDailyEntriesComponent, DeleteDialogComponent],
  exports: [BudgetsDailyEntriesComponent],
  imports: [
    CommonModule,
    BudgetsDailyEntriesRoutingModule,
    MaterialModule,
    ComponentsModule,
  ],
})
export class BudgetsDailyEntriesModule {}
