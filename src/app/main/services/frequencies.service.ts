import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { FrequencyCalc, FrequencyEntry } from '../models/frequencies.model';
import { User } from '../models/user-model';

import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FrequenciesService {

  constructor(
    private afs: AngularFirestore
  ) { }

  /**
   * Get all documents from frequenciesCalculated collection
   */
  getAllFrequenciesCalculated(): Observable<FrequencyCalc[]> {
    return this.afs.collection<FrequencyCalc>(`/db/ferreyros/frequenciesCalculated`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }

  /**
   * Calculate frequencies 
   */
   calcFrequencies(data: FrequencyEntry[], user: User): Observable<firebase.default.firestore.WriteBatch[]> {
    //  create batch
     let batch = this.afs.firestore.batch();


    let batchArray = [];

    return of(batchArray);
  }
}
