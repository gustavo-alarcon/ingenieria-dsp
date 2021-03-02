import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BudgetsDailyEntriesComponent } from './pages/budgets-daily-entries/budgets-daily-entries.component';

@NgModule({
  declarations: [
    MainComponent,
    BudgetsDailyEntriesComponent,
  ],
  exports: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class MainModule { }
