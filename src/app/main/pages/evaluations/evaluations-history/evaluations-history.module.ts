import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsHistoryRoutingModule } from './evaluations-history-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsHistoryComponent } from './evaluations-history.component';
import { HistoryCreateDialogComponent } from './dialogs/history-create-dialog/history-create-dialog.component';
import { HistoryEditDialogComponent } from './dialogs/history-edit-dialog/history-edit-dialog.component';


@NgModule({
  declarations: [
    EvaluationsHistoryComponent,
    HistoryCreateDialogComponent,
    HistoryEditDialogComponent,
  ],
  exports: [
    EvaluationsHistoryComponent
  ],
  imports: [
    CommonModule,
    EvaluationsHistoryRoutingModule,
    MaterialModule
  ]
})
export class EvaluationsHistoryModule { }
