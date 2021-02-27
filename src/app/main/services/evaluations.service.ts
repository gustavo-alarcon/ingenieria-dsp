import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user-model';
import { EvaluationRegistryForm, Evaluation, EvaluationInquiry } from '../models/evaluations.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  constructor( private afs: AngularFirestore,

  ) {}
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
  saveRequest(form:EvaluationRegistryForm,user:User): Observable<firebase.default.firestore.WriteBatch>{
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
      user: user.name,
      wof: form.wof,
      task: form.task,
      observations: null,
      workshop: form.workshop,
      images: null,
      imagesCounter: null,
      inquiries: null ,
      inquiriesCounter: null,
      registryDate: new Date(),
      registryTime: null,
      processDate: null,
      processTimer: null,
      inquiryDate: null,
      inquiryTimer: null,
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
  editRequest(entryId: string, form: EvaluationRegistryForm, user: User): Observable<firebase.default.firestore.WriteBatch>{
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
    // create document reference in evaluation collection
    //const evaluationDocRef = this.afs.firestore.doc(`/db/ferreyros/evaluations/${id}`);
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
  updateObservation( id: string , observation: string): Observable<firebase.default.firestore.WriteBatch> {
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
   * Delete the passed evaluatiion based in his internalStatus
   * @param {string} state - filter for internalStatus
   */
  getAllEvaluationsByInternalStatus(state: string): Observable<Evaluation[]> {
    return this.afs.collection<Evaluation>(`/db/ferreyros/evaluations`,
      ref => ref.where('internalStatus', '==', state).orderBy('createdAt', 'desc'))
      .valueChanges();
  }

   /**
   * Delete the passed evaluatiion based in his ID
   * @param {string} data - ID of the evaluation to be removed
   * @param {string} internalStatus - change internalStatus
   */
  startRequest( id:string , state: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/ferreyros/evaluations/${id}`);
    //const evaluationDocRef = this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(data.id);
    const newData = {
      internalStatus: state,
    };
    batch.update(evaluationDocRef, newData);
    return of(batch);
  }
}

