import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsageMonitorRoutingModule } from './usage-monitor-routing.module';
import { UsageMonitorComponent } from './usage-monitor.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UsageMonitorComponent],
  imports: [
    CommonModule,
    UsageMonitorRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsageMonitorModule { }
