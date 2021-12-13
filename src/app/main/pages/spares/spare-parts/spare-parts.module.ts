import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { SparePartsComponent } from './spare-parts.component';
import { MaterialModule } from 'src/app/material/material.module';
import { OtDialogComponent } from './dialogs/ot-dialog/ot-dialog.component';


@NgModule({
  declarations: [
    SparePartsComponent,
    OtDialogComponent
  ],
  exports: [
    SparePartsComponent
  ],
  imports: [
    CommonModule,
    SparePartsRoutingModule,
    MaterialModule
  ]
})
export class SparePartsModule { }
