import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
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
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   * @param {string} imges - imgs
   * @param {User} user - imgs
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
  
}
