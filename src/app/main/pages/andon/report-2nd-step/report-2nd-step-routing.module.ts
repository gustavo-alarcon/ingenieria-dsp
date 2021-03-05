import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { report2ndStepComponent } from './report-2nd-stepcomponent';

const routes: Routes = [
  {
    path: '',
    component: report2ndStepComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class report2ndStepRoutingModule { }
