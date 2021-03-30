import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracingRoutingModule } from './tracing-routing.module';
import { TracingComponent } from './tracing.component';


@NgModule({
  declarations: [TracingComponent],
  imports: [
    CommonModule,
    TracingRoutingModule
  ]
})
export class TracingModule { }
