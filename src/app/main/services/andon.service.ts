import { Injectable } from '@angular/core';
import { User } from '../models/user-model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AndonProblemType,
  AndonListBahias,
  Andon,
} from '../models/andon.model';
import * as firebase from 'firebase/app';
import { AndonBroadcastList } from '../models/andon.model';

@Injectable({
  providedIn: 'root',
})
export class AndonService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getCurrentMonthOfViewDate(): { from: Date, to: Date } {
    const date = new Date();
    const fromMonth = date.getMonth();
    const fromYear = date.getFullYear();

    const actualFromDate = new Date(fromYear, fromMonth, 1);

    const toMonth = (fromMonth + 1) % 12;
    let toYear = fromYear;

    if (fromMonth + 1 >= 12) {
      toYear++;
    }

    const toDate = new Date(toYear, toMonth, 1);

    return { from: actualFromDate, to: toDate };
  }

  /**
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   * @param {string} imges - imgs
   * @param {User} user - imgs
   */
   addAndOn(
    form,
    workshop: string,
    nameBahia: string,
    otchild: string,
    user: User,
    imagesObj,
    emailArray
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const andonDocRef = this.afs.firestore.collection(`db/ferreyros/andon`).doc();

    // Structuring the data model
    const data: any = {
      id: andonDocRef.id,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      edited: null,
      reportDate: new Date(),
      workShop: workshop,
      name: nameBahia,
      otChild: otchild,
      problemType: form.problemType,
      description: form.description,
      images: imagesObj,
      atentionTime: null,
      reportUser: user.name,
      state: 'stopped', // => stopped //retaken
      workReturnDate: null,
      comments: null,
      returnUser: null,
      emailList: emailArray
    };
    batch.set(andonDocRef, data);

    return of(batch);
  }

  /**
   * Get all documents from evaluations collection
   */
  getAllAndon(): Observable<Andon[]> {
    return this.afs
      .collection<Andon>(`db/ferreyros/andon`, (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  // get all andonProblemType
  getAllAndonSettingsProblemType(): Observable<AndonProblemType[]> {
    return this.afs
      .collection<AndonProblemType>(
        `/db/generalConfig/andonProblemType`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }
  /**
   * Creates the listProblemType entry into firestore's listProblemType collection
   * @param {AndonProblemType} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
 /*  addAndonSettingsProblemType(
    listProblemType: AndonProblemType[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listProblemType.forEach((el) => {
      const evaluationDocRef = this.afs.firestore
        .collection(`/db/generalConfig/andonProblemType`)
        .doc();

      if (!el.id) {
        const objAux: any = {
          id: evaluationDocRef.id,
          problemType: el.problemType,
          createdBy: user,
          createdAt: date,
        };
        batch.set(evaluationDocRef, objAux);
      }
    });
    return of(batch);
  } */
  deleteAndonSettingsProblemType(id: string): void {
    this.afs.firestore
      .collection(`/db/generalConfig/andonProblemType`)
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }



  getAllAndonProblemType(): Observable<
  AndonProblemType[]
> {
  return this.afs
    .collection<AndonProblemType>(
      `/db/generalConfig/andonProblemType`,
      (ref) => ref.orderBy('createdAt', 'asc')
    )
    .valueChanges();
}

  addAndonProblemType(
    form: AndonProblemType,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfig/andonProblemType`)
      .doc();

    const data: any = {
      id: qualityDocRef.id,
      name: form.name,
      email: form.email,
      createdBy: user,
      createdAt: date,
    };
    batch.set(qualityDocRef, data);
    return of(batch);
  }

  deleteAndonProblemType(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const broadcastDocRef = this.afs.firestore.doc(
      `/db/generalConfig/andonProblemType/${id}`
    );
    //
    batch.delete(broadcastDocRef);
    return of(batch);
  }



  // get all andonListBahias
  getAllAndonSettingsListBahias(): Observable<AndonListBahias[]> {
    return this.afs
      .collection<AndonListBahias>(`/db/generalConfig/andonListBahias`, (ref) =>
        ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }
  /**
   * Delete the passed List Bahia based in his ID
   * @param {string} id - ID of the list Bahia to be removed
   */
   deleteAndonListBahia(id: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const AndonDocRef = this.afs.firestore.doc(`/db/generalConfig/andonListBahias/${id}`);
    //
    batch.delete(AndonDocRef);
    return of(batch);
  }

  /**
   * Creates the andonListBahias entry into firestore's andonListBahias collection
   * @param {AndonListBahias} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  createListBahiasAndon(
    listBahias: AndonListBahias[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listBahias['bahias'].forEach((el) => {
      const evaluationDocRef = this.afs.firestore
        .collection(`/db/generalConfig/andonListBahias`)
        .doc();
      if (!el.id) {
        const objAux: any = {
          id: evaluationDocRef.id,
          name: el.name,
          workShop: el.workShop,
          createdBy: user,
          createdAt: date,
        };
        batch.set(evaluationDocRef, objAux);
      }
    });
    return of(batch);
  }

  /**
   * getByID the passed andon
   * @param {string} item - filter for id
   */
  getAndonById(id: string): Observable<any> {
    return this.afs
      .collection<any>(`/db/ferreyros/andon`, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges();
  }
  /**
   * workShop the passed andon
   * @param {string} workShop - filter for workShop
   */
  getAndonByWorkShop(workShop: string, state: string): Observable<Andon[]> {
    return this.afs
      .collection<Andon>(`/db/ferreyros/andon`, (ref) =>
        ref.where('workShop', '==', workShop).where('state', '==', state)
      )
      .valueChanges();
  }

  /**
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   * @param {string} imges - imgs
   */
  updateAndon(
    entryId: string,
    form,
    imagesObj
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/andon/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      problemType: form.problemType,
      description: form.description,
      images: imagesObj,
    };
    batch.update(evaluationDocRef, data);

    return of(batch);
  }
  updateAndonImage(
    entryId: string,
    url: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/andon/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      images: firebase.default.firestore.FieldValue.arrayUnion(url),
    };
    batch.update(evaluationDocRef, data);

    return of(batch);
  }
  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }
  /**
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   * @param {string} imges - imgs
   * @param {User} user - imgs
   */
  updateAndonAddComments(
    andon: Andon,
    form,
    user: User,
    imagesObj
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/andon/${andon.id}`
    );
    // Structuring the data model
    const data: any = {
      editedAt: new Date(),
      edited: user,
      comments: form.comments,
      state: 'retaken', //=> stopped //retaken
      workReturnDate: new Date(),
      returnUser: user.name,
      atentionTime: andon.atentionTime,
      images: imagesObj,
    };
    batch.update(evaluationDocRef, data);

    return of(batch);
  }

  /**
   * Delete the passed Andon based in his ID
   * @param {string} id - ID of the Andon to be removed
   */
  removeAndon(id: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const AndonDocRef = this.afs.firestore.doc(`/db/ferreyros/andon/${id}`);
    //
    batch.delete(AndonDocRef);
    return of(batch);
  }

  /**
   * workShop the passed andon
   * @param {string} workShop - filter for workShop
   */
  getAndonRetaken(state: string): Observable<Andon[]> {
    return this.afs
      .collection<Andon>(`/db/ferreyros/andon`, (ref) =>
        ref.where('state', '==', state)
      )
      .valueChanges();
  }
  /**
   * workShop the passed andon
   * @param {string} workShop - filter for workShop
   */
  getAndonStopped(state: string): Observable<Andon[]> {
    return this.afs
      .collection<Andon>(`/db/ferreyros/andon`, (ref) =>
        ref.where('state', '==', state)
      )
      .valueChanges();
  }

  
  // BROADCAS LIST
  // get all EvaluationBroadcastlist
  getAllBroadcastList(): Observable<AndonBroadcastList[]> {
    return this.afs
      .collection<AndonBroadcastList>(
        `/db/generalConfig/andonBroadcastList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  updateBrodcastEmailList(
    entryId: string,
    broadcast: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/andonBroadcastList/${entryId}`
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
  updateBrodcastList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/andonBroadcastList/${entryId}`
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

  addNewBrodcastList(
    nameBroadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfig/andonBroadcastList`)
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

  deleteListBroadcast(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const broadcastDocRef = this.afs.firestore.doc(
      `/db/generalConfig/andonBroadcastList/${id}`
    );
    //
    batch.delete(broadcastDocRef);
    return of(batch);
  }
}
