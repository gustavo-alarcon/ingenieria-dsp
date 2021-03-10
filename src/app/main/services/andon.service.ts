import { Injectable } from '@angular/core';
import { User } from '../models/user-model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AndonProblemType, AndonListBahias, Andon } from '../models/andon.model';

@Injectable({
  providedIn: 'root',
})
export class AndonService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
  // get all andonProblemType
  getAllAndonSettingsProblemType(): Observable<AndonProblemType[]> {
    return this.afs.collection<AndonProblemType>(`/db/generalConfig/andonProblemType`, ref => ref.orderBy('createdAt', 'asc'))
      .valueChanges();
  }
   /**
   * Creates the listProblemType entry into firestore's listProblemType collection
   * @param {AndonProblemType} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addAndonSettingsProblemType( listProblemType: AndonProblemType[], user: User ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listProblemType.forEach((el) => {
      const evaluationDocRef = this.afs.firestore.collection(`/db/generalConfig/andonProblemType`).doc();

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
  }
  deleteAndonSettingsProblemType(id: string): void {
    this.afs.firestore.collection(`/db/generalConfig/andonProblemType`).doc(id).delete().then(() => {
    }).catch((error) => {
      console.log(error);
    });
  }

  // get all andonListBahias
  getAllAndonSettingsListBahias(): Observable<AndonListBahias[]> {
    return this.afs.collection<AndonListBahias>(`/db/generalConfig/andonListBahias`, ref => ref.orderBy('createdAt', 'asc'))
      .valueChanges();
  }
  /**
   * Creates the andonListBahias entry into firestore's andonListBahias collection
   * @param {AndonListBahias} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  createListBahiasAndon(listBahias: AndonListBahias[], user: User ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listBahias['bahias'].forEach((el) => {
      const evaluationDocRef = this.afs.firestore.collection(`/db/generalConfig/andonListBahias`)
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
   getAndonByWorkShop(workShop: string): Observable<Andon[]> {
    return this.afs
      .collection<Andon>(`/db/ferreyros/andon`, (ref) =>
        ref.where('workShop', '==', workShop)
      )
      .valueChanges();
  }

  /**
   * update the evaluation entry
   * @param {string} entryId - id data
   * @param {Andon} form - Form data passed on andon edit
   * @param {string} imges - imgs
   */
   updateAndon(entryId: string, form, imags): Observable<firebase.default.firestore.WriteBatch> {

     console.log(entryId)
     console.log(form)
     console.log(imags)
     // create batch
     const batch = this.afs.firestore.batch();
      // create reference for document in evaluation entries collection
     const evaluationDocRef = this.afs.firestore
        .doc(`/db/ferreyros/andon/${entryId}`);
      // Structuring the data model
     const data: any = {
        problemType: form.problemType,
        description: form.description,
        images: imags,
      };
     batch.update(evaluationDocRef, data);

     return of(batch);
  }
  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }





  /**
   * Creates the repot entry into firestore's Andon collection
   * @param {Andon} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  addAndon(
    form: Andon,
    imagesObj,
    user: User,
    name: string,
    otChild: number
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in andon entries collection
    const andonDocRef = this.afs.firestore
      .collection(`db/ferreyros/andon`)
      .doc();
    // Structuring the data model
    const data: Andon = {
      id: andonDocRef.id,
      createdAt: new Date(),
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

  
  
  getProduct(id: string): Observable<Andon> {
    return this.afs
      .doc<Andon>(`/db/ferreyros/andon/${id}`)
      .valueChanges()
      .pipe(shareReplay(1));
  }
  
}