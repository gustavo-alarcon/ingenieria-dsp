import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/main/models/user-model';
import { shareReplay, switchMap, take } from 'rxjs/operators';
import { GeneralConfig } from '../models/generalConfig.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user$: Observable<User>;
  version$: Observable<GeneralConfig>;
  version: string = 'V4.6.7r';

  constructor(
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public http: HttpClient
  ) {
    this.user$ =
      this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.collection('users').doc<User>(user.uid)
              .valueChanges();
          } else {
            return of(null);
          }
        }),
        shareReplay(1)
      )
  }

  getGeneralConfig(): Observable<GeneralConfig> {
    return this.afs.doc<GeneralConfig>(`/db/generalConfig`)
      .valueChanges();
  }

  async loginGoogle(): Promise<firebase.auth.UserCredential> {
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      return error;
    }
  }

  currentUser(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  getUserClaims(): Observable<firebase.auth.IdTokenResult> {
    return this.afAuth.idTokenResult;
  }

  getGeneralConfigDoc(): Observable<GeneralConfig> {
    return this.afs.doc<GeneralConfig>('/db/generalConfig').valueChanges().pipe(shareReplay(1));
  }

}
