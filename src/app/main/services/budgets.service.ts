import { map, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import {
  RejectionReasonsEntry,
  ModificationReasonEntry,
  BudgetsBroadcastList,
  Budget,
  modificationReasonForm,
  rejectionReasonForm,
} from '../models/budgets.model';

import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private afs: AngularFirestore) {}

  checkBudgetConflicts(entry: Budget): Observable<{
    isDuplicated: boolean;
    canUpgrade: boolean;
    fields: {};
  }> {
    const budgetsRef = this.afs
      .collection<Budget>(`db/ferreyros/budgets`, (ref) =>
        ref
          .where('woMain', '==', entry.woMain)
          .where('woChild', '==', entry.woChild)
      )
      .valueChanges();

    return budgetsRef.pipe(
      map((res) => {
        let isDuplicated = false;
        let canUpgrade = false;
        let fields: Partial<Budget>;

        if (res.length) {
          // Duplicated entry
          isDuplicated = true;

          // Now check for different fields
          fields = this.checkBudgetUpgrades(entry, res[0]);

          if (Object.entries(fields).length) canUpgrade = true;
        }

        return {
          isDuplicated: isDuplicated,
          canUpgrade: canUpgrade,
          fields: fields,
          applyUpgrade: false,
        };
      })
    );
  }

  checkBudgetUpgrades(
    newBudget: Budget,
    actualBudget: Budget
  ): Partial<Budget> {
    let budgetDifferences: Partial<Budget> = {};

    if (newBudget.taller !== actualBudget.taller) {
      budgetDifferences.taller = actualBudget.taller;
    }

    if (newBudget.woMain !== actualBudget.woMain) {
      budgetDifferences.woMain = actualBudget.woMain;
    }

    if (newBudget.ioMain !== actualBudget.ioMain) {
      budgetDifferences.ioMain = actualBudget.ioMain;
    }

    if (newBudget.woChild !== actualBudget.woChild) {
      budgetDifferences.woChild = actualBudget.woChild;
    }

    if (newBudget.statusWoChild !== actualBudget.statusWoChild) {
      budgetDifferences.statusWoChild = actualBudget.statusWoChild;
    }

    if (newBudget.otTaller !== actualBudget.otTaller) {
      budgetDifferences.otTaller = actualBudget.otTaller;
    }

    if (newBudget.otMadre !== actualBudget.otMadre) {
      budgetDifferences.otMadre = actualBudget.otMadre;
    }

    if (newBudget.fechaAperturaChild.getTime() > actualBudget.fechaAperturaChild.toMillis()) {
      budgetDifferences.fechaAperturaChild = actualBudget.fechaAperturaChild;
    }

    return budgetDifferences;
  }

  uploadDailyExcelBatchArray(
    list: Array<Budget>,
    firestoreBudgetsSnapshot: firebase.default.firestore.QuerySnapshot<Budget>
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    // Get all the woChild from the db
    let firestoreWOChildList: Array<number> = [];

    // Get all the woMain from the db
    let firestoreWOMainList: Array<number> = [];

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
          const repeatedWOChildList: Array<number> = [];

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

          const repeatedWOMainList: Array<number> = [];

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

  uploadDailyEntries(
    list: Array<Budget>
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

        const currentBudget = list[j];

        // Assign an id to the current row budget document
        currentBudget.id = budgetsDocRef.id;

        if (!currentBudget['duplicated']) {
          batch.set(budgetsDocRef, currentBudget);
        }
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  updateBudgetFields(
    id: string,
    fields: object
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    batch.update(docRef, fields);
    return of(batch);
  }

  updateModifyReason(
    id: string,
    reason: modificationReasonForm,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    const modificationData: ModificationReasonEntry = {
      id: docRef.id,
      name: reason.modificationReason.name,
      createdBy: user,
      additionals: reason.additionals,
      createdAt: new Date(),
    };
    const data: any = {
      motivoDeModificacion:
        firebase.default.firestore.FieldValue.arrayUnion(modificationData),
      statusPresupuesto: 'PPTO. MODIFICADO',
    };

    batch.update(docRef, data);
    return of(batch);
  }

  updateRejectionReason(
    id: string,
    reason: rejectionReasonForm,
    status: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );
    console.log(reason);
    const rejectionData: RejectionReasonsEntry = {
      id: docRef.id,
      name: reason.rejectionReason.name,
      detail: reason.detailReason,
      createdBy: user,
      createdAt: new Date(),
    };
    const data: any = {
      motivoDelRechazo: rejectionData,
      statusPresupuesto: status,
    };

    batch.update(docRef, data);
    return of(batch);
  }

  getBudgets(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets');
    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsPendingSend(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets', (ref) =>
      ref.where('statusPresupuesto', '==', 'PDTE. ENVÍO PPTO.')
    );

    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsPendingApproval(): Observable<Budget[]> {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets', (ref) =>
      ref.where('statusPresupuesto', 'in', ['PDTE. APROB.', 'PPTO. MODIFICADO'])
    );

    return ref.valueChanges().pipe(shareReplay(1));
  }

  getBudgetsSnapshot(): Observable<
    firebase.default.firestore.QuerySnapshot<Budget>
  > {
    const ref = this.afs.collection<Budget>('/db/ferreyros/budgets');

    const refSnapshot = ref.get();

    return refSnapshot;
  }

  updateBudgetStatus(
    id: string,
    status: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    const data = {
      statusPresupuesto: status,
    };

    batch.update(docRef, data);

    return of(batch);
  }

  public getAllReasonsForRejectionEntries(): Observable<
    RejectionReasonsEntry[]
  > {
    return this.afs
      .collection<RejectionReasonsEntry>(
        '/db/generalConfig/budgetsListRejectionReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public getAllReasonsForModificationEntries(): Observable<
    ModificationReasonEntry[]
  > {
    return this.afs
      .collection<ModificationReasonEntry>(
        '/db/generalConfig/budgetsListModificationReasons',
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  public addReasonForRejectionEntry(
    listReasonsForRejection: Array<RejectionReasonsEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForRejection.forEach(
      (reasonForRejection: RejectionReasonsEntry) => {
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
    listReasonsForModification: Array<ModificationReasonEntry>,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = firebase.default.firestore.FieldValue.serverTimestamp();
    const batch: firebase.default.firestore.WriteBatch =
      this.afs.firestore.batch();

    listReasonsForModification.forEach(
      (reasonForModification: ModificationReasonEntry) => {
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

  public deleteBudget(id: string): Observable<Promise<void>> {
    return of(
      this.afs.firestore.collection('/db/ferreyros/budgets').doc(id).delete()
    );
  }
}
