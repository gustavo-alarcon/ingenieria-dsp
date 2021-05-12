import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsPendingApprovalRoutingModule } from './budgets-pending-approval-routing.module';
import { BudgetsPendingApprovalComponent } from './budgets-pending-approval.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [BudgetsPendingApprovalComponent],
  exports: [BudgetsPendingApprovalComponent],
  imports: [CommonModule, BudgetsPendingApprovalRoutingModule, MaterialModule],
})
export class BudgetsPendingApprovalModule {}
