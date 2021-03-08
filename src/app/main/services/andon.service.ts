import { Andon } from './../models/andon.model';
import { Injectable } from '@angular/core';
import { User } from '../models/user-model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AndonProblemType } from '../models/andon.model';

@Injectable({
  providedIn: 'root'
})
export class AndonService {

  constructor(
             private afs: AngularFirestore,
             private storage: AngularFireStorage,
    ) { }

  /**
   * Creates the repot entry into firestore's Andon collection
   * @param {Andon} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addAndon(form: Andon, imagesObj, user: User, name: string, otChild: number): Observable<firebase.default.firestore.WriteBatch> {
     // create batch
     const batch = this.afs.firestore.batch();
     // create reference for document in andon entries collection
     const andonDocRef = this.afs.firestore.collection(`db/ferreyros/andon`).doc();
     // Structuring the data model
     const data: Andon = {
       id: andonDocRef.id,
       createdAt: new Date,
       createdBy: user,
       editedAt: null,
       edited: null,
       reportDate: new Date(),
       workShop: null,
       name: name,
       otChild: otChild,
       problemType: form.problemType,
       description: form.description,
       images: imagesObj,
       atentionTime: new Date(),
       user: user.name,
       state: 'stopped', //=> stopped //retaken
       workReturnDate: null,
       comments: null,
       returnUser: null,
     };
     batch.set(andonDocRef, data);
     return of(batch);
  }

  /**
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   */
   updateAndon(entryId: string, form ,imags): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.collection(`db/ferreyros/andon/${entryId}`).doc();
    // Structuring the data model
    const data: any = {
      problemType: null,
      description: null,
      images:null,
    };
    batch.update(evaluationDocRef, data);
    return of(batch);
  }
  /**
   * getByID the passed andon 
   * @param {string} item - filter for id
   */
   getAndonById(id: string): Observable<Andon[]> {
    return this.afs.collection<Andon>(`/db/ferreyros/andon`,
      ref => ref.where('id', '==', id))
      .valueChanges();
  }
  getProduct(id: string): Observable<Andon> {
    return this.afs.doc<Andon>(`/db/ferreyros/andon/${id}`)
      .valueChanges().pipe (shareReplay(1));
  }
  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }
  addAndonSettingsProblemType(listProblemType, user: User): Observable<firebase.default.firestore.WriteBatch> {
      const date = new Date();
      const batch = this.afs.firestore.batch();
      //listEvaluationsResult.forEach((el) => {
        const evaluationDocRef = this.afs.firestore.collection(`/db/generalConfig/andonProblemType`).doc();
  
       // if (!el.id) {
          const objAux: any = {
            id: evaluationDocRef.id,
            resultType: listProblemType,
            createdBy: user,
            createdAt: date
          };
          batch.set(evaluationDocRef, objAux);
       // }
      //});
      return of(batch);
    }

    createListBahiasAndon(listBahias, user: User): Observable<firebase.default.firestore.WriteBatch> {
      const date = new Date();
      const batch = this.afs.firestore.batch();
      //listEvaluationsResult.forEach((el) => {
        const evaluationDocRef = this.afs.firestore.collection(`/db/generalConfig/andonProblemType`).doc();
  
       // if (!el.id) {
      const objAux: any = {
            id: evaluationDocRef.id,
            resultType: listBahias,
            createdBy: user,
            createdAt: date
          };
          batch.set(evaluationDocRef, objAux);
       // }
      //});
      return of(batch);
    }
}
