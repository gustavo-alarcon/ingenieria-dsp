import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsRoutingModule } from './budgets-routing.module';
import { BudgetsComponent } from './budgets.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [BudgetsComponent],
  exports: [BudgetsComponent],
  imports: [CommonModule, BudgetsRoutingModule, MaterialModule],
})
export class BudgetsModule {}
