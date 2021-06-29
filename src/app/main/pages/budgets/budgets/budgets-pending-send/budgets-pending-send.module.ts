import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsPendingSendRoutingModule } from './budgets-pending-send-routing.module';
import { BudgetsPendingSendComponent } from './budgets-pending-send.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PendingSendUpdateDialogComponent } from './dialogs/pending-send-update-dialog/pending-send-update-dialog.component';
import { PendingSendDeleteDialogComponent } from './dialogs/pending-send-delete-dialog/pending-send-delete-dialog.component';

@NgModule({
  declarations: [BudgetsPendingSendComponent, PendingSendUpdateDialogComponent, PendingSendDeleteDialogComponent],
  exports: [BudgetsPendingSendComponent],
  imports: [CommonModule, BudgetsPendingSendRoutingModule, MaterialModule],
})
export class BudgetsPendingSendModule {}
