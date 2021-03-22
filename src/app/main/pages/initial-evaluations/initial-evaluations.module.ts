import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitialEvaluationsRoutingModule } from './initial-evaluations-routing.module';
import { GeneralDispatchComponent } from './init-eval-reports/general-dispatch/general-dispatch.component';


@NgModule({
  declarations: [GeneralDispatchComponent],
  imports: [
    CommonModule,
    InitialEvaluationsRoutingModule
  ]
})
export class InitialEvaluationsModule { }
