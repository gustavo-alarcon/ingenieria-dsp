import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RequestsObservationDialogComponent } from './dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './dialogs/requests-time-line-dialog/requests-time-line-dialog.component';


@NgModule({
  declarations: [
    EvaluationsComponent,
    RequestsObservationDialogComponent,
    RequestsSettingDialogComponent,
    RequestsStartDialogComponent,
    RequestsTimeLineDialogComponent
  ],
  exports: [
    EvaluationsComponent,
  ],
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    MaterialModule,
  ],
})
export class EvaluationsModule { }
