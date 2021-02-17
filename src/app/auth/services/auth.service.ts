import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    public http: HttpClient
  ) {

  }

  async loginGoogle(): Promise<firebase.auth.UserCredential> {
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      return error;
    }
  }

  currentUser(): Observable<firebase.User> {
    return this.auth.authState;
  }

  async logout(): Promise<void> {
     await this.auth.signOut();
  }

  getUserClaims(): Observable<firebase.auth.IdTokenResult> {
    return this.auth.idTokenResult;
  }

}
