import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TracingComponent } from './tracing.component';

const routes: Routes = [
  {
    path: '',
    component: TracingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracingRoutingModule { }
