import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchEvaluationsComponent } from './search-evaluations/search-evaluations.component';



@NgModule({
  declarations: [
    SearchEvaluationsComponent
  ],
  exports: [
    SearchEvaluationsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ComponentsModule { }
