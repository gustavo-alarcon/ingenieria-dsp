import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsPendingSendRoutingModule } from './budgets-pending-send-routing.module';
import { BudgetsPendingSendComponent } from './budgets-pending-send.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [BudgetsPendingSendComponent],
  exports: [BudgetsPendingSendComponent],
  imports: [CommonModule, BudgetsPendingSendRoutingModule, MaterialModule],
})
export class BudgetsPendingSendModule {}
