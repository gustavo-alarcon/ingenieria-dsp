import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequencyRoutingModule } from './frequency-routing.module';
import { FrequencyComponent } from './frequency.component';
import { UploadFileFrequencyDialogComponent } from './dialogs/upload-file-frequency-dialog/upload-file-frequency-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { EditFrequencyDialogComponent } from './dialogs/edit-frequency-dialog/edit-frequency-dialog.component';
import { DeleteFrequencyDialogComponent } from './dialogs/delete-frequency-dialog/delete-frequency-dialog.component';


@NgModule({
  declarations: [FrequencyComponent, UploadFileFrequencyDialogComponent, EditFrequencyDialogComponent, DeleteFrequencyDialogComponent],
  imports: [
    CommonModule,
    FrequencyRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class FrequencyModule { }
