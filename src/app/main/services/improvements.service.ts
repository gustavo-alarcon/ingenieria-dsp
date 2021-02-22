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
    // create reference for document in improvement entries collection
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
   * Edit the improvement entry
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  editImprovementEntry(entryId: string, form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    let batch = this.afs.firestore.batch();
    // create reference for document on improvementEntries
    let improvementDocRef = this.afs.firestore.doc(`db/ferreyros/improvementEntries/${entryId}`);
    // Structuring the data model
    let data: any = {
      date: new Date(),
      name: form.name,
      component: form.component,
      model: form.model,
      description: form.description,
      criticalPart: form.criticalPart,
      rate: form.rate,
      state: 'registered',
      parts: form.parts,
      editedAt: new Date(),
      editedBy: user,
    };
    // 
    batch.update(improvementDocRef, data);

    return of(batch);
  }

  /**
   * Creates the improvement list passed into firestore's improvements collection
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  createImprovements(entryId: string, form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    let batch = this.afs.firestore.batch();
    // create reference to entry document
    let improvementEntryDocRef = this.afs.firestore.doc(`db/ferreyros/improvementEntries/${entryId}`);
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

    batch.update(improvementEntryDocRef, { state: 'validated' })

    return of(batch);
  }

  getCurrent_Improv(data: any) {
    // 
  }


  /**
   * Append setting as improvements in firestore's improvements collection
   * @param {Improvement[]} list - List of improvements uploaded by the user
   * @param {User} user - User's data in actual session
   */
  addSettings(list: Improvement[], user): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    let batch = this.afs.firestore.batch();

    list.forEach(element => {
      // create reference for document in improvements collection
      const improvementDocRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();
      // Structuring the data model
      let data: Improvement = {
        id: improvementDocRef.id,
        date: element.date ? element.date : null,
        name: element.name ? element.name : null,
        component: element.component ? element.component : null,
        model: element.model ? element.model : null,
        description: element.description ? element.description : null,
        media: element.media ? element.media : null,
        criticalPart: element.criticalPart ? element.criticalPart : null,
        rate: element.rate ? element.rate : null,
        quantity: element.quantity ? element.quantity : null,
        currentPart: element.currentPart ? element.currentPart : null,
        improvedPart: element.improvedPart ? element.improvedPart : null,
        stock: element.stock ? element.stock : null,
        availability: element.availability ? element.availability : null,
        kit: element.kit ? element.kit : null,
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
