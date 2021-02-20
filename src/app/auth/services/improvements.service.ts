import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
             private afs: AngularFirestore,
             ) { }
  getAllImprovement(): Observable<any[]> {
    return this.afs.collection<any>(`/db/ferreyros/improvements`,
        ref => ref.orderBy("createdAt", 'desc'))
        .valueChanges();

  }
  //Settings
  addSettings(data) {
    /* this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => { */
        const batch = this.afs.firestore.batch()
        const settingRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();
        
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
  
}
