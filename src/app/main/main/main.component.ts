import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateReadyComponent } from 'src/app/shared/update-ready/update-ready.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  version$: Observable<string>;
  openedMenu = false;
  title: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );

  panelOpenState = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {

    this.version$ = this.authService.getGeneralConfigDoc().pipe(
      map(conf => {

        if (conf.version !== this.authService.version) {
          this.dialog.open(UpdateReadyComponent, {
            maxWidth: '350px',
            data: conf.version,
            disableClose: true
          })
        }
        return conf.version
      })
    )
  }

  async exitApp(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    } catch (error) {
      console.log('error');
    }
  }

}
