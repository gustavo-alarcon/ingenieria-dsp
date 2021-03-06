import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './configurations.component';
import { MaterialModule } from '../../../../material/material.module';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';


@NgModule({
  declarations: [ConfigurationsComponent, DeleteBroadcastDialogComponent, AddBroadcastDialogComponent],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    MaterialModule
  ]
})
export class ConfigurationsModule { }
