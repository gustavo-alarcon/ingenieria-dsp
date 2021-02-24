import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  constructor( private afs: AngularFirestore,

  ) {}

  saveRequest(form,user:User): Observable<firebase.default.firestore.WriteBatch>{
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in improvement entries collection
    const improvementDocRef = this.afs.firestore.collection(`db/ferreyros/improvementEntries`).doc();
    // Structuring the data model
    const data: any = {
      id: improvementDocRef.id,
      date: new Date(),
      name: form.name,
      component: form.component,
      model: form.model,
      description: form.description,
      criticalPart: form.criticalPart,
      rate: form.rate,
      state: 'registered',
      parts: form.parts,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      editedBy: null,
    };

    batch.set(improvementDocRef, data);
    return of(batch);

  }
}

// TODO: methods for evaluations module
