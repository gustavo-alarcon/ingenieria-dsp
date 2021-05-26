import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  rejectionReasonsEntry,
  modificationReasonEntry,
  BudgetsBroadcastList,
  budgetsExcelColumns,
} from '../models/budgets.model';

import * as firebase from 'firebase/app';
import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private afs: AngularFirestore) {}

  uploadDailyExcelBatchArray(
    list: Array<budgetsExcelColumns>,
    firestoreBudgetsSnapshot: firebase.default.firestore.QuerySnapshot<budgetsExcelColumns>
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    // Get all the woChild from the db
    let firestoreWOChildList: Array<string> = [];

    // Get all the woMain from the db
    let firestoreWOMainList: Array<string> = [];

    // Check if there are documents in the QuerySnapshot
    if (!firestoreBudgetsSnapshot.empty) {
      firestoreBudgetsSnapshot.forEach((doc) => {
        const data = doc.data();

        // Populate the arrays
        if (data.woChild) firestoreWOChildList.push(data.woChild);
        if (data.woMain) firestoreWOMainList.push(data.woMain);
      });
    }

    for (let index = 0; index < batchCount; index++) {
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        const budgetsDocRef = this.afs.firestore
          .collection(`/db/ferreyros/budgets`)
          .doc();

        const currentBudget = list[j];

        // Assign an id to the current row budget document
        currentBudget.id = budgetsDocRef.id;

        if (currentBudget.woChild) {
          // Vertify that woChild doesn't repeat in the db

          // If this array contains data then you shouldn't add data to Firestore
          const repeatedWOChildList: Array<string> = [];

          if (firestoreWOChildList.length > 0) {
            firestoreWOChildList.forEach((woChild) => {
              if (currentBudget.woChild == woChild)
                repeatedWOChildList.push(woChild);
            });
          }

          if (!(repeatedWOChildList.length > 0))
            batch.set(budgetsDocRef, currentBudget);
        } else {
          // Verify that woMain doesn't repeat in the db

          const repeatedWOMainList: Array<string> = [];

          if (firestoreWOMainList.length > 0) {
            firestoreWOMainList.forEach((woMain) => {
              if (currentBudget.woMain == woMain)
                repeatedWOMainList.push(woMain);
            });
          }

          if (!(repeatedWOMainList.length > 0))
            batch.set(budgetsDocRef, currentBudget);
        }
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  getBudgets(): Observable<budgetsExcelColumns[]> {
    const ref = this.afs.collection<budgetsExcelColumns>(
      '/db/ferreyros/budgets'
    );
    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsSnapshot(): Observable<
    firebase.default.firestore.QuerySnapshot<budgetsExcelColumns>
  > {
    const ref = this.afs.collection<budgetsExcelColumns>(
      '/db/ferreyros/budgets'
    );

    const refSnapshot = ref.get();

    return refSnapshot;
  }

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
