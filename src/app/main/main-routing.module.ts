import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '../shared/landing/landing.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { MainComponent } from './main/main.component';
import { DashboardModule } from './pages/dashboard/dashboard.module';

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
        loadChildren: () => import('./pages/improvements/improvements.module').then(m => m.ImprovementsModule)
      },
      {
        path: 'replacements',
        loadChildren: () => import('./pages/replacements/replacements.module').then(m => m.ReplacementsModule)
      },
      {
        path: 'summary',
        loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule)
      },
      {
        path: 'spare-parts',
        loadChildren: () => import('./pages/spare-parts/spare-parts.module').then(m => m.SparePartsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'evaluations',
        loadChildren: () => import('./pages/evaluations/evaluations.module').then(m => m.EvaluationsModule)
      },
      {
        path: 'budgets-daily-entries',
        loadChildren: () => import('./pages/budgets-daily-entries/budgets-daily-entries.module').then(m => m.BudgetsDailyEntriesModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'andon-reports',
        loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)
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
