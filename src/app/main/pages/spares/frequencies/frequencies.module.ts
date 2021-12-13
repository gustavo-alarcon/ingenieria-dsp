import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequenciesRoutingModule } from './frequencies-routing.module';
import { FrequenciesComponent } from './frequencies.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BulkDialogComponent } from './dialogs/bulk-dialog/bulk-dialog.component';
import { CreateFrequencyDialogComponent } from './dialogs/create-frequency-dialog/create-frequency-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FrequenciesComponent,
    BulkDialogComponent,
    CreateFrequencyDialogComponent,
  ],
  imports: [
    CommonModule,
    FrequenciesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FrequenciesModule {}
