import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './configurations.component';
import { MaterialModule } from '../../../../material/material.module';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { DeleteWorkshopDialogComponent } from './dialogs/delete-workshop-dialog/delete-workshop-dialog.component';
import { EditWorkShopComponent } from './dialogs/edit-work-shop/edit-work-shop.component';


@NgModule({
  declarations: [ConfigurationsComponent, DeleteBroadcastDialogComponent, AddBroadcastDialogComponent, DeleteWorkshopDialogComponent, EditWorkShopComponent],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    MaterialModule
  ]
})
export class ConfigurationsModule { }
