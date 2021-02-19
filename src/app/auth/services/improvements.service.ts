import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Improvements } from '../models/inprovenents.model';
import { Observable } from 'rxjs';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
             private afs: AngularFirestore,
             ) { }

  addImprovements(data:Improvements) {
    /* this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => { */
        const batch = this.afs.firestore.batch()
        const improvementRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();
        
        let improvementData = {
          date: data.date,
          name: data.name,
          component:data.component,
          model:data.model,
          review :data.review,
          user: data.user,
          state: data.state,
         // createdBy: user,
         // editedBy: user,
          createdAt: new Date(),
          uid: improvementRef.id
        };
        
        batch.set(improvementRef, improvementData);
        batch.commit().then(() => {
          console.log("updated!");
        })
          .catch((err) => { console.log(err) });
      /* }) */

  }

  getAllImprovement(): Observable<any[]> {
    return this.afs.collection<any>(`/db/ferreyros/improvements`,
        ref => ref.orderBy("createdAt", 'desc'))
        .valueChanges();

  }

  //Settings
  addSettings(data:Settings) {
    /* this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => { */
        const batch = this.afs.firestore.batch()
        const settingRef = this.afs.firestore.collection(`/db/ferreyros/settings`).doc();
        
        let settingData = {
          date: data.date,
          name: data.name,
          component:data.component,
          model:data.model,
          half:data.half,
          qty:data.qty,
          current :data.current,
          improved: data.improved,
          description: data.description,
          stock: data.stock,
          available: data.available,
         // createdBy: user,
         // editedBy: user,
          createdAt: new Date(),
          uid: settingRef.id

        };
        
        batch.set(settingRef, settingData);
        batch.commit().then(() => {
          console.log("updated!");
        })
          .catch((err) => { console.log(err) });
      /* }) */

  }
  getAllSettings(): Observable<any[]> {
    return this.afs.collection<any>(`/db/ferreyros/settings`,
        ref => ref.orderBy("createdAt", 'desc'))
        .valueChanges();

  }
}
