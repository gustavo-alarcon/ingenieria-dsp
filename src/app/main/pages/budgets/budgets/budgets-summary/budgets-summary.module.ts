import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsSummaryRoutingModule } from './budgets-summary-routing.module';
import { BudgetsSummaryComponent } from './budgets-summary.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BudgetsSummaryDeleteDialogComponent } from './dialogs/budgets-summary-delete-dialog/budgets-summary-delete-dialog.component';
import { BudgetsSummarySendDialogComponent } from './dialogs/budgets-summary-send-dialog/budgets-summary-send-dialog.component';
import { BudgetsSummaryTimelineDialogComponent } from './dialogs/budgets-summary-timeline-dialog/budgets-summary-timeline-dialog.component';

@NgModule({
  declarations: [BudgetsSummaryComponent, BudgetsSummaryDeleteDialogComponent, BudgetsSummarySendDialogComponent, BudgetsSummaryTimelineDialogComponent],
  exports: [BudgetsSummaryComponent],
  imports: [CommonModule, BudgetsSummaryRoutingModule, MaterialModule],
})
export class BudgetsSummaryModule {}
