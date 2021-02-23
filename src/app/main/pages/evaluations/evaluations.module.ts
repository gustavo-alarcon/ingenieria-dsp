import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsRequestsComponent } from './evaluations-requests/evaluations-requests.component';
import { EvaluationsProcessComponent } from './evaluations-process/evaluations-process.component';
import { EvaluationsHistoryComponent } from './evaluations-history/evaluations-history.component';
import { EvaluationsSettingsComponent } from './evaluations-settings/evaluations-settings.component';


@NgModule({
  declarations: [EvaluationsComponent, EvaluationsRequestsComponent, EvaluationsProcessComponent, EvaluationsHistoryComponent, EvaluationsSettingsComponent],
  exports: [
    EvaluationsComponent
  ],
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    MaterialModule,

  ]
})
export class EvaluationsModule { }
