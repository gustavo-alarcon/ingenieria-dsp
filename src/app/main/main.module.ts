import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main/main.component';
import { ImprovementsComponent } from './pages/improvements/improvements.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SparePartsComponent } from './pages/spare-parts/spare-parts.component';

@NgModule({
  declarations: [
    MainComponent,
    ImprovementsComponent,
    SparePartsComponent,
    SettingsComponent,
  ],
  exports: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule
  ]
})
export class MainModule { }
