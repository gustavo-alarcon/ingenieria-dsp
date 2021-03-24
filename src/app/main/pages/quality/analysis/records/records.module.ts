import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent } from './records.component';


@NgModule({
  declarations: [RecordsComponent],
  imports: [
    CommonModule,
    RecordsRoutingModule
  ]
})
export class RecordsModule { }
