import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalEventsComponent } from './internal-events.component';

const routes: Routes = [
  {
    path: '',
    component: InternalEventsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalEventsRoutingModule { }
