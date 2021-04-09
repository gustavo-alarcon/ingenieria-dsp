import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracingRoutingModule } from './tracing-routing.module';
import { TracingComponent } from './tracing.component';

import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { ConfigurationsDialogComponent } from './dialogs/configurations-dialog/configurations-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';

import { MaterialModule } from '../../../../../material/material.module';
import { AccCorrectiveDialogComponent } from './dialogs/acc-corrective-dialog/acc-corrective-dialog.component';
import { ReportsDialogComponent } from './dialogs/reports-dialog/reports-dialog.component';


@NgModule({
  declarations: [
    TracingComponent,
    TimeLineDialogComponent,
    ConfigurationsDialogComponent,
    DetailInternalDialogComponent,
    DetailExternalDialogComponent,
    AccCorrectiveDialogComponent,
    ReportsDialogComponent,
  ],
  imports: [
    CommonModule,
    TracingRoutingModule,
    MaterialModule,

  ]
})
export class TracingModule { }
