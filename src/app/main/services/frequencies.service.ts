import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FrequencyCalc } from '../models/frequencies.model';

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
}
