import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsRequestsComponent } from './evaluations-requests/evaluations-requests.component';
import { EvaluationsProcessComponent } from './evaluations-process/evaluations-process.component';
import { EvaluationsHistoryComponent } from './evaluations-history/evaluations-history.component';
import { EvaluationsSettingsComponent } from './evaluations-settings/evaluations-settings.component';
import {RequestsSettingDialogComponent} from './requests-setting-dialog/requests-setting-dialog.component';
import {RequestsStartDialogComponent} from './requests-start-dialog/requests-start-dialog.component';
import {RequestsObservationDialogComponent} from './requests-observation-dialog/requests-observation-dialog.component';
import {RequestsTimeLineDialogComponent} from './requests-time-line-dialog/requests-time-line-dialog.component';

@NgModule({
  declarations: [
    EvaluationsComponent,
    EvaluationsRequestsComponent,
    EvaluationsProcessComponent,
    EvaluationsHistoryComponent,
    EvaluationsSettingsComponent,
    RequestsSettingDialogComponent,
    RequestsStartDialogComponent,
    RequestsObservationDialogComponent,
    RequestsTimeLineDialogComponent
  ],
  exports: [EvaluationsComponent],
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    MaterialModule,
  ],
})
export class EvaluationsModule {}
