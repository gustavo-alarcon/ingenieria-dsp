import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { improvementsForm, Improvement, ImprovementEntry, SparePart } from '../models/improvenents.model';

import * as firebase from 'firebase';

import { User } from '../models/user-model';
import { map, switchMap, take } from 'rxjs/operators';
import { Replacement } from '../models/replacements.models';
@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  /**
   * Get all documents from improvementEntries collection
   */
  getAllImprovementEntries(): Observable<ImprovementEntry[]> {
    return this.afs.collection<ImprovementEntry>(`/db/ferreyros/improvementEntries`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Get all documents from improvements collection
   */
  getAllImprovements(): Observable<Improvement[]> {
    return this.afs.collection<Improvement>(`db/ferreyros/improvements`, ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Creates the improvement entry into firestore's improvementEntries collection
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  createImprovementEntry(form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in improvement entries collection
    const improvementDocRef = this.afs.firestore.collection(`db/ferreyros/improvementEntries`).doc();
    // Structuring the data model
    const data: ImprovementEntry = {
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

  /**
   * Edit the improvement entry
   * @param {improvementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  editImprovementEntry(entryId: string, form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document on improvementEntries
    const improvementDocRef = this.afs.firestore.doc(`db/ferreyros/improvementEntries/${entryId}`);
    // Structuring the data model
    const data: any = {
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
    const batch = this.afs.firestore.batch();
    // create reference to entry document
    const improvementEntryDocRef = this.afs.firestore.doc(`db/ferreyros/improvementEntries/${entryId}`);
    // add improvements to batch
    form.parts.forEach(part => {
      // create reference for document in improvements collection
      const improvementDocRef = this.afs.firestore.collection(`db/ferreyros/improvements`).doc();
      // Structuring the data model
      let availabilityArray = form.parts[0].availability.match(/(..?)/g);
      let year = parseInt(availabilityArray[2] + availabilityArray[3]);
      let month = parseInt(availabilityArray[1]) - 1;
      let day = parseInt(availabilityArray[0]);

      const data: Improvement = {
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
        stock: part.stock,
        availability: new Date(year, month, day),
        kit: part.kit,
        createdAt: new Date(),
        createdBy: user,
        editedAt: null,
        editedBy: null,
      };
      batch.set(improvementDocRef, data);
    });

    // batch.update(improvementEntryDocRef, form.parts);
    // batch.update(improvementEntryDocRef, { state: 'validated' });

    batch.update(improvementEntryDocRef, {
      parts: form.parts,
      state: 'validated'
    });

    return of(batch);
  }

/**
 * Updates improvement entry to be taged for replacement generation
 *
 * @param {string} entryId - Id of the entry to be updated
 * @param {improvementsForm} form - Actual content of the form validated
 * @param {User} user - The user who updates the entry
 * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
 * @memberof ImprovementsService
 */
updateImprovements(entryId: string, form: improvementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference to entry document
    const improvementEntryDocRef = this.afs.firestore.doc(`db/ferreyros/improvementEntries/${entryId}`);

    batch.update(improvementEntryDocRef, {
      parts: form.parts,
      state: 'replacement',
      editedAt: new Date(),
      editedBy: user
    });

    return of(batch);
  }

  /**
   * Delete the passed improvement based in his ID
   * @param {string} id - ID of the improvement to be removed
   */
  removeImprovement(id: string): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create document reference in improvements collection
    const improvementDocRef = this.afs.firestore.doc(`/db/ferreyros/improvements/${id}`);
    //
    batch.delete(improvementDocRef);

    return of(batch);
  }
  async removeImprovementFef(id: string): Promise<void> {
    await this.afs.collection(`db/ferreyros/improvementEntries/`).doc(id).delete().then(() => {
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

  /**
   * Append setting as improvements in firestore's improvements collection
   * @param {Improvement[]} list - List of improvements uploaded by the user
   * @param {User} user - User's data in actual session
   */
  addSettings(list: Improvement[], user): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    list.forEach(element => {
      // create reference for document in improvements collection
      const improvementDocRef = this.afs.firestore.collection(`/db/ferreyros/improvements`).doc();
      // Structuring the data model
      const data: Improvement = {
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

  /**
   * Check if the part number passed have stock or availability date
   * Cehck if part number had a replacement
   * @param {string} part - Part number to be evaluated
   */
  checkPart(part: any): Observable<SparePart> {

    return this.afs.collection<Improvement>(`/db/ferreyros/improvements`, ref => ref.where('improvedPart', '==', ('' + part[0])))
      .valueChanges()
      .pipe(
        take(1),
        map(res => {
          let data;

          if (res.length) {
            res.forEach(doc => {
              let evaluatedPart;

              evaluatedPart = this.evaluatePartNumber(doc);

              data = {
                description: doc.description,
                quantity: doc.quantity,
                improvedPart: doc.improvedPart,
                evaluatedPart: evaluatedPart,
                kit: doc.kit,
                match: true
              };
              console.log('There is a match in improvements collection');
            });
          } else {
            data = {
              description: part[3],
              quantity: part[1],
              improvedPart: part[0],
              evaluatedPart: part[0],
              kit: null,
              match: false
            };
            console.log('There were no coincidences in improvements collection');
          }

          return data;
        }),
        switchMap(firstEvaluation => {
          console.log(firstEvaluation);

          if (firstEvaluation.evaluatedPart === null) {
            return this.afs.collection<Replacement>(`/db/ferreyros/replacements`, ref => ref.where('replacedPart', '==', firstEvaluation.evaluatedPart))
              .valueChanges()
              .pipe(
                map(res => {
                  if (res.length) {
                    res.forEach(doc => {
                      console.log('Replacement found');

                      firstEvaluation.evaluatedPart = doc.currentPart;
                    });
                  } else {
                    console.log('There were no coincidences in replacement collection');
                  }
                  return firstEvaluation;
                })
              )
          } else {
            return of(firstEvaluation)
          }
        })
      );
  }

  evaluatePartNumber(data: Improvement): string | null {
    const availability = data.availability['seconds'] * 1000; //in milliseconds
    const now = Date.now(); //in milliseconds
    let isAvailableNow = (availability - now) > 0;

    const stock = data.stock;
    let hasStock = data.stock > 0;

    let result;

    if (hasStock && !isAvailableNow) {
      result = data.currentPart
      console.log('Met codition 1');
    }

    if (!hasStock && isAvailableNow) {
      result = data.improvedPart;
      console.log('Met codition 3');
    }

    if (hasStock && isAvailableNow) {
      if (data.criticalPart) {
        result = data.improvedPart;
        console.log('Met codition 4 - Critical');
      } else {
        result = data.currentPart;
        console.log('Met codition 4 - Non-critical');
      }
    }

    if (!hasStock && !isAvailableNow) {
      result = null;
      console.log("Met codition 2 - Let's check for replacement");
    }

    return result;
  }
}
