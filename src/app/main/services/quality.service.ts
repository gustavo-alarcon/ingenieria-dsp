import { Injectable, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  QualityTimer,
  QualityListSpecialist,
  QualityListResponsibleArea,
  QualityBroadcastList,
  CauseFailureList,
  WorkShopList,
} from '../models/quality.model';
import { User } from '../models/user-model';
import * as firebase from 'firebase/app';
import { EvaluationsUser } from '../models/evaluations.model';
import { logging } from 'protractor';
import { Quality, MiningOperation } from '../models/quality.model';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class QualityService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  /**
   * add internal events entry
   * @param {string} form - Form data internal events
   * @param {User} user - user
   * @param {string} imagesObj - url image general
   * @param {string} imagesObjDetail -url imge details
   * @param {string} objFile - url file
   */
  addQualityInternal(
    form,
    user: User,
    imagesGeneral,
    imagesDetail,
    dataFile
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`db/ferreyros/quality`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      createdBy: user,
      editedAt: null,
      edited: null,
      createdAt: new Date(),
      processTimer: null,
      tracingTimer: null,
      finalizedTimer: null,
      registryTimeElapsed: null,
      registryPercentageElapsed: null,
      processTimeElapsed: null,
      processPercentageElapsed: null,
      tracingTimeElapsed: null,
      tracingPercentageElapsed: null,
      eventType: 'Interno', //Interno , Externo
      fileAdditional: dataFile,
      workOrder: form.workdOrden,
      component: form.component,
      specialist: null,
      partNumber: form.nPart,
      workShop: form.workShop,
      enventDetail: form.eventDetail,
      packageNumber: null,
      componentHourMeter: null,
      miningOperation: null,
      correctiveActions: [],
      riskLevel: null,
      emailList: [],
      taskDone: 0,
      state: 'registered',
      generalImages: imagesGeneral,
      detailImages: imagesDetail,
      question1: null,
      question2: null,
      question3: null,
      question4: null,
    };
    batch.set(qualityDocRef, data);
    /* 
        emailList.forEach(el => {
          const qualityEmailDocRef = this.afs.firestore.doc(`db/ferreyros/quality/${quality.id}`);
          const data1: any = {
            emailList: firebase.default.firestore.FieldValue.arrayUnion(el)
          };
          batch.update(qualityEmailDocRef, data1);
        });
     */
    return of(batch);
  }

  /**
   * add internal events entry
   * @param {string} form - Form data internal events
   * @param {User} user - user
   * @param {string} imagesObj - url image general
   * @param {string} imagesObjDetail -url imge details
   * @param {string} objFile - url file
   */
  addQualityExternal(
    form,
    user: User,
    imagesGeneral,
    imagesDetail,
    dataFiles
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`db/ferreyros/quality`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      edited: null,
      processTimer: null,
      tracingTimer: null,
      finalizedTimer: null,
      registryTimeElapsed: null,
      registryPercentageElapsed: null,
      processTimeElapsed: null,
      processPercentageElapsed: null,
      tracingTimeElapsed: null,
      tracingPercentageElapsed: null,
      fileAdditional: dataFiles,
      eventType: 'Externo', //Interno , Externo
      workOrder: form.workdOrden,
      component: form.component,
      specialist: null,
      partNumber: form.nPart,
      workShop: null,
      enventDetail: null,
      packageNumber: form.nPackage,
      componentHourMeter: form.componentHourMeter,
      miningOperation: form.miningOperation,
      correctiveActions: [],
      riskLevel: null,
      state: 'registered',
      emailList: null,
      taskDone: 0,
      generalImages: imagesGeneral,
      detailImages: imagesDetail,
      question1: form.question1,
      question2: form.question2,
      question3: form.question3,
      question4: form.question4,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  getAllQualityByState(status: string): Observable<Quality[]> {
    return this.afs
      .collection<Quality>(`/db/ferreyros/quality`, (ref) =>
        ref.where('state', '==', status)
      )
      .valueChanges()
      .pipe(
        map((list) => {
          return list.sort(
            (a, b) => a['createdAt']['seconds'] - b['createdAt']['seconds']
          );
        })
      );
  }

  /**
   * update the passed Quality based in his registryTimer
   * @param {string} timer - time object
   */
  addTimerInRecord(
    timer: QualityTimer
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in quality collection
    const qualityDocRef = this.afs.firestore.doc(`/db/generalConfigQuality`);
    const newData = {
      registryTimer: timer,
    };

    batch.update(qualityDocRef, newData);
    return of(batch);
  }
  /**
   * update the passed Quality based in his registryTimer
   * @param {string} timer - time object
   */
  addTimerInProcess(
    timer: QualityTimer
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in quality collection
    const qualityDocRef = this.afs.firestore.doc(`/db/generalConfigQuality`);
    const newData = {
      processTimer: timer,
    };

    batch.update(qualityDocRef, newData);
    return of(batch);
  }
  addTimerInTracing(
    timer: QualityTimer
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in quality collection
    const qualityDocRef = this.afs.firestore.doc(`/db/generalConfigQuality`);
    const newData = {
      tracingTimer: timer,
    };

    batch.update(qualityDocRef, newData);
    return of(batch);
  }

  // get all QualityListSpecialist
  getAllUser(): Observable<User[]> {
    return this.afs.collection<User>(`/users`).valueChanges();
  }
  // get all QualityListSpecialist
  getAllQuality(): Observable<Quality[]> {
    return this.afs.collection<Quality>(`/db/ferreyros/quality`).valueChanges();
  }
  // get all QualityListSpecialist
  getAllQualityListSpecialist(): Observable<EvaluationsUser[]> {
    return this.afs
      .collection<EvaluationsUser>(`/evaluations-settings`, (ref) =>
        ref.where('workingArea', 'in', ['Soporte técnico', 'Confiabilidad'])
      )
      .valueChanges();
  }

  /**
   * Creates the qualityListSpecialist entry into firestore's qualityListSpecialist collection
   * @param {QualityListSpecialist} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addQualityListSpecialist(
    listSpecialist: QualityListSpecialist[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listSpecialist.forEach((el) => {
      const qualityDocRef = this.afs.firestore
        .collection(`/db/generalConfig/qualityListSpecialist`)
        .doc();

      if (!el.id) {
        const objAux: any = {
          id: qualityDocRef.id,
          name: el.name,
          email: el.email,
          role: el.role,
          picture: el.picture,
          createdBy: user,
          createdAt: date,
        };
        batch.set(qualityDocRef, objAux);
      }
    });
    return of(batch);
  }

  deleteQualityListSpecialist(id: string): void {
    this.afs.firestore
      .collection(`/db/generalConfig/qualityListSpecialist`)
      .doc(id)
      .delete()
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  }

  // get all QualityListResponsibleArea
  getAllQualityListResponsibleAreas(): Observable<
    QualityListResponsibleArea[]
  > {
    return this.afs
      .collection<QualityListResponsibleArea>(
        `/db/generalConfig/qualityListResponsibleArea`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  /**
   * Creates the qualityListSpecialist entry into firestore's qualityListSpecialist collection
   * @param {QualityListResponsibleArea} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addQualityListResponsibleAreas(
    area: QualityListResponsibleArea,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfig/qualityListResponsibleArea`)
      .doc();

    const data: any = {
      id: qualityDocRef.id,
      name: area.name,
      email: area.email,
      createdBy: user,
      createdAt: date,
    };
    batch.set(qualityDocRef, data);
    return of(batch);
  }

  deleteQualityListResponsibleAreas(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const broadcastDocRef = this.afs.firestore.doc(
      `/db/generalConfig/qualityListResponsibleArea/${id}`
    );
    //
    batch.delete(broadcastDocRef);
    return of(batch);
  }

  // get all QualityListSpecialist
  getAllBroadcastList(): Observable<QualityBroadcastList[]> {
    return this.afs
      .collection<QualityBroadcastList>(
        `/db/generalConfig/qualityBroadcastList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  addNewBrodcastList(
    nameBroadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfig/qualityBroadcastList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: nameBroadcast,
      emailList: null,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }/* 
  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  } */

  updateBrodcastList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/qualityBroadcastList/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayUnion(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  updateBrodcastEmailList(
    entryId: string,
    broadcast: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/qualityBroadcastList/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayRemove(broadcast),
      /*  editedAt: new Date(),
        edited: user, */
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  /**
   * Delete the passed broadcastList based in his ID
   * @param {string} id - ID of the Andon to be removed
   */
  deleteListBroadcast(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const broadcastDocRef = this.afs.firestore.doc(
      `/db/generalConfig/qualityBroadcastList/${id}`
    );
    //
    batch.delete(broadcastDocRef);
    return of(batch);
  }

  saveQualitySpecialist(
    quality: Quality,
    form,
    emailList,
    status: string,
    resultAnalysis,
    evaluationName
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    console.log(' resultAnalysis: ', resultAnalysis)
    console.log('    evaluationName:', evaluationName)
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection

    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${quality.id}`
    );
    // Structuring the data model
    const data: any = {
      registryTimeElapsed: quality.registryTimeElapsed,
      registryPercentageElapsed: quality.registryPercentageElapsed,
      processAt: new Date(),
      specialist: form.specialist,
      analysisQuality: form.quality.name,
      analysisCost: form.cost.name,
      analysisFrequency: form.frequency.name,
      evaluationAnalisis: resultAnalysis,
      evaluationAnalysisName: evaluationName,
      state: status,
    }

    batch.update(qualityDocRef, data);

    emailList.forEach(el => {
      const qualityEmailDocRef = this.afs.firestore.doc(`db/ferreyros/quality/${quality.id}`);
      const data1: any = {
        emailList: firebase.default.firestore.FieldValue.arrayUnion(el)
      };
      batch.update(qualityEmailDocRef, data1);
    });

    return of(batch);
  }

  /**
   * add the name addCauseFailureList
   * @param {string} form - name CauseFailureList
   * @param {User} user - User's data in actual session
   */
  addCauseFailureList(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/causeFailureList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }
  // get all CauseFailureList
  getAllCauseFailureList(): Observable<CauseFailureList[]> {
    return this.afs
      .collection<CauseFailureList>(
        `/db/generalConfigQuality/causeFailureList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteCauseFailure(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/causeFailureList/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }

  /**
   * add the name addCauseFailureList
   * @param {string} form - name CauseFailureList
   * @param {User} user - User's data in actual session
   */
  addMiningOperationList(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/miningOperationList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  // get all CauseFailureList
  getAllMiningOperationList(): Observable<MiningOperation[]> {
    return this.afs
      .collection<MiningOperation>(
        `/db/generalConfigQuality/miningOperationList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteMiningOperation(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/miningOperationList/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }


  addWorkshopList(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/workshopList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  // get all CauseFailureList
  getAllWorkshopList(): Observable<WorkShopList[]> {
    return this.afs
      .collection<WorkShopList>(
        `/db/generalConfigQuality/workshopList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteWorshop(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/workshopList/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }

  addComponentListInternal(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/componentListInternal`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  getAllComponentsListInternal(): Observable<WorkShopList[]> {
    return this.afs
      .collection<WorkShopList>(
        `/db/generalConfigQuality/componentListInternal`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteComponentInternal(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/componentListInternal/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }
  addComponentListExternal(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/componentListExternal`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  getAllComponentsListExternal(): Observable<WorkShopList[]> {
    return this.afs
      .collection<WorkShopList>(
        `/db/generalConfigQuality/componentListExternal`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteComponentExternal(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/componentListExternal/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }
  /**
   * add the name ProcessList
   * @param {string} form - name ProcessList
   * @param {User} user - User's data in actual session
   */
  addProcessList(
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfigQuality/processList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }
  // get all CauseFailureList
  getAllProcessList(): Observable<CauseFailureList[]> {
    return this.afs
      .collection<CauseFailureList>(
        `/db/generalConfigQuality/processList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  deleteProcess(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfigQuality/processList/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }

  /**
   * add the name ProcessList
   * @param {string} form - name ProcessList
   * @param {User} user - User's data in actual session
   */
  saveCorrectiveActions(
    quality: Quality,
    formAnalysis,
    formCorrective,
    emailList,
    analysis: number,
    evaluationName: string,
    status
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${quality.id}`
    );

    // Structuring the data model
    const data: any = {
      processTimeElapsed: quality.processTimeElapsed,
      processPercentageElapsed: quality.processPercentageElapsed,
      tracingAt: new Date(),
      analysis: formAnalysis,
      state: status,
      evaluationAnalisis: analysis,
      evaluationAnalysisName: evaluationName,
      correctiveActions: formCorrective.areas
    };
    batch.update(qualityDocRef, data);

    emailList.forEach(el => {
      const qualityEmailDocRef = this.afs.firestore.doc(`db/ferreyros/quality/${quality.id}`);
      const data1: any = {
        emailList: firebase.default.firestore.FieldValue.arrayUnion(el)
      };
      batch.update(qualityEmailDocRef, data1);
    });

    return of(batch);
  }

  updateQualityEvaluationAnalysis(
    quality: Quality,
    analisis: number,
    evaluationName: string,
    formAnalysis,
    formCorrective?
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${quality.id}`
    );
    // Structuring the data model
    const data: any = {
      evaluationAnalysis: analisis,
      evaluationAnalysisName: evaluationName,
      analysis: formAnalysis,
      correctiveActions: formCorrective.areas
    };

    /* formCorrective.areas.forEach(el => {
      const qualityEmailDocRef = this.afs.firestore.doc(`db/ferreyros/quality/${quality.id}`);
      const data2: any = {
        correctiveActions: firebase.default.firestore.FieldValue.arrayUnion(el)
      };
      batch.update(qualityEmailDocRef, data2);
    });
 */
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  saveNewCorrectiveActions(
    quality: Quality,
    newCorrective,
    count
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${quality.id}`
    );

    // Structuring the data model
    const data: any = {
      correctiveActions: newCorrective,
      taskDone: firebase.default.firestore.FieldValue.increment(count),
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }


  finalizedCorrectiveActions(
    quality: Quality,
    status: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${quality.id}`
    );

    // Structuring the data model
    const data: any = {
      attentionTimeElapsed: quality.attentionTimeElapsed,
      tracingTimeElapsed: quality.tracingTimeElapsed,
      tracingPercentageElapsed: quality.tracingPercentageElapsed,
      finalizedAt: new Date(),
      state: status
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  deleteQuality(
    entryId,
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${entryId}`
    );

    batch.delete(qualityDocRef);

    return of(batch);
  }

  updateQualityExternal(
    entryId,
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${entryId}`
    );

    // Structuring the data model
    const data: any = {
      editedAt: new Date(),
      edited: user,
      workOrder: form.workdOrden,
      component: form.component,
      partNumber: form.nPart,
      packageNumber: form.nPackage,
      componentHourMeter: form.componentHourMeter,
      miningOperation: form.miningOperation,
      question1: form.question1,
      question2: form.question2,
      question3: form.question3,
      question4: form.question4,
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  updateQualityInternal(
    entryId,
    form,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `db/ferreyros/quality/${entryId}`
    );

    // Structuring the data model
    const data: any = {
      editedAt: new Date(),
      edited: user,
      workOrder: form.workdOrden,
      component: form.component,
      partNumber: form.nPart,
      workShop: form.workShop,
      enventDetail: form.eventDetail,
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }

  async printQualityPdf(data: Quality) {
    let imgAddress = <const>'../../../assets/img-quality/';
    const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/ferreyros-mvp.appspot.com/o/assets%2Fwithout-image.jpg?alt=media&token=d0676f36-9c69-490c-b8e7-790e7a7038a8';;
    let doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    //Importando Plantilla
    let img = new Image(595, 842)
    img.src = imgAddress + 'report_1.png';


    //First page
    doc.addImage(img, 'PNG', 0, 0, 210, 297);
    //Setting body styles
    doc.setFontSize(10)

    //Fecha de emisión
    let emisionDate = null
    if (data.createdAt instanceof Date) {
      emisionDate = this.getDateFromSec(data.createdAt.valueOf() / 1000)
    } else {
      emisionDate = this.getDateFromSec(data.createdAt["seconds"])
    }
    doc.text(`${emisionDate.day}/${emisionDate.month}/${emisionDate.year}`, 79, 51, { align: "center" })

    //Lugar donde ocurrió
    doc.text('---', 155, 48, { align: "center" })

    //OT que reporta
    doc.text(('' + data.workOrder), 155, 57, { align: "center" })

    //Analista
    doc.text(data.specialist['name'], 79, 67, { align: "center" })

    //Colaborador del análisis
    doc.text(`---`, 155, 67, { align: "center" })

    //Talller
    doc.text(data.workShop, 72, 75, { align: "center" })

    //Área
    doc.text(`---`, 117, 75, { align: "center" })

    //Bahia
    doc.text(`---`, 162, 75, { align: "center" })

    //Tipo reha
    doc.text(data.eventType, 79, 81, { align: "center" })

    //Modelo
    doc.text('---', 155, 81, { align: "center" })

    //Componente
    doc.text(data.component, 79, 89, { align: "center" })

    //Nro de parte
    doc.text('' + data.partNumber, 155, 89, { align: "center" })

    //Descripción
    doc.text('---', 79, 97, { align: "center" })

    //Proceso
    doc.text(data.analysis ? data.analysis['process'] : '---', 135, 96, { align: "center" })

    //Modo de falla
    doc.text(
      doc.splitTextToSize('---', 100 - 59).slice(0, 2),
      58, 103, { align: "left", maxWidth: 100 - 59 })

    //Causa raíz
    doc.text(
      doc.splitTextToSize(data.analysis ? data.analysis['causeFailure'] : '---', 176 - 135).slice(0, 2),
      135, 103, { align: "left", maxWidth: 176 - 135 })

    const detailsExternalEvent = data.question1 + ' ********* ' +
      data.question2 + ' ********* ' +
      data.question3 + ' ********* ' +
      data.question4;
    //Análisis
    let eventDetails = data.enventDetail ? data.enventDetail : detailsExternalEvent;
    doc.text(
      doc.splitTextToSize(`${eventDetails}`, 176 - 58).slice(0, 18),
      58, 117, { align: "left", maxWidth: 176 - 58 })

    //Observaciones
    let observations = data.analysis ? (data.analysis['observations'] ? data.analysis['observations'] : '---') : '---'
    doc.text(
      doc.splitTextToSize(`${observations}`, 176 - 58).slice(0, 18),
      58, 157, { align: "left", maxWidth: 176 - 58 })

    //Segunda hoja
    doc.addPage("a4", "portrait")
    let img2 = new Image(595, 842)
    img2.src = imgAddress + 'report_2.png';
    doc.addImage(img2, 'PNG', 0, 11, 210, 272);

    // let imgGen = new Image(595, 842)
    // imgGen.src = imgAddress + 'timeline-s1.png';
    let image1: HTMLImageElement;
    if (data.generalImages[0]) {
      image1 = await this.getDataUri(data.generalImages[0]);
    } else {
      image1 = await this.getDataUri(defaultImage);
    }
    doc.addImage(image1, 'PNG', 28, 28, 70, 70)

    // let imgSpec = new Image(595, 842)
    // imgSpec.src = imgAddress + 'timeline-s2.png';

    let image2: HTMLImageElement;
    if (data.detailImages[0]) {
      image2 = await this.getDataUri(data.detailImages[0]);
    } else {
      image2 = await this.getDataUri(defaultImage);
    }
    doc.addImage(image2, 'PNG', 107, 28, 70, 70)

    //Tercera hoja
    doc.addPage("a4", "portrait")
    let h = 10

    //Each row
    let correctiveActions = [{
      denom: "Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación ",
      respon: "Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable ",
      area: "Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable "
    }, {
      denom: "Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación ",
      respon: "Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable ",
      area: "Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable "
    }, {
      denom: "Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación ",
      respon: "Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable ",
      area: "Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable "
    }, {
      denom: "Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación ",
      respon: "Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable ",
      area: "Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable "
    }, {
      denom: "Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación Denominación ",
      respon: "Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable Responsable ",
      area: "Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable Area responsable "
    }]


    doc.text("Acciones Correctivas:", 26, 42 - h, { align: "left" })

    //Header square
    //Horizontal line
    doc.line(26, 42, 180, 42)
    doc.line(26, 42 + h, 180, 42 + h)
    //Vertical lines
    doc.line(26, 42, 26, 42 + h)
    doc.line(107, 42, 107, 42 + h)
    doc.line(152, 42, 152, 42 + h)
    doc.line(180, 42, 180, 42 + h)

    //Text header
    doc.text(
      doc.splitTextToSize(`Denominación`, 104 - 28).slice(0, 2),
      68, 45.5, { align: "center", maxWidth: 104 - 28 })

    doc.text(
      doc.splitTextToSize(`Responsable`, 150 - 108).slice(0, 2),
      130, 45.5, { align: "center", maxWidth: 150 - 108 })

    doc.text(
      doc.splitTextToSize(`Área responsable`, 178 - 152).slice(0, 2),
      166, 45.5, { align: "center", maxWidth: 178 - 152 })

    //Text body
    data.correctiveActions.forEach((value, index) => {
      //Horizontal line
      //doc.line(26, 42, 180, 42)
      doc.line(26, 42 + h * (index + 2), 180, 42 + h * (index + 2))
      //Vertical lines
      doc.line(26, 42 + h * (index + 1), 26, 42 + h * (index + 2))
      doc.line(107, 42 + h * (index + 1), 107, 42 + h * (index + 2))
      doc.line(152, 42 + h * (index + 1), 152, 42 + h * (index + 2))
      doc.line(180, 42 + h * (index + 1), 180, 42 + h * (index + 2))
      //Text
      //Denominacion
      doc.text(
        doc.splitTextToSize(value['corrective'], 104 - 28).slice(0, 2),
        68, 45.5 + h * (index + 1), { align: "center", maxWidth: 104 - 28 })

      //Responsable
      doc.text(
        doc.splitTextToSize('---', 150 - 108).slice(0, 2),
        130, 45.5 + h * (index + 1), { align: "center", maxWidth: 150 - 108 })

      //Area
      doc.text(
        doc.splitTextToSize(value['name'], 178 - 152).slice(0, 2),
        166, 45.5 + h * (index + 1), { align: "center", maxWidth: 178 - 152 })
    })

    let responsibles = [{
      sap: "4654654654",
      name: "Juan Pérez"
    }, {
      sap: "4654654654",
      name: "Juan Pérez"
    }, {
      sap: "4654654654",
      name: "Juan Pérez"
    }, {
      sap: "4654654654",
      name: "Juan Pérez"
    }, {
      sap: "4654654654",
      name: "Juan Pérez"
    },
    ]


    doc.text("Responsables:", 26, 42 + h * (correctiveActions.length + 2), { align: "left" })
    //Header square
    //Horizontal line
    doc.line(26, 42 + h * (correctiveActions.length + 3), 180, 42 + h * (correctiveActions.length + 3))
    doc.line(26, 42 + h + h * (correctiveActions.length + 3), 180, 42 + h + h * (correctiveActions.length + 3))
    //Vertical lines
    doc.line(26, 42 + h * (correctiveActions.length + 3), 26, 42 + h * (correctiveActions.length + 4))
    doc.line(62, 42 + h * (correctiveActions.length + 3), 62, 42 + h * (correctiveActions.length + 4))
    doc.line(180, 42 + h * (correctiveActions.length + 3), 180, 42 + h * (correctiveActions.length + 4))

    //Text header
    doc.text('Código SAP', 42, 45.5 + +h * (correctiveActions.length + 3), { align: "center" })

    doc.text('Nombres y Apellidos', 120, 45.5 + +h * (correctiveActions.length + 3), { align: "center" })

    //Text body
    responsibles.forEach((value, index) => {
      //Header square
      //Horizontal line
      //doc.line(26, 42+h*(correctiveActions.length+3), 180, 42+h*(correctiveActions.length+3))
      doc.line(26, 42 + h + h * (correctiveActions.length + 3 + index + 1), 180, 42 + h + h * (correctiveActions.length + 3 + index + 1))
      //Vertical lines
      doc.line(26, 42 + h * (correctiveActions.length + 3 + index + 1), 26, 42 + h * (correctiveActions.length + 4 + index + 1))
      doc.line(62, 42 + h * (correctiveActions.length + 3 + index + 1), 62, 42 + h * (correctiveActions.length + 4 + index + 1))
      doc.line(180, 42 + h * (correctiveActions.length + 3 + index + 1), 180, 42 + h * (correctiveActions.length + 4 + index + 1))

      //Text header
      doc.text('---', 42, 45.5 + +h * (correctiveActions.length + 3 + index + 1), { align: "center" })

      doc.text('---', 120, 45.5 + +h * (correctiveActions.length + 3 + index + 1), { align: "center" })
    })

    doc.text("Link de aplicación:", 26, 42 + h * (correctiveActions.length + responsibles.length + 5), { align: "left" })
    doc.setTextColor(6, 69, 173);
    //    doc.setTextColor(0,0,255);

    doc.textWithLink('Ferreyros MVP', 26, 42 + h * (correctiveActions.length + responsibles.length + 6), { url: 'https://ferreyros-mvp.web.app/main/quality-analysis' });



    let blob = doc.output('blob');

    saveAs(blob, 'Reporte_de_calidad_' + data.workOrder + '_' + (new Date).toLocaleDateString());

  };

  getDataUri(url): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      var image = new Image();

      image.onload = () => {
        resolve(image);
      };

      image.src = url;
    })
  }

  getDateFromSec(seconds: number): {
    year: number;
    month: string;
    day: string;
    hours: number;
    minutes: string;
  } {
    let date = new Date(1970);
    date.setSeconds(seconds)
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = '' + date.getMinutes();

    if (minutes.length < 2)
      minutes = '0' + minutes;
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return { year, month, day, hours, minutes }
  }

}
