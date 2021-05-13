import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { rejectionReasonsEntry } from "../models/budgets.model";

import * as firebase from 'firebase/app';
import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  /**
   *
   *
   * @param {string} entry - The rejection reason name
   * @param {User} user - The user that saves the rejection reason
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof BudgetsService
   */
  saveRejectionReasonsEntry(entry: string, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // BATCH : Un grupo de operaciones. Se puede ejecutar en segundo plano
    // TRANSACTION: Una operación atómica. Cuando bloqueas el update de un registro.

    // batch creation
    const batch = this.afs.firestore.batch();
    // document reference in firestore
    const docRejectionReasonsReference = this.afs.collection<rejectionReasonsEntry>('/db/generalConfig/budgetsListRejectionReasons').doc();
    // constructing data to be set
    const data: rejectionReasonsEntry = {
      id: docRejectionReasonsReference.ref.id,
      name: entry,
      createdBy: user,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
    }
    // batch set operation
    batch.set(docRejectionReasonsReference.ref, data);

    return of(batch);
  }
  
}
