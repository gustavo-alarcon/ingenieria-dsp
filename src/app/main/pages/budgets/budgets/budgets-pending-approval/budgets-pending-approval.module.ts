import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsPendingApprovalRoutingModule } from './budgets-pending-approval-routing.module';
import { BudgetsPendingApprovalComponent } from './budgets-pending-approval.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BudgetsPendingApproveComponent } from './dialogs/budgets-pending-approve/budgets-pending-approve.component';
import { BudgetsPendingModifyComponent } from './dialogs/budgets-pending-modify/budgets-pending-modify.component';

@NgModule({
  declarations: [BudgetsPendingApprovalComponent, BudgetsPendingApproveComponent, BudgetsPendingModifyComponent],
  exports: [BudgetsPendingApprovalComponent],
  imports: [CommonModule, BudgetsPendingApprovalRoutingModule, MaterialModule],
})
export class BudgetsPendingApprovalModule {}
