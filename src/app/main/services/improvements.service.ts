import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ImproventmentModel1 } from '../models/improvenents.model';

@Injectable({
  providedIn: 'root'
})
export class ImprovementsService {

  constructor(
    private afs: AngularFirestore,
  ) { }


  getAllImprovement(): Observable<ImproventmentModel1[]> {
    return this.afs.collection<ImproventmentModel1>(`/db/ferreyros/improvements`,
      ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges();
  }
}
