import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalEventsRoutingModule } from './external-events-routing.module';
import { ExternalEventsComponent } from './external-events.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [ExternalEventsComponent],
  imports: [
    CommonModule,
    ExternalEventsRoutingModule,
    MaterialModule,
  ]
})
export class ExternalEventsModule { }
