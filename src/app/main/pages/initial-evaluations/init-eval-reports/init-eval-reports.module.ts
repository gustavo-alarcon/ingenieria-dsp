import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitEvalReportsRoutingModule } from './init-eval-reports-routing.module';
import { InitEvalReportsComponent } from './init-eval-reports.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GenerateReceptionComponent } from './generate-reception/generate-reception.component';
import { UploadTaskComponent } from 'src/app/shared/components/upload-task/upload-task.component';


@NgModule({
  declarations: [
    InitEvalReportsComponent,
    GenerateReceptionComponent,
  ],
  imports: [
    CommonModule,
    InitEvalReportsRoutingModule,
    MaterialModule
  ]
})
export class InitEvalReportsModule { }
