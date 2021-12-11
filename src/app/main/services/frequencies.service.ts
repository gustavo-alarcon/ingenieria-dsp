import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrequencySparePart } from '../models/frequencySparePart.model';
import { ShortUser } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class FrequenciesService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

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

  /**
   * create a new set of part number's frequencies
   *
   * @param {FrequencySparePart[]} list - List of part number's frequencies
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch[]>}
   * @memberof FrequenciesService
   */
  createBulkFrequencies(
    list: Partial<FrequencySparePart>[]
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        let batchCount = Math.ceil(list.length / 500);
        let batchArray = [];

        const shortUser: ShortUser = {
          uid: user.uid,
          displayName: user.name,
          email: user.email,
        };

        for (let index = 0; index < batchCount; index++) {
          // create batch
          const batch = this.afs.firestore.batch();
          let limit =
            500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

          for (let j = 500 * index; j < limit; j++) {
            // create reference for document in replacements collection
            const frequenciesDocRef = this.afs.firestore
              .collection(`db/ferreyros/frequencies`)
              .doc();

            const data: FrequencySparePart = {
              id: frequenciesDocRef.id,
              partNumber: list[j].partNumber,
              frequency: list[j].frequency,
              avgQty: list[j].avgQty,
              minQty: list[j].minQty,
              maxQty: list[j].maxQty,
              createdAt: new Date() as Date &
                firebase.default.firestore.Timestamp,
              createdBy: shortUser,
              editedAt: null,
              editedBy: null,
            };

            console.log(data);

            batch.set(frequenciesDocRef, data);
          }

          batchArray.push(batch);
        }

        return of(batchArray);
      })
    );
  }
}
