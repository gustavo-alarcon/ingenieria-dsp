import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalEventsComponent } from './internal-events.component';

import { ComponentsModule } from 'src/app/shared/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: InternalEventsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    ComponentsModule
  ]
})
export class InternalEventsRoutingModule { }
