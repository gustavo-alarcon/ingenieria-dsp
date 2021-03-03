import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user-model';
import { EvaluationRegistryForm, Evaluation, EvaluationInquiry, EvaluationFinishForm, EvaluationsUser } from '../models/evaluations.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { shareReplay, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,

  ) { }
  /**
   * Get all documents from evaluations collection
   */
  getAllEvaluations(): Observable<Evaluation[]> {
    return this.afs.collection<Evaluation>(`db/ferreyros/evaluations`, ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }
  /**
   * Creates the evaluations entry into firestore's Evaluations collection
   * @param {EvaluationRegistryForm} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  saveRequest(form: EvaluationRegistryForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.collection(`db/ferreyros/evaluations`).doc();
    // Structuring the data model
    const data: Evaluation = {
      id: evaluationDocRef.id,
      otMain: form.otMain,
      otChild: form.otChild,
      position: form.position,
      partNumber: form.partNumber,
      description: form.description,
      quantity: form.quantity,
      internalStatus: 'registered', // =>  [registered / progress /consultation / finalized]
      status: form.status,
      wof: form.wof,
      task: form.task,
      observations: null,
      workshop: form.workshop,
      images: null,
      imagesCounter: null,
      inquiries: null,
      inquiriesCounter: null,
      // registryDate: new Date(),
      registryTimer: null,
      processAt: null,
      processTimer: null,
      inquiryAt: null,
      inquiryTimer: null,
      finalizedBy: null,
      finalizedAt: null,
      result: null,
      kindOfTest: null,
      comments: null,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      editedBy: null,
    };
    batch.set(evaluationDocRef, data);
    return of(batch);
  }
  /**
   * Edit the evaluation entry
   * @param {string} entryId - id data
   * @param {evaluationForm} form - Form data passed on evaluation edit
   * @param {User} user - User's data in actual session
   */

  editRequest(entryId: string, form: EvaluationRegistryForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore.collection(`db/ferreyros/evaluations`).doc(entryId);
    // Structuring the data model
    const data: any = {
      otMain: form.otMain,
      otChild: form.otChild,
      position: form.position,
      partNumber: form.partNumber,
      description: form.description,
      quantity: form.quantity,
      // internalStatus: 'registered', // =>  [registered / progress /consultation / finalized]
      status: form.status,
      user: user.name,
      wof: form.wof,
      task: form.task,
      editedAt: new Date(),
      editedBy: user,
    };
    batch.update(evaluationDocRef, data);
    return of(batch);
  }

  /**
   * Delete the passed evaluatiion based in his ID
   * @param {string} id - ID of the evaluation to be removed
   */

  removeEvaluation(id: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const evaluationDocRef = this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(id);
    console.log(evaluationDocRef)
    //
    batch.delete(evaluationDocRef);
    return of(batch);
  }

  /**
   * update the passed evaluatiion based in his observation
   * @param {string} observation - update observation
   * @param {string} id - id data evaluations
   */
  updateObservation(id: string, observation: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();


    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/ferreyros/evaluations/${id}`);
    const newData = {
      observations: observation,
    }

    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   * Delete the passed evaluatiion based in his workShop
   * @param {string} item - filter for workShop
   */
  getAllEvaluationsByTaller(item: Evaluation): Observable<Evaluation[]> {
    return this.afs.collection<Evaluation>(`/db/ferreyros/evaluations`,
      ref => ref.where('workshop', '==', item.workshop))
      .valueChanges();
  }

  /**
   * Delete the passed evaluatiion based in his internalStatus
   * @param {string} state - filter for internalStatus
   */
  getAllEvaluationsByInternalStatus(state: string): Observable<Evaluation[]> {
    return this.afs.collection<Evaluation>(`/db/ferreyros/evaluations`,
      ref => ref.where('internalStatus', '==', state).orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Get all evaluations in process and consultation state
   */
  getAllEvaluationsInProcess(): Observable<Evaluation[]> {
    return this.afs.collection<Evaluation>(`/db/ferreyros/evaluations`,
      ref => ref.where('internalStatus', 'in', ['processed', 'consultation']).orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Delete the passed evaluatiion based in his ID
   * @param {string} data - ID of the evaluation to be removed
   * @param {string} internalStatus - change internalStatus
   */
  startRequest(id: string, state: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/ferreyros/evaluations/${id}`);
    // const evaluationDocRef = this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(data.id);
    const newData = {
      internalStatus: state,
    };
    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   * Append the passed list of evaluations in firestore's evaluations collection
   * @param {Improvement[]} list - List of evaluations uploaded by the user
   * @param {User} user - User's data in actual session
   */
  addSettings(list: Evaluation[]): Observable<firebase.default.firestore.WriteBatch[]> {

    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    for (let index = 0; index < batchCount; index++) {
      // create batch
      const batch = this.afs.firestore.batch();
      let limit = 500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        // create reference for document in improvements collection
        const evaluationDocRef = this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc();
        // Structuring the data model
        list[j].id = evaluationDocRef.id;

        batch.set(evaluationDocRef, list[j]);
      };

      batchArray.push(batch)
    }


    return of(batchArray);
  }


  async updateImagesFinalizeData(id: string, imagesObj, entry: EvaluationFinishForm): Promise<void> {
    return await this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(id)
      .set(
        {
          result: entry.result,
          kindOfTest: entry.kindOfTest,
          comments: entry.comments,
          images: imagesObj,
          internalStatus: 'finalized'
        },
        { merge: true }
      );
  }

  async updateImage(id: string, imagesObj): Promise<void> {
    return await this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(id)
      .set({ images: imagesObj }, { merge: true });
  }

  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }


  saveInquiry(form: EvaluationInquiry, user: User, id: string): Observable<firebase.default.firestore.WriteBatch> {
    // Create batch
    const batch = this.afs.firestore.batch();
    // Create references
    const inquiryDocRef = this.afs.firestore.collection(`db/ferreyros/evaluations/${id}/inquiries/`).doc();
    const evaluationDocRef = this.afs.firestore.doc(`db/ferreyros/evaluations/${id}`);

    // FIRST - Save inquiry in collection
    // Constructing inquiry data
    const sendDataInquiry = {
      id: inquiryDocRef.id,
      answer: null,
      inquiry: form.inquiry,
      answerImage: null,
      inquiryImage: form.inquiryImage,
      createdAt: new Date(),
      createdBy: user,
      answeredAt: null,
      answeredBy: null,
    };
    // Set inquiry 
    batch.set(inquiryDocRef, sendDataInquiry);


    // SECOND - Update inquiries counter and internalStatus
    // Update counter with atomic operation
    batch.update(evaluationDocRef, { inquiriesCounter: firebase.default.firestore.FieldValue.increment(1), internalStatus: 'consultation' });

    // Return batch
    return of(batch);
  }

  saveAnswer(form: EvaluationInquiry, user: User, evaluationId: string, inquiryId: string): Observable<firebase.default.firestore.WriteBatch> {
    // Create batch
    const batch = this.afs.firestore.batch();
    // Create references
    const inquiryDocRef = this.afs.firestore.doc(`db/ferreyros/evaluations/${evaluationId}/inquiries/${inquiryId}`);
    const evaluationDocRef = this.afs.firestore.doc(`db/ferreyros/evaluations/${evaluationId}`);

    // FIRST - Update inquiry document
    // Update inquiry 
    batch.update(inquiryDocRef, { answer: form.answer, answerImage: form.answerImage, answerAt: new Date(), answerBy: user });


    // SECOND - Update evaluation internalStatus
    // Update evaluation
    batch.update(evaluationDocRef, { internalStatus: 'processed' });

    // Return batch
    return of(batch);
  }

  /**
   * Get all inquiries by evaluation's id reference
   * @param {string} evaluationId - Evaluation ID
   */
  getEvaluationInquiriesById(evaluationId: string): Observable<EvaluationInquiry[]> {
    return this.afs.collection<EvaluationInquiry>(`db/ferreyros/evaluations/${evaluationId}/inquiries/`, ref => ref.orderBy('createdAt', 'asc'))
      .valueChanges();
  }

  /**
   * Get evaluation by id reference
   * @param {string} evaluationId - Evaluation ID
   */
  getEvaluationById(evaluationId: string): Observable<Evaluation> {
    return this.afs.doc<Evaluation>(`db/ferreyros/evaluations/${evaluationId}`)
      .valueChanges();
  }

  /**
   * update the passed evaluatiion based in his registryTimer
   * @param {string} state - update registryTimer
   * @param {string} id - id data evaluations
   */
  addTimerInRequest(state: string, timer: number): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/ferreyros/evaluations`);
    const newData = {
      registryTimer: timer,
    };

    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  addEvaluationsSettings(listEvaluationsSettings: EvaluationsUser[]): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listEvaluationsSettings.forEach((el) => {
      const evaluationDocRef = this.afs.firestore.collection(`/evaluations-settings`).doc();
      el.id = evaluationDocRef.id;
      el.createdAt = date;
      batch.set(evaluationDocRef, el);
    });
    return of(batch);
  }


}


/*
// Example on callable functions
import { AngularFireFunctions } from '@angular/fire/functions';

data$: Observable<any>;
constructor(private fns: AngularFireFunctions) {

    const callable = fns.httpsCallable('sendMail');
    this.data$ = callable({ name: 'Miguel' });
    this.data$.subscribe(val => {
      console.log(val);
    });

  }
*/
