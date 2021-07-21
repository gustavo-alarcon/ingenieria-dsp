import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { GeneralConfig } from './auth/models/generalConfig.model';
import { AuthService } from './auth/services/auth.service';
import { UpdateReadyComponent } from './shared/update-ready/update-ready.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private afFun: AngularFireFunctions) {
    // const callable = this.afFun.httpsCallable('setClaimsAsSuperuser');
    // callable({ uid: 'ScOzRN49bPcJYqroUlNC5aqH9P83' })
    //   .pipe(take(1))
    //   .subscribe((res) => {
    //     console.log('Done ScOzRN49bPcJYqroUlNC5aqH9P83');
        
    //     // this.snackbar.open(res, 'Aceptar', {
    //     //   duration: 6000,
    //     // });
    //   });
  }
}
