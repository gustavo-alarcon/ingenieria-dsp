import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ExternalEventsComponent } from './external-events.component';

const routes: Routes = [
  {
    path: '',
    component: ExternalEventsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    ComponentsModule

  ]
})
export class ExternalEventsRoutingModule { }
