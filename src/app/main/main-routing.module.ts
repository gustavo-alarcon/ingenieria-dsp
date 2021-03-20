import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '../shared/landing/landing.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'improvements',
        loadChildren: () => import('./pages/spares/improvements/improvements.module').then(m => m.ImprovementsModule)
      },
      {
        path: 'replacements',
        loadChildren: () => import('./pages/spares/replacements/replacements.module').then(m => m.ReplacementsModule)
      },
      {
        path: 'summary',
        loadChildren: () => import('./pages/spares/summary/summary.module').then(m => m.SummaryModule)
      },
      {
        path: 'spare-parts',
        loadChildren: () => import('./pages/spares/spare-parts/spare-parts.module').then(m => m.SparePartsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/spares/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'evaluations',
        loadChildren: () => import('./pages/evaluations/evaluations.module').then(m => m.EvaluationsModule)
      },
      {
        path: 'budgets-daily-entries',
        loadChildren: () => import('./pages/budgets/budgets-daily-entries/budgets-daily-entries.module').then(m => m.BudgetsDailyEntriesModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/andon/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'andon-record',
        loadChildren: () => import('./pages/andon/record/record.module').then(m => m.RecordModule)
      },
      {
        path: 'andon-reports/:code',
        loadChildren: () => import('./pages/andon/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./pages/andon/report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'reporte/:id',
        loadChildren: () => import('./pages/andon/report-2nd-step/report-2nd-step.module').then(m => m.report2ndStepModule)
      },
      {
        path: 'andon-settings',
        loadChildren: () => import('./pages/andon/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'init-eval-reports',
        loadChildren: () => import('./pages/initial-evaluations/init-eval-reports/init-eval-reports.module').then(m => m.InitEvalReportsModule)
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
