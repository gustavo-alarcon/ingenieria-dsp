import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { SparePartsComponent } from './spare-parts.component';


@NgModule({
  declarations: [SparePartsComponent],
  imports: [
    CommonModule,
    SparePartsRoutingModule
  ]
})
export class SparePartsModule { }
