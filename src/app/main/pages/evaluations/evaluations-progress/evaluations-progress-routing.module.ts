import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsProgressComponent } from './evaluations-progress.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsProgressComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsProgressRoutingModule { }
