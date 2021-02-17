import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

      /*Agregar Componente para la pagina not fount*/
      // {
      //   path: '**',
      //   component: NotFoundComponent
      // }
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
