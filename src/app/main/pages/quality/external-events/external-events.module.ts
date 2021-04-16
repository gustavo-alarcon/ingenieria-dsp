import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalEventsRoutingModule } from './external-events-routing.module';
import { ExternalEventsComponent } from './external-events.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AddMiningOperationDialogComponent } from './dialogs/add-mining-operation-dialog/add-mining-operation-dialog.component';


@NgModule({
  declarations: [ExternalEventsComponent, AddMiningOperationDialogComponent],
  imports: [
    CommonModule,
    ExternalEventsRoutingModule,
    MaterialModule,
    
  ]
})
export class ExternalEventsModule { }
