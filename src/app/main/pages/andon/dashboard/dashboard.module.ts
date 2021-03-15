import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../../../../material/material.module';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ChartsModule,
  ]
})
export class DashboardModule { }
