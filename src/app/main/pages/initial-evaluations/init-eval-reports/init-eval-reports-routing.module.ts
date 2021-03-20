import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateReceptionComponent } from './generate-reception/generate-reception.component';
import { InitEvalReportsComponent } from './init-eval-reports.component';

const routes: Routes = [
  {
    path: '',
    component: InitEvalReportsComponent
  },
  {
    path: 'generate-reception',
    component: GenerateReceptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitEvalReportsRoutingModule { }
