import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserModel } from '../models/user-model';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  version: string;
  openedMenu = false;
  title: string;

  private itemsCollection: AngularFirestoreCollection<UserModel>;
  items: Observable<UserModel[]>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(1)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private afs: AngularFirestore,
    private activateRoute: ActivatedRoute
  ) {

    this.authService.currentUser().subscribe(
      (value) => {
        this.itemsCollection = afs.collection<UserModel>('users', ref => ref.where('uid', '==', value.uid));
        this.items = this.itemsCollection.valueChanges();
      }
    );
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
