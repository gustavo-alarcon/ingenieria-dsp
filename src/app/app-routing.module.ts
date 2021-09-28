import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainGuard } from './auth/guards/main.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canActivate: [MainGuard]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
