import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UiConfig } from '../classes/ui-config';
@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivate {

  constructor(public authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.authService.getUserClaims()
      .pipe(
        take(1),
        tap(token => {
          if (token) {
            if (token.claims.technician) {
              // set UI permissions for technician user
              this.authService.uiConfig = new UiConfig('technician');
            } else if (token.claims.admin) {
              // set UI permissions for administrator user
              this.authService.uiConfig = new UiConfig('administrator');
            } else if (token.claims.superuser) {
              // set UI permissions for super user
              this.authService.uiConfig = new UiConfig('superuser');
            }
          }
        })
      ).subscribe()

    return this.authService.currentUser()
      .pipe(
        map((user) => user === null ? false : true),
        tap(hasUser => {
          if (!hasUser) {
            this.router.navigate(['/auth']);
          }
        })
      );
  }

}
