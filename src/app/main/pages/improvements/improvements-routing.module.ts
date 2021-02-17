import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImprovementsComponent } from './improvements.component';

const routes: Routes = [
  {
    path: '',
    component: ImprovementsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImprovementsRoutingModule { }
