import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrequenciesComponent } from './frequencies.component';

const routes: Routes = [
  {
    path: '',
    component: FrequenciesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrequenciesRoutingModule {}
