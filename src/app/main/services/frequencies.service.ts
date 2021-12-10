import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FrequencySparePart } from '../models/frequencySparePart.model';

@Injectable({
  providedIn: 'root',
})
export class FrequenciesService {
  constructor(private afs: AngularFirestore) {}

  /**
   * Get all spare parts frequencies
   *
   * @return {*}  {Observable<FrequencySparePart[]>}
   * @memberof FrequenciesService
   */
  getAllFrequencies(): Observable<FrequencySparePart[]> {
    return this.afs
      .collection<FrequencySparePart>('db/ferreyros/frequencies')
      .valueChanges();
  }
}
