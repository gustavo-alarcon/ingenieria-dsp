import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRequestsRoutingModule } from './evaluations-requests-routing.module';
import { EvaluationsRequestsComponent } from './evaluations-requests.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RequestsObservationDialogComponent } from './components/dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from './components/dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from './components/dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from './components/dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
import { TimeLineComponent } from './components/time-line/time-line.component';


@NgModule({
  declarations: [
    EvaluationsRequestsComponent,
    RequestsObservationDialogComponent,
    RequestsSettingDialogComponent,
    RequestsStartDialogComponent,
    RequestsTimeLineDialogComponent,
    TimeLineComponent
  ],
  exports: [
    EvaluationsRequestsComponent,

  ],
  imports: [
    CommonModule,
    EvaluationsRequestsRoutingModule,
    MaterialModule
  ]
})
export class EvaluationsRequestsModule { }
