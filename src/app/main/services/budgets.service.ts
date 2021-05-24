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

    // Check if there are documents in the QuerySnapshot
    if (!firestoreBudgetsSnapshot.empty) {
      firestoreBudgetsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.woChild) firestoreWOChildList.push(data.woChild);
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

        list[j].id = budgetsDocRef.id;

        // The current BUDGET has a WO CHILD
        if (list[j].woChild) {
          // Check if WO Child already exists in db
          const repeatedWOChildList: Array<string> = [];

          // Validacion
          firestoreWOChildList.forEach((woChild: string) => {
            if (woChild == list[j].woChild) repeatedWOChildList.push(woChild);
          });
          

          // if this arr contains elements then wo child already exists in db
          if (repeatedWOChildList) {
            // ignore
          } else {
            batch.set(budgetsDocRef, list[j]);
          }
        }

        //batch.set(budgetsDocRef, list[j]);
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  search(s: string, find: string) {
    return s == find;
  }

  getBudgets(): Observable<budgetsExcelColumns[]> {
    const ref = this.afs.collection<budgetsExcelColumns>(
      '/db/ferreyros/budgets'
    );
    const refObs = ref.valueChanges();

    return refObs;
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
