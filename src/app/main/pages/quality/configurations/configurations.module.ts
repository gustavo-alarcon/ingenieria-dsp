import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './configurations.component';
import { MaterialModule } from '../../../../material/material.module';
import { DeleteBroadcastDialogComponent } from './dialogs/delete-broadcast-dialog/delete-broadcast-dialog.component';
import { AddBroadcastDialogComponent } from './dialogs/add-broadcast-dialog/add-broadcast-dialog.component';
import { DeleteWorkshopDialogComponent } from './dialogs/delete-workshop-dialog/delete-workshop-dialog.component';
import { EditWorkshopDialogComponent } from './dialogs/edit-workshop-dialog/edit-workshop-dialog.component';
import { DeleteProcessDialogComponent } from './dialogs/edit-workshop-dialog/delete-process-dialog/delete-process-dialog.component';
import { DeleteBasicCauseDialogComponent } from './dialogs/delete-basic-cause-dialog/delete-basic-cause-dialog.component';
import { EditBasicCauseDialogComponent } from './dialogs/edit-basic-cause-dialog/edit-basic-cause-dialog.component';
import { DeleteImmediateCauseDialogComponent } from './dialogs/edit-basic-cause-dialog/delete-immediate-cause-dialog/delete-immediate-cause-dialog.component';

@NgModule({
  declarations: [
    ConfigurationsComponent,
    DeleteBroadcastDialogComponent,
    AddBroadcastDialogComponent,
    DeleteWorkshopDialogComponent,
    EditWorkshopDialogComponent,
    DeleteProcessDialogComponent,
    DeleteBasicCauseDialogComponent,
    EditBasicCauseDialogComponent,
    DeleteImmediateCauseDialogComponent,
  ],
  imports: [CommonModule, ConfigurationsRoutingModule, MaterialModule],
})
export class ConfigurationsModule {}
