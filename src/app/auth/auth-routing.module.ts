import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../auth/pages/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../auth/pages/login/login.module').then(m => m.LoginModule)
      },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
