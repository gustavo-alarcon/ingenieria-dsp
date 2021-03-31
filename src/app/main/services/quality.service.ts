import { Injectable, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Quality,
  QualityTimer,
  QualityListSpecialist,
  QualityListResponsibleArea,
  QualityBroadcastList,
} from '../models/quality.model';
import { User } from '../models/user-model';
import * as firebase from 'firebase/app';
import { EvaluationsUser } from '../models/evaluations.model';

@Injectable({
  providedIn: 'root',
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
      eventType: 'Interno', //Interno , Externo
      workOrder: form.workdOrden,
      component: form.component,
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
      generalImages: firebase.default.firestore.FieldValue.arrayUnion(
        imagesObj
      ),
      detailImages: firebase.default.firestore.FieldValue.arrayUnion(
        imagesObjDetail
      ),
      question1: null,
      question2: null,
      question3: null,
      question4: null,
      file: firebase.default.firestore.FieldValue.arrayUnion(objFile),
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
      correctiveActions: null,
      riskLevel: null,
      state: null,
      generalImages: firebase.default.firestore.FieldValue.arrayUnion(
        imagesObj
      ),
      detailImages: firebase.default.firestore.FieldValue.arrayUnion(
        imagesObjDetail
      ),
      question1: form.question1,
      question2: form.question2,
      question3: form.question3,
      question4: form.question4,
      file: firebase.default.firestore.FieldValue.arrayUnion(objFile),
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  getAllQualityRecords(): Observable<Quality[]> {
    return this.afs
      .collection<Quality>(`/db/ferreyros/quality`)
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
    const qualityDocRef = this.afs.firestore.doc(`/db/generalConfig`);
    const newData = {
      registryTimer: timer,
    };

    batch.update(qualityDocRef, newData);
    return of(batch);
  }

  // get all QualityListSpecialist
  getAllUser(): Observable<User[]> {
    return this.afs.collection<User>(`/users`).valueChanges();
  }
  // get all QualityListSpecialist
  getAllQualityListSpecialist(name: string): Observable<EvaluationsUser[]> {
    return this.afs
      .collection<EvaluationsUser>(`/evaluations-settings`, (ref) =>
        ref.where('description', '==', name)
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
      .then(() => {})
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
  }
  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }

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

  /* deleteListBroadcast(id: string): void {
      this.afs.firestore
        .collection(`/db/generalConfig/qualityBroadcastList`)
        .doc(id)
        .delete()
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    } */
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
    entryId: string,
    nameSpecialist: string,
    emailList: string[],
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
      emailList: firebase.default.firestore.FieldValue.arrayUnion(emailList),
      specialist: nameSpecialist,
      editedAt: new Date(),
      edited: user,
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }
}
