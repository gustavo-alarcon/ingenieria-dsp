import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalEventsRoutingModule } from './internal-events-routing.module';
import { InternalEventsComponent } from './internal-events.component';


@NgModule({
  declarations: [InternalEventsComponent],
  imports: [
    CommonModule,
    InternalEventsRoutingModule
  ]
})
export class InternalEventsModule { }
