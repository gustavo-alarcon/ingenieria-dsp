import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsRoutingModule } from './evaluations-routing.module';
import { EvaluationsComponent } from './evaluations.component';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsRequestsComponent } from './evaluations-requests/evaluations-requests.component';
import { EvaluationsProcessComponent } from './evaluations-process/evaluations-process.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/shared/components/components.module';


@NgModule({
  declarations: [
    EvaluationsComponent,
    EvaluationsRequestsComponent,
    EvaluationsProcessComponent
  ],
  imports: [
    CommonModule,
    EvaluationsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule
  ]
})
export class EvaluationsModule { }
