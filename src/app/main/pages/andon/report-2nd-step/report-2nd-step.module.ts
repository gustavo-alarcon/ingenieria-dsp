import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { report2ndStepRoutingModule } from './report-2nd-step-routing.module';
import { report2ndStepComponent } from './report-2nd-stepcomponent';
import { MaterialModule } from '../../../../material/material.module';


@NgModule({
  declarations: [report2ndStepComponent],
  imports: [
    CommonModule,
    report2ndStepRoutingModule,
    MaterialModule,
  ]
})
export class report2ndStepModule { }
