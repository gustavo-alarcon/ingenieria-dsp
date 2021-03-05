import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from '../../../../material/material.module';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [ReportsComponent, DetailsDialogComponent, ReturnDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
  ]
})
export class ReportsModule { }
