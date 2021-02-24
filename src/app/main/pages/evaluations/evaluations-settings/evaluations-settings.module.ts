import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsSettingsRoutingModule } from './evaluations-settings-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsSettingsComponent } from './evaluations-settings.component';


@NgModule({
  declarations: [EvaluationsSettingsComponent],
  imports: [
    CommonModule,
    EvaluationsSettingsRoutingModule,
    MaterialModule
  ]
})
export class EvaluationsSettingsModule { }
