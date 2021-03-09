import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordRoutingModule } from './record-routing.module';
import { RecordComponent } from './record.component';
import { MaterialModule } from '../../../../material/material.module';
import { ImageDialogComponent } from './dialog/image-dialog/image-dialog.component';


@NgModule({
  declarations: [RecordComponent, ImageDialogComponent],
  imports: [
    CommonModule,
    RecordRoutingModule,
    MaterialModule,
  ]
})
export class RecordModule { }
