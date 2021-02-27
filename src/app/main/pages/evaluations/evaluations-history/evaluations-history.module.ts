import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2ImgMaxModule } from 'ng2-img-max'; 

import { EvaluationsHistoryRoutingModule } from './evaluations-history-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsHistoryComponent } from './evaluations-history.component';
import { HistoryCreateDialogComponent } from './dialogs/history-create-dialog/history-create-dialog.component';
import { HistoryEditDialogComponent } from './dialogs/history-edit-dialog/history-edit-dialog.component';
import { HistoryDeleteDialogComponent } from './dialogs/history-delete-dialog/history-delete-dialog.component';
import { HistoryImageDialogComponent } from './dialogs/history-image-dialog/history-image-dialog.component';
import { HistoryObservationDialogComponent } from './dialogs/history-observation-dialog/history-observation-dialog.component';


@NgModule({
  declarations: [
    EvaluationsHistoryComponent,
    HistoryCreateDialogComponent,
    HistoryEditDialogComponent,
    HistoryDeleteDialogComponent,
    HistoryImageDialogComponent,
    HistoryObservationDialogComponent,
  ],
  exports: [
    EvaluationsHistoryComponent
  ],
  imports: [
    CommonModule,
    EvaluationsHistoryRoutingModule,
    MaterialModule,
    Ng2ImgMaxModule
  ]
})
export class EvaluationsHistoryModule { }
