import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsSettingsComponent } from './evaluations-settings.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsSettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsSettingsRoutingModule { }
