import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsHistoryComponent } from './evaluations-history.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsHistoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsHistoryRoutingModule { }
