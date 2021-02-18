import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, pluck, shareReplay, take } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  version: string
  openedMenu: boolean = false;
  title: string ;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );

  claims$: Observable<any>;

  claims = { name: '', picture: '', email: '', role: '' };
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getClaimstUser();
  }

  async exitApp(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    } catch (error) {
      console.log('error');
    }
  }

  getClaimstUser(): void {
    this.claims$ = this.authService.getUserClaims()
      .pipe(
        take(1),
        pluck('claims')
      );
    this.claims$.subscribe((value) => {
      this.claims = value;
    });
  }



}
