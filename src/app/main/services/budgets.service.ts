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
    list: Array<budgetsExcelColumns>
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    for (let index = 0; index < batchCount; index++) {
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        const budgetsDocRef = this.afs.firestore
          .collection(`/db/ferreyros/budgets`)
          .doc();

        list[j].id = budgetsDocRef.id;

        // The for loop runs immediately to completion while all your asynchronous operations are started.
        // When they complete some time in the future and call their callbacks, the value of your loop index
        // variable i will be at its last value for all the callbacks.

        // Use .forEach() to iterate since it creates its own function closure
        // each iteration of the loop can have it's own value
        ((index: number, list: Array<budgetsExcelColumns>) => {
          this.afs.firestore
            .collection(`/db/ferreyros/budgets`)
            .where('woChild', '==', `${list[index]}`)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(doc.data());
              });
            });
          console.log(j, list);
        })(j, list);

        batch.set(budgetsDocRef, list[j]);
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }
}
