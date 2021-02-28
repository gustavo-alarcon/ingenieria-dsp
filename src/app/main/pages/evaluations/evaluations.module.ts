import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    EvaluationsComponent,
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
