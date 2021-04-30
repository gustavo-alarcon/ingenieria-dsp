import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternalEventsRoutingModule } from './internal-events-routing.module';
import { InternalEventsComponent } from './internal-events.component';
import { MaterialModule } from '../../../../material/material.module';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AddWorkshopComponent } from './dialogs/add-workshop/add-workshop.component';
import { AddComponentComponent } from './dialogs/add-component/add-component.component';


@NgModule({
  declarations: [InternalEventsComponent, AddWorkshopComponent, AddComponentComponent],
  imports: [
    CommonModule,
    InternalEventsRoutingModule,
    MaterialModule,
    Ng2ImgMaxModule
  ]
})
export class InternalEventsModule { }
