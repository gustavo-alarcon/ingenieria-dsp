import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImprovementsRoutingModule } from './improvements-routing.module';
import { ImprovementsComponent } from './improvements.component';


@NgModule({
  declarations: [ImprovementsComponent],
  imports: [
    CommonModule,
    ImprovementsRoutingModule
  ]
})
export class ImprovementsModule { }
