import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quality, QualityTimer } from '../models/quality.model';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class QualityService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

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
    imagesObj,
    imagesObjDetail,
    objFile
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.collection(`db/ferreyros/quality`).doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      edited: null,
      eventType: 'Internal', //Internal , External
      workOrder: form.workdOrden,
      component: null,
      description: form.description,
      specialist: null,
      partNumber: form.nPart,
      workShop: form.workShop,
      enventDetail: form.eventDetail,
      packageNumber: null,
      componentHourMeter: null,
      miningOperation: null,
      correctiveActions: null,
      riskLevel: null,
      state: null,
      generalImages: imagesObj,
      detailImages: imagesObjDetail,
      question1: null,
      question2: null,
      question3: null,
      question4: null,
      file: objFile,
    };
    batch.set(qualityDocRef, data);

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
    imagesObj,
    imagesObjDetail,
    objFile
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.collection(`db/ferreyros/quality`).doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      edited: null,
      eventType: 'External', //Internal , External
      workOrder: form.workdOrden,
      component: form.component,
      description: form.description,
      specialist: form.component,
      partNumber: form.nPart,
      workShop: null,
      enventDetail: null,
      packageNumber: form.nPackage,
      componentHourMeter: form.componentHourMeter,
      miningOperation: form.miningOperation,
      correctiveActions: null,
      riskLevel: null,
      state: null,
      generalImages: imagesObj,
      detailImages: imagesObjDetail,
      question1: form.question1,
      question2: form.question2,
      question3: form.question3,
      question4: form.question4,
      file: objFile,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }
   
  getAllQualityRecords(): Observable<Quality[]> {
    return this.afs.collection<Quality>(`/db/ferreyros/quality`)
      .valueChanges()
      .pipe(
        map(list => {
          return list.sort((a, b) => a['createdAt']['seconds'] - b['createdAt']['seconds'])
        })
      )
  }

  /**
   * update the passed Quality based in his registryTimer
   * @param {string} timer - time object
   */
   addTimerInRecord(timer: QualityTimer): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in quality collection
    const qualityDocRef = this.afs.firestore.doc(`/db/generalConfig`);
    const newData = {
      registryTimer: timer,
    };

    batch.update(qualityDocRef, newData);
    return of(batch);
  }
  
}
