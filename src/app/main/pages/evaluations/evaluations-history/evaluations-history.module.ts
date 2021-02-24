import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsHistoryRoutingModule } from './evaluations-history-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsHistoryComponent } from './evaluations-history.component';


@NgModule({
  declarations: [
    EvaluationsHistoryComponent
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
