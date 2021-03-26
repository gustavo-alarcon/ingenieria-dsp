import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';
import { AnalysisComponent } from './analysis.component';

const routes: Routes = [
  {
    path: '',
    component: AnalysisComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./records/records.module').then(m => m.RecordsModule)
      },
      {
        path: 'records',
        loadChildren: () => import('./records/records.module').then(m => m.RecordsModule)
      },
      {
        path: 'progress',
        loadChildren: () => import('./progress/progress.module').then(m => m.ProgressModule)
      },
      {
        path: 'tracing',
        loadChildren: () => import('./tracing/tracing.module').then(m => m.TracingModule)
      },
      {
        path: 'results',
        loadChildren: () => import('./results/results.module').then(m => m.ResultsModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
