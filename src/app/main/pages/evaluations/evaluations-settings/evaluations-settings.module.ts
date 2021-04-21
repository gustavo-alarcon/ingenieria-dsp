import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsSettingsRoutingModule } from './evaluations-settings-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsSettingsComponent } from './evaluations-settings.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';


@NgModule({
  declarations: [EvaluationsSettingsComponent, AddBroadcastDialogComponent, DeleteBroadcastDialogComponent],
  imports: [
    CommonModule,
    EvaluationsSettingsRoutingModule,
    MaterialModule
  ]
})
export class EvaluationsSettingsModule { }
