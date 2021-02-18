import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImprovementsRoutingModule } from './improvements-routing.module';
import { ImprovementsComponent } from './improvements.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    ImprovementsComponent
  ],
  exports: [
    ImprovementsComponent
  ],
  imports: [
    CommonModule,
    ImprovementsRoutingModule,
    MaterialModule
  ]
})
export class ImprovementsModule { }
