import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { InitialEvaluation } from '../models/initialEvaluations.models';

@Injectable({
  providedIn: 'root'
})
export class InitialEvaluationsService {
  actualReception: InitialEvaluation;

  constructor(
    private afs: AngularFirestore
  ) { }

  /**
   * Get initial evaluations collection
   */
  getInitialEvaluations(): Observable<InitialEvaluation[]> {
    return this.afs.collection<InitialEvaluation>('db/ferreyros/initialEvaluationsReports', ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges()
      .pipe(
        shareReplay(1)
      );
  }

}
