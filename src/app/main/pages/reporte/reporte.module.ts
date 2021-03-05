import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing.module';
import { ReporteComponent } from './reporte.component';
import { MaterialModule } from '../../../material/material.module';


@NgModule({
  declarations: [ReporteComponent],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MaterialModule,
  ]
})
export class ReporteModule { }
