import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsProgressRoutingModule } from './evaluations-progress-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsProgressComponent } from './evaluations-progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EvaluationsProgressComponent
  ],
  exports: [
    EvaluationsProgressComponent
  ],
  imports: [
    CommonModule,
    EvaluationsProgressRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class EvaluationsProgressModule { }
