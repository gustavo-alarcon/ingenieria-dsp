import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalEventsRoutingModule } from './internal-events-routing.module';
import { InternalEventsComponent } from './internal-events.component';
import { MaterialModule } from '../../../../material/material.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';


@NgModule({
  declarations: [InternalEventsComponent],
  imports: [
    CommonModule,
    InternalEventsRoutingModule,
    MaterialModule,
    Ng2ImgMaxModule
  ]
})
export class InternalEventsModule { }
