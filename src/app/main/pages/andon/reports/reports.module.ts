import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from '../../../../material/material.module';
import { DetailsDialogComponent } from './dialogs/details-dialog/details-dialog.component';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ComponentsModule } from 'src/app/shared/components/components.module';


@NgModule({
  declarations: [ReportsComponent, DetailsDialogComponent, ReturnDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    Ng2ImgMaxModule,
    ComponentsModule
  ]
})
export class ReportsModule { }
