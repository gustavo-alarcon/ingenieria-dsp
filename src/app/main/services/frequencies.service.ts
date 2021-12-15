import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  FrequencySparePart,
  ReviewHistory,
} from '../models/frequencySparePart.model';
import { SparePart } from '../models/improvenents.model';
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
      .collection<FrequencySparePart>('db/ferreyros/frequencies', (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
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

  /**
   * Create a new sapre part frequency
   *
   * @param {Partial<FrequencySparePart>} form - Form with the new frequency
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof FrequenciesService
   */
  createFrequency(
    form: Partial<FrequencySparePart>
  ): Observable<firebase.default.firestore.WriteBatch> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        const shortUser: ShortUser = {
          uid: user.uid,
          displayName: user.name,
          email: user.email,
        };

        const batch = this.afs.firestore.batch();
        const frequenciesDocRef = this.afs.firestore
          .collection(`db/ferreyros/frequencies`)
          .doc();

        const data: FrequencySparePart = {
          id: frequenciesDocRef.id,
          partNumber: form.partNumber,
          frequency: form.frequency,
          avgQty: form.avgQty,
          minQty: form.minQty,
          maxQty: form.maxQty,
          createdAt: new Date() as Date & firebase.default.firestore.Timestamp,
          createdBy: shortUser,
          editedAt: null,
          editedBy: null,
        };

        batch.set(frequenciesDocRef, data);

        return of(batch);
      })
    );
  }

  /**
   * Edit a spare part frequency
   *
   * @param {string} frequencyId - Frequency ID
   * @param {Partial<FrequencySparePart>} form - Form with the new frequency
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof FrequenciesService
   */
  editFrequency(
    frequencyId: string,
    form: Partial<FrequencySparePart>
  ): Observable<firebase.default.firestore.WriteBatch> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        const shortUser: ShortUser = {
          uid: user.uid,
          displayName: user.name,
          email: user.email,
        };

        const batch = this.afs.firestore.batch();
        const frequenciesDocRef = this.afs.firestore.doc(
          `db/ferreyros/frequencies/${frequencyId}`
        );

        const data: Partial<FrequencySparePart> = {
          partNumber: form.partNumber,
          frequency: form.frequency,
          avgQty: form.avgQty,
          minQty: form.minQty,
          maxQty: form.maxQty,
          editedAt: new Date() as Date & firebase.default.firestore.Timestamp,
          editedBy: shortUser,
        };

        batch.update(frequenciesDocRef, data);

        return of(batch);
      })
    );
  }

  /**
   * Delete a spare part frequency
   *
   * @param {string} frequencyId - Frequency ID
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof FrequenciesService
   */
  deleteFrequency(
    frequencyId: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    const batch = this.afs.firestore.batch();
    const frequenciesDocRef = this.afs.firestore.doc(
      `db/ferreyros/frequencies/${frequencyId}`
    );

    batch.delete(frequenciesDocRef);

    return of(batch);
  }

  /**
   * Maps the frequency data to the spare part model
   *
   * @param {SparePart[]} list - List of spare parts
   * @return {*}  {Observable<SparePart[]>}
   * @memberof FrequenciesService
   */
  getMatchedFrequencies(list: SparePart[]): Observable<SparePart[]> {
    // create a part number's list
    const partNumbers = list.map((sparePart) => sparePart.evaluatedPart);
    console.log(partNumbers);

    let spareParts: SparePart[] = [...list];

    // look up for frequencies
    return this.afs
      .collection<FrequencySparePart>(`db/ferreyros/frequencies`, (ref) =>
        ref.where('partNumber', 'in', partNumbers)
      )
      .valueChanges()
      .pipe(
        switchMap((frequencies) => {
          console.log(frequencies);

          if (!frequencies) return of(spareParts);

          frequencies.forEach((frequency) => {
            const index = partNumbers.indexOf(frequency.partNumber);
            if (index >= 0) {
              spareParts[index].frequency = frequency.frequency;
            }
          });

          return of(spareParts);
        })
      );
  }

  /**
   * Save the spare part frequencies to review history
   *
   * @param {string} ot - Work Order
   * @param {SparePart[]} list - List of spare parts
   * @param {number} threshold - Threshold frequency
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof FrequenciesService
   */
  saveHistory(
    ot: string,
    list: SparePart[],
    threshold: number
  ): Observable<firebase.default.firestore.WriteBatch> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        const shortUser: ShortUser = {
          uid: user.uid,
          displayName: user.name,
          email: user.email,
        };

        const batch = this.afs.firestore.batch();
        const historyDocRef = this.afs.firestore
          .collection(`db/ferreyros/reviewHistory`)
          .doc();

        const data: ReviewHistory = {
          id: historyDocRef.id,
          ot: ot,
          spareParts: list,
          hasLowFrequency:
            list.filter((sparePart) => sparePart.frequency < threshold).length >
            0,
          createdAt: new Date() as Date & firebase.default.firestore.Timestamp,
          createdBy: shortUser,
        };

        batch.set(historyDocRef, data);

        return of(batch);
      })
    );
  }

  /**
   * Get the review history based on date
   *
   * @param {Date} from - From date
   * @param {Date} to - To date
   * @return {*}  {Observable<ReviewHistory[]>}
   * @memberof FrequenciesService
   */
  getHistory(from: Date, to: Date): Observable<ReviewHistory[]> {
    return this.afs
      .collection<ReviewHistory>(`db/ferreyros/reviewHistory`, (ref) =>
        ref
          .where('createdAt', '>=', from)
          .where('createdAt', '<=', to)
          .orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }
}
