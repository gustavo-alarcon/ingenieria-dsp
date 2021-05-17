import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user-model';
import { GeneralConfig } from 'src/app/auth/models/generalConfig.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateReadyComponent } from 'src/app/shared/update-ready/update-ready.component';
import { AngularFireFunctions } from '@angular/fire/functions';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  version$: Observable<string>;
  openedMenu = false;
  title: string;

  private itemsCollection: AngularFirestoreCollection<User>;
  items: Observable<User[]>;

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
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private afFun: AngularFireFunctions
  ) {

    this.authService.currentUser().subscribe(
      (value) => {
        this.itemsCollection = afs.collection<User>('users', ref => ref.where('uid', '==', value.uid));
        this.items = this.itemsCollection.valueChanges();
      }
    );

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

  call(): void {
    const callable = this.afFun.httpsCallable('setClaimsAsTechnician')
    callable({ uid: 'FB9fONRljPdFvxnfWGdPrLRyWzX2' })
      .pipe(
        take(1)
      ).subscribe(res => {
        console.log(res);
      })
  }

}
