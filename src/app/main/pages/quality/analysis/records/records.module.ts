import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent } from './records.component';
import { MaterialModule } from '../../../../../material/material.module';
import { ConfigurationsComponent } from './dialogs/configurations/configurations.component';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { AssignSpecialistDialogComponent } from './dialogs/assign-specialist-dialog/assign-specialist-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';


@NgModule({
  declarations: [RecordsComponent, ConfigurationsComponent, TimeLineDialogComponent, AssignSpecialistDialogComponent, DetailInternalDialogComponent, DetailExternalDialogComponent],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    MaterialModule,
  ]
})
export class RecordsModule { }
