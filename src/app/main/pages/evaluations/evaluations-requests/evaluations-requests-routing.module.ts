import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsRequestsComponent } from './evaluations-requests.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsRequestsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsRequestsRoutingModule { }
