import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main/main.component';
import { DialogValidationLogisticsComponent } from './components/dialog-validation-logistics/dialog-validation-logistics.component';
import { DialogInsertImprovementsComponent } from './components/dialog-insert-improvements/dialog-insert-improvements.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainComponent,
    DialogValidationLogisticsComponent,
    DialogInsertImprovementsComponent
  ],
  exports: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
