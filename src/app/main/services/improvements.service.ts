import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { improvementsForm, Improvement, ImprovementEntry } from '../models/improvenents.model';

import * as firebase from 'firebase';

import { User } from '../models/user-model';
@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
    private afs: AngularFirestore,
  ) { }


  getAllImprovementEntries(): Observable<Improvement[]> {
    return this.afs.collection<Improvement>(`/db/ferreyros/improvementEntries`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Creates the improvement entry into firestore's improvementEntries collection
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  createImprovementEntry(form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    let batch = this.afs.firestore.batch();
    // add improvements to batch
    // create reference for document in improvements collection
    let improvementDocRef = this.afs.firestore.collection(`db/ferreyros/improvementEntries`).doc();
    // Structuring the data model
    let data: ImprovementEntry = {
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
    // 
    batch.set(improvementDocRef, data);

    return of(batch);
  }

  /**
   * Creates the improvement list passed into firestore's improvements collection
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  createImprovements(form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    let batch = this.afs.firestore.batch();
    // add improvements to batch
    form.parts.forEach(part => {
      // create reference for document in improvements collection
      let improvementDocRef = this.afs.firestore.collection(`db/ferreyros/improvements`).doc();
      // Structuring the data model
      let data: Improvement = {
        id: improvementDocRef.id,
        date: new Date(),
        name: form.name,
        component: form.component,
        model: form.model,
        description: form.description,
        media: null,
        criticalPart: form.criticalPart,
        rate: form.rate,
        quantity: part.quantity,
        currentPart: part.currentPart,
        improvedPart: part.improvedPart,
        stock: null,
        availability: null,
        kit: part.kit,
        createdAt: new Date(),
        createdBy: user,
        editedAt: null,
        editedBy: null,
      };
      // 
      batch.set(improvementDocRef, data);
    });

    return of(batch);
  }
}
