import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Improvements } from '../models/inprovenents.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  addTagDestinations(data: Improvements): void {
    /* this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => { */
    const batch = this.afs.firestore.batch();
    const improvementRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();

    const tagDestinationsData = {
      date: data.date,
      name: data.name,
      component: data.component,
      model: data.model,
      review: data.review,
      user: data.user,
      state: data.state,
      // createdBy: user,
      // editedBy: user,
      createdAt: new Date(),
      uid: improvementRef.id
    };

    batch.set(improvementRef, tagDestinationsData);
    batch.commit().then(() => {
      console.log('updated!');
    })
      .catch((err) => { console.log(err); });
    /* }) */

  }

  getAllImprovement(): Observable<any[]> {
    return this.afs.collection<any>(`/db/ferreyros/improvements`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();

  }
}
