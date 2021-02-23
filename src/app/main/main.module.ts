import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../shared/components/components.module';

@NgModule({
  declarations: [
    MainComponent,

  ],
  exports: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class MainModule { }
