import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AccCorrectiveDialogComponent } from './dialogs/acc-corrective-dialog/acc-corrective-dialog.component';
import { DetailInternoDialogComponent } from './dialogs/detail-interno-dialog/detail-interno-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { EditDialogComponent } from './dialogs/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [ResultsComponent, AccCorrectiveDialogComponent, DetailInternoDialogComponent, DetailInternalDialogComponent, DetailExternalDialogComponent, TimeLineDialogComponent, EditDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule,

    MaterialModule
  ]
})
export class ResultsModule { }
