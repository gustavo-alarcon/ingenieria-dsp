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
} from '../models/quality.model';
import { User } from '../models/user-model';
import * as firebase from 'firebase/app';
import { EvaluationsUser } from '../models/evaluations.model';
import { logging } from 'protractor';
import { Quality } from '../models/quality.model';

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
      component: form.component.name,
      specialist: null,
      partNumber: form.nPart,
      workShop: form.workShop.name,
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
      component: form.component.name,
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

  updateQualitySpecialist(
    quality: Quality,
    nameSpecialist: string,
    emailList,
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
      registryTimeElapsed: quality.registryTimeElapsed,
      registryPercentageElapsed: quality.registryPercentageElapsed,
      processAt: new Date(),
      specialist: nameSpecialist,
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
      .collection(`/db/generalConfig/qualityCauseFailureList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.causeFailure,
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
        `/db/generalConfig/qualityCauseFailureList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
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
      .collection(`/db/generalConfig/miningOperationList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.miningOperation,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  // get all CauseFailureList
  getAllMiningOperationList(): Observable<CauseFailureList[]> {
    return this.afs
      .collection<CauseFailureList>(
        `/db/generalConfig/miningOperationList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
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
      .collection(`/db/generalConfig/qualityProcessList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: form.process,
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
        `/db/generalConfig/qualityProcessList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
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
      evaluationAnalisis: analisis,
      evaluationAnalisisName: evaluationName,
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

}
