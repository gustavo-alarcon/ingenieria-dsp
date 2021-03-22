import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalEventsRoutingModule } from './external-events-routing.module';
import { ExternalEventsComponent } from './external-events.component';


@NgModule({
  declarations: [ExternalEventsComponent],
  imports: [
    CommonModule,
    ExternalEventsRoutingModule
  ]
})
export class ExternalEventsModule { }
