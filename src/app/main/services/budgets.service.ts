import { shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import {
  RejectionReasonsEntry,
  ModificationReasonEntry,
  BudgetsBroadcastList,
  modificationReasonForm,
  rejectionReasonForm,
  BudgetHistoryDate,
  Budget,
  AproveEntry,
} from '../models/budgets.model';


import { User } from '../models/user-model';
import { Observable, of } from 'rxjs';

import * as firebase from 'firebase/app';
import { off } from 'node:process';
import moment from 'moment';
import { EvaluationRegistryForm } from '../models/evaluations.model';








@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private afs: AngularFirestore) {}

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
    budget: Budget,
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
     
    let data;
    // Evaluar slots disponibles

    if(!budget.motivoDeModificacion02){
        data= {
          motivoDeModificacion02: modificationData
        }
      batch.update(docRef, data);
      return of(batch);
    }
    
    if(!budget.motivoDeModificacion03){
      data= {
        motivoDeModificacion03: modificationData
      }
      batch.update(docRef, data);
      return of(batch);
     }

     if(!budget.motivoDeModificacion04){
        data= {
             motivoDeModificacion04: modificationData
          }
    batch.update(docRef, data);
    return of(batch);
     }


     
    // const data: any = {
    //   motivoDeModificacion:
    //     firebase.default.firestore.FieldValue.arrayUnion(modificationData),
    // };

    
  }

  updateRejectionReason(
    id: string,
    reason: rejectionReasonForm,
    status:string,
    user:User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    let data;
     
    const rejectionData: RejectionReasonsEntry = {
      id: docRef.id,
      name: reason.rejectionReason.name,
      detail: reason.detailReason,
      createdBy: user,
      createdAt: new Date(),
    };
      
    data = {
      motivoDelRechazo: rejectionData, 
      statusPresupuesto: status
    }

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
      ref.where('statusPresupuesto', '==', 'PDTE. APROB.')
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

  updateBudgetAprove(
    id: string,
    status: string,
    user:User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const docRef: DocumentReference = this.afs.firestore.doc(
      `/db/ferreyros/budgets/${id}`
    );

    const aproveData: AproveEntry = {
      id: docRef.id,
      createdBy: user,
      createdAt: new Date(),
    };

    const data = {
      fechaDeAprobacionORechazo:aproveData,
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

 public getDateHistory( budget: Budget): Array<BudgetHistoryDate> {
     console.log(budget);
    let tempArray = [];
    //Verificar fecha
    if ( budget.fechaAperturaChild ){
     const fecha = this.getStringFromTimestamp( budget.fechaAperturaChild )
     if ( fecha !== '---' ){
        const data: BudgetHistoryDate = {
            type: 'Fecha apertura child',
            date: fecha,
            createBy: null, 
        }
      tempArray.push(data);
     }
    } if ( budget.fechaDeAprobacionORechazo ){
      const fecha = this.getStringFromTimestamp( budget.fechaAperturaChild )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha apertura child',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     } 
    if ( budget.fechaDeFactDeTaller){
      const fecha = this.getStringFromTimestamp( budget.fechaDeFactDeTaller )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha de facturación de taller',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     } 
     if(budget.fechaDeTerminoDeRep){
      const fecha = this.getStringFromTimestamp( budget.fechaDeTerminoDeRep )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha de Termino de resp',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
     if(budget.fechaDefinicionDeCargos){
      const fecha = this.getStringFromTimestamp( budget.fechaDefinicionDeCargos )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha definición de cargos',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }

     if(budget.fechaFirstLabour){
      const fecha = this.getStringFromTimestamp( budget.fechaFirstLabour )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha first labour',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
    
     if(budget.fechaLPD){
      const fecha = this.getStringFromTimestamp( budget.fechaLPD )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha LPD',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
    
     if(budget.fechaLastLabour){
      const fecha = this.getStringFromTimestamp( budget.fechaLastLabour )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha last labour',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
     if(budget.fechaReleasedIoChild){
      const fecha = this.getStringFromTimestamp( budget.fechaReleasedIoChild )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha released io child',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
     if(budget.fechaUltimoEnvioDocumentoADM){
      const fecha = this.getStringFromTimestamp( budget.fechaUltimoEnvioDocumentoADM )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha último envío dcto (ADM)',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
     if(budget.fechaUltimoEnvioPPTO){
      const fecha = this.getStringFromTimestamp( budget.fechaUltimoEnvioPPTO )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha último envío PPTO',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }

     if(budget.fechaUltimoInput){
      const fecha = this.getStringFromTimestamp( budget.fechaUltimoInput )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha último input',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }
     
     if(budget.fechaUltimoListado){
      const fecha = this.getStringFromTimestamp( budget.fechaUltimoListado )
      if ( fecha !== '---' ){
         const data: BudgetHistoryDate = {
             type: 'Fecha último listado',
             date: fecha,
             createBy: null, 
         }
       tempArray.push(data);
      }
     }

     if(budget.motivoDeModificacion02){
      const fecha = this.getStringFromTimestamp( budget.motivoDeModificacion02.createdAt )
      const usuario = budget.motivoDeModificacion02.createdBy
      if ( fecha !== '---' ){
        const data: BudgetHistoryDate = {
            type: 'Fecha última modificación 1',
            date: fecha,
            createBy:usuario,
            description:budget.motivoDeModificacion02.name 
        }
      tempArray.push(data);
      }
     }

      if(budget.motivoDeModificacion03){
        const fecha = this.getStringFromTimestamp(budget.motivoDeModificacion03.createdAt)
        const usuario = budget.motivoDeModificacion03.createdBy
        if ( fecha !== '---' ){
          const data: BudgetHistoryDate = {
              type: 'Fecha última modificación 2',
              date: fecha,
              createBy: usuario,
              description:budget.motivoDeModificacion03.name
          }
        tempArray.push(data);
       }
      }

      if(budget.motivoDeModificacion04){
        const fecha = this.getStringFromTimestamp(budget.motivoDeModificacion04.createdAt)
        const usuario = budget.motivoDeModificacion04.createdBy
        if ( fecha !== '---' ){
          const data: BudgetHistoryDate = {
              type: 'Fecha última modificación 3',
              date: fecha,
              createBy:usuario,
              description:budget.motivoDeModificacion04.name 
          }
        tempArray.push(data);
       }
      }     

      if(budget.motivoDelRechazo){
        const fecha = this.getStringFromTimestamp(budget.motivoDelRechazo.createdAt) 
        const usuario = budget.motivoDelRechazo.createdBy
        if ( fecha !== '---' ){
          const data: BudgetHistoryDate = {
              type: 'Fecha de rechazo',
              date: fecha,
              createBy:usuario,
              description:budget.motivoDelRechazo.detail 
          }
        tempArray.push(data);
       }
      }

    console.log(tempArray);
    return tempArray;
 }

 public getStringFromTimestamp(timestamp: any): string {
  const seconds: any = timestamp;

  // If date is unvalid or doesn't exist
  if (seconds == null || seconds.seconds <= 0) return '---';

  const date: string = moment
    .utc(seconds.seconds * 1000)
    .format('DD/MM/YYYY HH:mm');
    // HH:mm:ss

  return date;
}


public getStringFromDate ( date: Date ): string{
  if(!date){
    return '---'
  }
  
  const dateString: string = moment
    .utc(date)
    .format('DD/MM/YYYY');

  return dateString;

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
