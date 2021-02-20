import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Improvements } from '../models/inprovenents.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  // Settings
  addSettings(data): void {
    const batch = this.afs.firestore.batch();
    const settingRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();

    const settingData = {
      date: data.date,
      name: data.name,
      component: data.component,
      model: data.model,
      half: data.half,
      qty: data.qty,
      current: data.current,
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
      console.log('updated!');
    })
      .catch((err) => { console.log(err); });

  }
  getAllImprovement(): Observable<any[]> {
    return this.afs.collection<any>(`/db/ferreyros/improvements`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  getCurrent_Improv(code) {
    return this.afs.collection('/db/ferreyros/improvements', (ref) =>
    ref.where("current", "==",code)
  ).get().pipe(
    map((snap) => {
      return snap.docs.map((el) => <Improvements>el.data());
    })
  );
  }
}
