import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/improvements/improvements.module').then(m => m.ImprovementsModule)
      },
      {
        path: 'improvements',
        loadChildren: () => import('./pages/improvements/improvements.module').then(m => m.ImprovementsModule)
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
