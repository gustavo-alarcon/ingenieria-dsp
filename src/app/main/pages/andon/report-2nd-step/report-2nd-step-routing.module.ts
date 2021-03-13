import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { report2ndStepComponent } from './report-2nd-stepcomponent';
import { ComponentsModule } from 'src/app/shared/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: report2ndStepComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    ComponentsModule,
    
  ]
})
export class report2ndStepRoutingModule { }
