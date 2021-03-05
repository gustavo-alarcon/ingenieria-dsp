import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReplacementsComponent } from './replacements.component';

const routes: Routes = [
  {
    path: '',
    component: ReplacementsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplacementsRoutingModule { }
