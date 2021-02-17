import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SparePartsComponent } from './spare-parts.component';

const routes: Routes = [
  {
    path: '',
    component: SparePartsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SparePartsRoutingModule { }
