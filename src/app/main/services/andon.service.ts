import { Andon } from './../models/andon.model';
import { Injectable } from '@angular/core';
import { User } from '../models/user-model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AndonService {

  constructor(
             private afs: AngularFirestore,
    ) { }

  /**
   * Creates the repot entry into firestore's Andon collection
   * @param {Andon} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addAndon(form: Andon, user: User): Observable<firebase.default.firestore.WriteBatch> {
     // create batch
     const batch = this.afs.firestore.batch();
     // create reference for document in andon entries collection
     const andonDocRef = this.afs.firestore.collection(`db/ferreyros/andon`).doc();
     // Structuring the data model
     const data: Andon = {
       id: andonDocRef.id,
       createdAt: new Date,
       createdBy: user,
       editedAt: null,
       edited: null,
       reportDate: new Date(),
       workShop: null,
       name: form.name,
       otChild: form.otChild,
       problemType: null,
       description: null,
       atentionTime: new Date(),
       user: user.name,
       state: 'stopped', //=> stopped //retaken
       workReturnDate: null,
       comments: null,
       returnUser: null,
     };
     batch.set(andonDocRef, data);
     return of(batch);
   

  }
}
