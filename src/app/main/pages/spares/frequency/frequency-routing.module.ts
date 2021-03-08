import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrequencyComponent } from './frequency.component';

const routes: Routes = [
  {
    path: '',
    component: FrequencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrequencyRoutingModule { }
