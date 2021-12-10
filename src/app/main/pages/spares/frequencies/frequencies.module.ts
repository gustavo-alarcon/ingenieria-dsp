import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrequenciesRoutingModule } from './frequencies-routing.module';
import { FrequenciesComponent } from './frequencies.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [FrequenciesComponent],
  imports: [
    CommonModule,
    FrequenciesRoutingModule,
    MaterialModule
  ]
})
export class FrequenciesModule { }
