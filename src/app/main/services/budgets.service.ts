import * as firebase from 'firebase/app';
import { budgetsExcelColumns } from './../models/budgets.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
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

  getBudgetsSnapshot(): Observable<
    firebase.default.firestore.QuerySnapshot<budgetsExcelColumns>
  > {
    const ref = this.afs.collection<budgetsExcelColumns>(
      '/db/ferreyros/budgets'
    );
    const refSnapshot = ref.get();

    return refSnapshot;
  }
}
