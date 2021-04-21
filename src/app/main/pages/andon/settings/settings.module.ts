import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from '../../../../material/material.module';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';

@NgModule({
  declarations: [
    SettingsComponent,
    AddBroadcastDialogComponent,
    DeleteBroadcastDialogComponent,
  ],
  imports: [CommonModule, SettingsRoutingModule, MaterialModule],
})
export class SettingsModule {}
