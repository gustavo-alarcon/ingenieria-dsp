import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitEvalReportsRoutingModule } from './init-eval-reports-routing.module';
import { InitEvalReportsComponent } from './init-eval-reports.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GenerateReceptionComponent } from './generate-reception/generate-reception.component';
import { GenerateComponent } from './generate-reception/dialogs/generate/generate.component';
import { NgxPrintModule } from 'ngx-print';
import { GenerateDispatchComponent } from './generate-dispatch/generate-dispatch.component';
import { DialogDispatchGenerateComponent } from './generate-dispatch/dialogs/generate/dialog-dispatch-generate.component';


@NgModule({
  declarations: [
    InitEvalReportsComponent,
    GenerateReceptionComponent,
    GenerateComponent,
    DialogDispatchGenerateComponent,
    GenerateDispatchComponent,
  ],
  imports: [
    CommonModule,
    InitEvalReportsRoutingModule,
    MaterialModule,
    NgxPrintModule
  ]
})
export class InitEvalReportsModule { }
