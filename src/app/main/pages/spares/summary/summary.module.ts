import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { MaterialModule } from 'src/app/material/material.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { DeleteSparePartDialogComponent } from './dialogs/delete-spare-part-dialog/delete-spare-part-dialog.component';


@NgModule({
  declarations: [
    SummaryComponent,
    DeleteSparePartDialogComponent
  ],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    MaterialModule,
    Ng2ImgMaxModule
  ]
})
export class SummaryModule { }
