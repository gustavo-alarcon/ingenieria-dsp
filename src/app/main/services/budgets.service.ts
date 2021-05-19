import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  rejectionReasonsEntry,
  modificationReasonEntry,
  BudgetsBroadcastList,
} from '../models/budgets.model';

import * as firebase from 'firebase/app';
import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private afs: AngularFirestore) {}

  public getAllReasonsForRejectionEntries(): Observable<
    rejectionReasonsEntry[]
  > {
    return this.afs
      .collection<rejectionReasonsEntry>(
        '/db/generalConfig/budgetsListRejectionReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public getAllReasonsForModificationEntries(): Observable<
    rejectionReasonsEntry[]
  > {
    return this.afs
      .collection<rejectionReasonsEntry>(
        '/db/generalConfig/budgetsListModificationReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public addReasonForRejectionEntry(
    listReasonsForRejection: Array<rejectionReasonsEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForRejection.forEach(
      (reasonForRejection: rejectionReasonsEntry) => {
        const listReasonsForRejectionDocumentRef = this.afs.firestore
          .collection('/db/generalConfig/budgetsListRejectionReasons')
          .doc();

        if (!reasonForRejection.id) {
          batch.set(listReasonsForRejectionDocumentRef, {
            id: listReasonsForRejectionDocumentRef.id,
            name: reasonForRejection.name,
            createdAt: date,
            createdBy: user,
          });
        }
      }
    );

    return of(batch);
  }

  public addReasonForModificationEntry(
    listReasonsForModification: Array<modificationReasonEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForModification.forEach(
      (reasonForModification: modificationReasonEntry) => {
        const listReasonsForRejectionDocumentRef = this.afs.firestore
          .collection('/db/generalConfig/budgetsListModificationReasons')
          .doc();

        if (!reasonForModification.id) {
          batch.set(listReasonsForRejectionDocumentRef, {
            id: listReasonsForRejectionDocumentRef.id,
            name: reasonForModification.name,
            createdAt: date,
            createdBy: user,
          });
        }
      }
    );

    return of(batch);
  }

  public deleteReasonsForRejectionEntry(id: string) {
    this.afs.firestore
      .collection('/db/generalConfig/budgetsListRejectionReasons')
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }

  public deleteReasonsForModificationEntry(id: string) {
    this.afs.firestore
      .collection('/db/generalConfig/budgetsListModificationReasons')
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }

  public addNewBroadcastList(
    groupName: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();

    const docRef = this.afs.firestore
      .collection('/db/generalConfig/budgetsBroadcastList')
      .doc();

    batch.set(docRef, {
      id: docRef.id,
      name: groupName,
      emailList: null,
      createdBy: user,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp(),
    });

    return of(batch);
  }

  public getAllBroadcastList(): Observable<Array<BudgetsBroadcastList>> {
    return this.afs
      .collection<BudgetsBroadcastList>(
        `/db/generalConfig/budgetsBroadcastList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  public updateBroadcastEmailList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef = this.afs.firestore.doc(
      `/db/generalConfig/budgetsBroadcastList/${entryId}`
    );
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayRemove(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(docRef, data);

    return of(batch);
  }

  public updateBroadcastList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef = this.afs.firestore.doc(
      `/db/generalConfig/budgetsBroadcastList/${entryId}`
    );

    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayUnion(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(docRef, data);

    return of(batch);
  }
}
