import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationsRoutingModule } from './configurations-routing.module';
import { ConfigurationsComponent } from './configurations.component';
import { MaterialModule } from '../../../../material/material.module';


@NgModule({
  declarations: [ConfigurationsComponent],
  imports: [
    CommonModule,
    ConfigurationsRoutingModule,
    MaterialModule
  ]
})
export class ConfigurationsModule { }
