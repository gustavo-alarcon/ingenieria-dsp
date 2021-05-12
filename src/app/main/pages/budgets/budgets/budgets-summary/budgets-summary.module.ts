import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsSummaryRoutingModule } from './budgets-summary-routing.module';
import { BudgetsSummaryComponent } from './budgets-summary.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [BudgetsSummaryComponent],
  exports: [BudgetsSummaryComponent],
  imports: [CommonModule, BudgetsSummaryRoutingModule, MaterialModule],
})
export class BudgetsSummaryModule {}
