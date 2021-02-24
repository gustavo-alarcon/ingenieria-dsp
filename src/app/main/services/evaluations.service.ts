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
    console.log('form ',form)
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
      internalStatus: 'registrado', // [registrado/solicitado, en proceso, finalizado]
      status: form.status,
      user: user.name,
      wof: form.wof,
      task: form.task,
      observations: null,
      workshop: null,
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
    console.log('data : ',data)
    batch.set(evaluationDocRef, data);
    return of(batch);

  }
}

