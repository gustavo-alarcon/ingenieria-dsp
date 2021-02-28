import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';
import { EvaluationsComponent } from './evaluations.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./evaluations-requests/evaluations-requests.module').then(m => m.EvaluationsRequestsModule)
      },
      {
        path: 'request',
        loadChildren: () => import('./evaluations-requests/evaluations-requests.module').then(m => m.EvaluationsRequestsModule)
      },
      {
        path: 'progress',
        loadChildren: () => import('./evaluations-progress/evaluations-progress.module').then(m => m.EvaluationsProgressModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./evaluations-history/evaluations-history.module').then(m => m.EvaluationsHistoryModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./evaluations-settings/evaluations-settings.module').then(m => m.EvaluationsSettingsModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsRoutingModule { }
