import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Replacement, ReplacementsForm } from '../models/replacements.models';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class ReplacementsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  /**
   * Get all documents from improvements collection
   */
  getAllReplacements(): Observable<Replacement[]> {
    return this.afs.collection<Replacement>(`db/ferreyros/replacements`, ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Creates the improvement list passed into firestore's replacements collection
   * @param {ReplacementsForm} form - Form data passed on improvements creation
   * @param {User} user - User's data in actual session
   */
  createReplacements(form: ReplacementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    form.parts.forEach(part => {
      // create reference for document in replacements collection
      const replacementDocRef = this.afs.firestore.collection(`db/ferreyros/replacements`).doc();

      const data: Replacement = {
        id: replacementDocRef.id,
        currentPart: part.currentPart,
        replacedPart: part.replacedPart,
        description: part.description,
        kit: part.kit,
        createdAt: new Date(),
        createdBy: user,
        editedAt: null,
        editedBy: null,
      };
      batch.set(replacementDocRef, data);
    });

    return of(batch);
  }

  /**
   * Edit replacement
   * @param {Replacement} replacement - Replacement data passed on edition
   * @param {User} user - User's data in actual session
   */
  editReplacement(replacementId: string, form: ReplacementsForm, user: User): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document on replacements
    const replacementDocRef = this.afs.firestore.doc(`db/ferreyros/replacements/${replacementId}`);
    // Structuring the data model

    console.log(form);
    
    const data: any = {
      currentPart: form.parts[0].currentPart,
      replacedPart: form.parts[0].replacedPart,
      description: form.parts[0].description,
      kit: form.parts[0].kit,
      editedAt: new Date(),
      editedBy: user
    };

    batch.update(replacementDocRef, data);

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
    await this.afs.collection(`db/ferreyros/replacements/`).doc(id).delete().then(() => {
      console.log('Document successfully deleted!');
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }


}

