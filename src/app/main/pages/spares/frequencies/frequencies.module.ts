import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequenciesRoutingModule } from './frequencies-routing.module';
import { FrequenciesComponent } from './frequencies.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BulkDialogComponent } from './dialogs/bulk-dialog/bulk-dialog.component';


@NgModule({
  declarations: [FrequenciesComponent, BulkDialogComponent],
  imports: [
    CommonModule,
    FrequenciesRoutingModule,
    MaterialModule
  ]
})
export class FrequenciesModule { }
