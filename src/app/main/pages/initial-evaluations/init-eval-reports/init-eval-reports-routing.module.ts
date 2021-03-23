import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { GenerateDispatchComponent } from './generate-dispatch/generate-dispatch.component';
import { GenerateReceptionComponent } from './generate-reception/generate-reception.component';
import { InitEvalReportsComponent } from './init-eval-reports.component';

const routes: Routes = [
  {
    path: '',
    component: InitEvalReportsComponent
  },
  {
    path: 'generate-reception',
    component: GenerateReceptionComponent
  },
  {
    path: 'generate-dispatch',
    component: GenerateDispatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    ComponentsModule
  ]
})
export class InitEvalReportsRoutingModule { }
