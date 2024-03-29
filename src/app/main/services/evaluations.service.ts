import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user-model';
import {
  EvaluationRegistryForm,
  Evaluation,
  EvaluationInquiry,
  EvaluationFinishForm,
  EvaluationsUser,
  EvaluationsBroadcastUser,
  EvaluationsResultTypeUser,
  EvaluationTimer,
  EvaluationsKindOfTest,
  EvaluationBroadcastList,
} from '../models/evaluations.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EvaluationsService {
  public priorityList = [
    'MONOBLOCK',
    'CARTER',
    'CYLINDER HEAD',
    'HOUSING FRONT',
    'CRANKSHAFT',
  ];

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth
  ) {}

  /**
   * Get all documents from evaluations collection
   */
  //where('createAt','>=',start)

  getAllEvaluations(start?: Date, end?: Date): Observable<Evaluation[]> {
    if (start && end) {
      return this.afs
        .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
          ref.where('createdAt', '>=', start).where('createdAt', '<=', end)
        )
        .valueChanges();
      // .pipe(
      //   map((list) => {
      //     const data: Evaluation[] = [];
      //     list.forEach(el => {
      //       this.getEvaluationInquiryById(el.id).subscribe(
      //         (res) => {
      //           let inquiry;
      //           res.forEach((valor, index, arr) => {
      //             inquiry = {
      //               ...inquiry,
      //             ['question' + index]: valor.inquiry,
      //             ['answer' + index]: valor.answer,
      //             };
      //           });
      //           const arrayJoin = {
      //             ...el,
      //             inquiries: inquiry
      //           };
      //           data.push(arrayJoin);
      //       });
      //     });

      //     return data.sort(
      //       (a, b) => b['createdAt']['seconds'] - a['createdAt']['seconds']
      //     );
      //   })
      // );
    } else {
      return this.afs
        .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
          ref.orderBy('createdAt', 'asc')
        )
        .valueChanges();
    }
  }

  getAllEvaluationInquiry(): Observable<EvaluationInquiry[]> {
    return this.afs
      .collectionGroup<EvaluationInquiry>('inquiries', (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  getEvaluationInquiryById(
    idEvaluation: string
  ): Observable<EvaluationInquiry[]> {
    return this.afs
      .collection<EvaluationInquiry>(
        `/db/ferreyros/evaluations/${idEvaluation}/inquiries`
      )
      .valueChanges()
      .pipe(take(1));
  }

  getAllEvaluationsOrderByAsc(): Observable<Evaluation[]> {
    return this.afs
      .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
        ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  getCurrentMonthOfViewDate(): { from: Date; to: Date } {
    const date = new Date();
    const fromMonth = date.getMonth();
    const fromYear = date.getFullYear();

    const actualFromDate = new Date(fromYear, fromMonth, 1);

    const toMonth = (fromMonth + 1) % 12;
    let toYear = fromYear;

    if (fromMonth + 1 >= 12) {
      toYear++;
    }

    const toDate = new Date(toYear, toMonth, 1);
    return { from: actualFromDate, to: toDate };
  }
  /**
   * Creates the evaluations entry into firestore's Evaluations collection
   * @param {EvaluationRegistryForm} form - Form data passed on request creation
   * @param {User} user - User's data in actual session
   */
  saveRequest(
    form: EvaluationRegistryForm,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore
      .collection(`db/ferreyros/evaluations`)
      .doc();
    // Structuring the data model
    const data: Evaluation = {
      id: evaluationDocRef.id,
      otMain: '',
      otChild: form.otChild ? form.otChild : '',
      position: 0,
      partNumber: form.partNumber ? form.partNumber : '',
      description: form.description ? form.description : '',
      quantity: 1,
      internalStatus: 'registered', // =>  [registered / progress /consultation / finalized]
      status: null,
      wof: form.wof ? form.wof : '',
      task: '',
      observations: form.observations ? form.observations : '',
      workshop: form.workshop ? form.workshop : '',
      images: null,
      imagesCounter: null,
      inquiries: null,
      inquiriesCounter: null,
      // registryDate: new Date(),
      registryTimer: null,
      processAt: null,
      processTimer: null,
      inquiryAt: null,
      finalizedBy: null,
      finalizedAt: null,
      result: null,
      kindOfTest: 'PPM',
      comments: null,
      createdAt: new Date(),
      createdBy: user,
      editedAt: null,
      editedBy: null,
    };
    batch.set(evaluationDocRef, data);
    return of(batch);
  }

  /**
   * Edit the evaluation entry
   * @param {string} entryId - id data
   * @param {evaluationForm} form - Form data passed on evaluation edit
   * @param {User} user - User's data in actual session
   */
  editRequest(
    entryId: string,
    form: EvaluationRegistryForm,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const evaluationDocRef = this.afs.firestore
      .collection(`db/ferreyros/evaluations`)
      .doc(entryId);
    // Structuring the data model
    const data: any = {
      otMain: form.otMain,
      otChild: form.otChild,
      position: form.position,
      partNumber: form.partNumber,
      description: form.description,
      quantity: form.quantity,
      // internalStatus: 'registered', // =>  [registered / progress /consultation / finalized]
      status: form.status,
      user: user.name,
      wof: form.wof,
      task: form.task,
      editedAt: new Date(),
      editedBy: user,
      result: form.result,
      comments: form.comments,
      kindOfTest: form.kindOfTest,
      length: form.length,
      extends: form.extends,
      // Agrregar lista Length Extend
    };
    batch.update(evaluationDocRef, data);
    return of(batch);
  }

  /**
   * Delete the passed evaluatiion based in his ID
   * @param {string} id - ID of the evaluation to be removed
   */
  removeEvaluation(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const evaluationDocRef = this.afs.firestore
      .collection(`/db/ferreyros/evaluations`)
      .doc(id);
    console.log(evaluationDocRef);
    //
    batch.delete(evaluationDocRef);
    return of(batch);
  }

  /**
   * update the passed evaluatiion based in his observation
   * @param {string} observation - update observation
   * @param {string} id - id data evaluations
   */
  updateObservation(
    id: string,
    observation: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/evaluations/${id}`
    );
    const newData = {
      observations: observation,
    };

    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   * Delete the passed evaluatiion based in his workShop
   * @param {string} item - filter for workShop
   */
  getAllEvaluationsByTaller(item: Evaluation): Observable<Evaluation[]> {
    return this.afs
      .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
        ref.where('workshop', '==', item.workshop)
      )
      .valueChanges();
  }

  /**
   * Delete the passed evaluatiion based in his internalStatus
   * @param {string} state - filter for internalStatus
   */
  getAllEvaluationsByInternalStatus(state: string): Observable<Evaluation[]> {
    return this.afs
      .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
        ref.where('internalStatus', '==', state)
      )
      .valueChanges()
      .pipe(
        map((list) => {
          return list.sort(
            (a, b) => a['createdAt']['seconds'] - b['createdAt']['seconds']
          );
        })
      );
  }

  /**
   * Get all evaluations in process and consultation state
   */
  getAllEvaluationsInProcess(): Observable<Evaluation[]> {
    return this.afs
      .collection<Evaluation>(`/db/ferreyros/evaluations`, (ref) =>
        ref.where('internalStatus', 'in', [
          'processed',
          'consultation',
          'pending',
        ])
      )
      .valueChanges()
      .pipe(
        map((list) => {
          return list.sort(
            (a, b) => a['createdAt']['seconds'] - b['createdAt']['seconds']
          );
        })
      );
  }

  /**
   * Delete the passed evaluatiion based in his ID
   * @param {string} data - ID of the evaluation to be removed
   * @param {string} internalStatus - change internalStatus
   */
  startRequest(
    evaluation: Evaluation,
    state: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/evaluations/${evaluation.id}`
    );
    // const evaluationDocRef = this.afs.firestore.collection(`/db/ferreyros/evaluations`).doc(data.id);
    const newData = {
      internalStatus: state,
      registryTimeElapsed: evaluation.registryTimeElapsed,
      registryPercentageElapsed: evaluation.registryPercentageElapsed,
      processAt: new Date(),
    };
    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   * Append the passed list of evaluations in firestore's evaluations collection
   * @param {Improvement[]} list - List of evaluations uploaded by the user
   * @param {User} user - User's data in actual session
   */
  addSettings(
    list: Evaluation[]
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(list.length / 500);
    let batchArray = [];

    for (let index = 0; index < batchCount; index++) {
      // create batch
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > list.length ? list.length : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        // create reference for document in improvements collection
        const evaluationDocRef = this.afs.firestore
          .collection(`/db/ferreyros/evaluations`)
          .doc();
        // Structuring the data model
        list[j].id = evaluationDocRef.id;

        batch.set(evaluationDocRef, list[j]);
      }

      batchArray.push(batch);
    }
    return of(batchArray);
  }

  updateImagesFinalizeData(
    evaluation: Evaluation,
    finalImages,
    entry: EvaluationFinishForm,
    user: User,
    emailList
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create docuemnt reference
    const evaluationDocRef = this.afs.firestore.doc(
      `/db/ferreyros/evaluations/${evaluation.id}`
    );

    const data = {
      result: entry.result ? entry.result : '',
      kindOfTest: entry.kindOfTest ? entry.kindOfTest : '',
      comments: entry.comments ? entry.comments : '',
      resultImage1: finalImages[0] ? finalImages[0] : '',
      resultImage2: finalImages[1] ? finalImages[1] : '',
      length: entry.length ? entry.length : '',
      extends: entry.extends ? entry.extends : [],
      internalStatus: 'finalized',
      finalizedAt: new Date(),
      finalizedBy: user,
      processTimeElapsed: evaluation.processTimeElapsed,
      processPercentageElapsed: evaluation.processPercentageElapsed,
      attentionTimeElapsed: evaluation.attentionTimeElapsed,
    };

    batch.update(evaluationDocRef, data);

    emailList.forEach((el) => {
      const qualityEmailDocRef = this.afs.firestore.doc(
        `/db/ferreyros/evaluations/${evaluation.id}`
      );
      const data1: any = {
        emailList: firebase.default.firestore.FieldValue.arrayUnion(el),
      };
      batch.update(qualityEmailDocRef, data1);
    });

    return of(batch);
  }

  async updateImage(id: string, imagesObj): Promise<void> {
    return await this.afs.firestore
      .collection(`/db/ferreyros/evaluations`)
      .doc(id)
      .set({ images: imagesObj }, { merge: true });
  }

  async deleteImage(imagesObj: string): Promise<any> {
    return await this.storage.storage.refFromURL(imagesObj).delete();
  }

  saveInquiry(
    form: EvaluationInquiry,
    user: User,
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // Create batch
    const batch = this.afs.firestore.batch();
    // Create references
    const inquiryDocRef = this.afs.firestore
      .collection(`db/ferreyros/evaluations/${id}/inquiries/`)
      .doc();
    const evaluationDocRef = this.afs.firestore.doc(
      `db/ferreyros/evaluations/${id}`
    );

    // FIRST - Save inquiry in collection
    // Constructing inquiry data
    const sendDataInquiry = {
      id: inquiryDocRef.id,
      answer: null,
      inquiry: form.inquiry,
      answerImage: null,
      inquiryImage: form.inquiryImage,
      createdAt: new Date(),
      createdBy: user,
      answeredAt: null,
      answeredBy: null,
    };
    // Set inquiry
    batch.set(inquiryDocRef, sendDataInquiry);

    // SECOND - Update inquiries counter and internalStatus
    // Update counter with atomic operation
    batch.update(evaluationDocRef, {
      inquiriesCounter: firebase.default.firestore.FieldValue.increment(1),
      internalStatus: 'consultation',
      inquiryAt: new Date(),
    });

    // Return batch
    return of(batch);
  }

  saveAnswer(
    form: EvaluationInquiry,
    user: User,
    evaluationId: string,
    inquiryId: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // Create batch
    const batch = this.afs.firestore.batch();
    // Create references
    const inquiryDocRef = this.afs.firestore.doc(
      `db/ferreyros/evaluations/${evaluationId}/inquiries/${inquiryId}`
    );
    const evaluationDocRef = this.afs.firestore.doc(
      `db/ferreyros/evaluations/${evaluationId}`
    );

    // FIRST - Update inquiry document
    // Update inquiry
    batch.update(inquiryDocRef, {
      answer: form.answer,
      answerImage: form.answerImage,
      answerAt: new Date(),
      answerBy: user,
    });

    // SECOND - Update evaluation internalStatus
    // Update evaluation
    batch.update(evaluationDocRef, { internalStatus: 'processed' });

    // Return batch
    return of(batch);
  }

  /**
   * Get all inquiries by evaluation's id reference
   * @param {string} evaluationId - Evaluation ID
   */
  getEvaluationInquiriesById(
    evaluationId: string
  ): Observable<EvaluationInquiry[]> {
    return this.afs
      .collection<EvaluationInquiry>(
        `db/ferreyros/evaluations/${evaluationId}/inquiries/`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  /**
   * Get evaluation by id reference
   * @param {string} evaluationId - Evaluation ID
   */
  getEvaluationById(evaluationId: string): Observable<Evaluation> {
    return this.afs
      .doc<Evaluation>(`db/ferreyros/evaluations/${evaluationId}`)
      .valueChanges();
  }

  /**
   * update the passed evaluatiion based in his registryTimer
   * @param {string} timer - time object
   */
  addTimerInRequest(
    timer: EvaluationTimer
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/generalConfig`);
    const newData = {
      registryTimer: timer,
    };

    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   * update the passed evaluatiion based in his processTimer
   * @param {EvaluationTimer} timer - time object
   */
  addTimerInProcess(
    timer: EvaluationTimer
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();

    // create document reference in evaluation collection
    const evaluationDocRef = this.afs.firestore.doc(`/db/generalConfig`);
    const newData = {
      processTimer: timer,
    };

    batch.update(evaluationDocRef, newData);
    return of(batch);
  }

  /**
   *Method to change the status of evaluation to pending
   *
   * @param {string} id - Id of the current evaluation
   * @return {*}  {Observable<firebase.default.firestore.WriteBatch>}
   * @memberof EvaluationsService
   */
  activatePending(
    id: string,
    status: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    if (id) {
      const batch = this.afs.firestore.batch();
      const evalRef = this.afs.firestore.doc(`db/ferreyros/evaluations/${id}`);

      batch.update(evalRef, { internalStatus: status });

      return of(batch);
    }
  }

  //#region Services Evaluation settings ***********************

  addEvaluationsSettings(
    listEvaluationsSettings: EvaluationsUser[]
  ): Observable<firebase.default.firestore.WriteBatch[]> {
    let batchCount = Math.ceil(listEvaluationsSettings.length / 500);
    let batchArray = [];

    for (let index = 0; index < batchCount; index++) {
      // create batch
      const batch = this.afs.firestore.batch();
      let limit =
        500 * (index + 1) > listEvaluationsSettings.length
          ? listEvaluationsSettings.length
          : 500 * (index + 1);

      for (let j = 500 * index; j < limit; j++) {
        // create reference for document in improvements collection
        const evaluationDocRef = this.afs.firestore
          .collection(`/evaluations-settings`)
          .doc();
        // Structuring the data model
        listEvaluationsSettings[j].id = evaluationDocRef.id;
        listEvaluationsSettings[j].createdAt = new Date();

        batch.set(evaluationDocRef, listEvaluationsSettings[j]);
      }

      batchArray.push(batch);
    }

    return of(batchArray);
  }

  getAllEvaluationsSettings(): Observable<EvaluationsUser[]> {
    return this.afs
      .collection<EvaluationsUser>(`/evaluations-settings/`, (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  getAllEvaluationsSettingsNotify(): Observable<EvaluationsBroadcastUser[]> {
    return this.afs
      .collection<EvaluationsBroadcastUser>(
        `/db/generalConfig/evaluationsBroadcast`,
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  getAllEvaluationsSettingsResultType(): Observable<
    EvaluationsResultTypeUser[]
  > {
    return this.afs
      .collection<EvaluationsResultTypeUser>(
        `/db/generalConfig/evaluationsResultType`,
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  getAllEvaluationsSettingsKindOfTest(): Observable<EvaluationsKindOfTest[]> {
    return this.afs
      .collection<EvaluationsKindOfTest>(
        `/db/generalConfig/evaluationsKindOfTest`,
        (ref) => ref.orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  addEvaluationsSettingsNotify(
    listEvaluationsNotify: EvaluationsBroadcastUser[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listEvaluationsNotify.forEach((el) => {
      const evaluationDocRef = this.afs.firestore
        .collection(`/db/generalConfig/evaluationsBroadcast`)
        .doc();
      if (!el.id) {
        const objAux: EvaluationsBroadcastUser = {
          id: evaluationDocRef.id,
          email: el.email,
          createdBy: user,
          createdAt: date,
        };
        batch.set(evaluationDocRef, objAux);
      }
    });
    return of(batch);
  }

  addEvaluationsSettingsResultType(
    listEvaluationsResult: EvaluationsResultTypeUser[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listEvaluationsResult.forEach((el) => {
      const evaluationDocRef = this.afs.firestore
        .collection(`/db/generalConfig/evaluationsResultType`)
        .doc();

      if (!el.id) {
        const objAux: EvaluationsResultTypeUser = {
          id: evaluationDocRef.id,
          resultType: el.resultType,
          createdBy: user,
          createdAt: date,
        };
        batch.set(evaluationDocRef, objAux);
      }
    });
    return of(batch);
  }

  addEvaluationsSettingsKindOfTest(
    listEvaluationsKindOfTest: EvaluationsKindOfTest[],
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    const date = new Date();
    const batch = this.afs.firestore.batch();
    listEvaluationsKindOfTest.forEach((el) => {
      const evaluationDocRef = this.afs.firestore
        .collection(`/db/generalConfig/evaluationsKindOfTest`)
        .doc();

      if (!el.id) {
        const objAux: EvaluationsKindOfTest = {
          id: evaluationDocRef.id,
          kindOfTest: el.kindOfTest,
          createdBy: user,
          createdAt: date,
        };
        batch.set(evaluationDocRef, objAux);
      }
    });
    return of(batch);
  }

  deleteEvaluationsSettingsNotify(id: string): void {
    this.afs.firestore
      .collection(`/db/generalConfig/evaluationsBroadcast`)
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  deleteEvaluationsSettingsResultType(id: string): void {
    this.afs.firestore
      .collection(`/db/generalConfig/evaluationsResultType`)
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  deleteEvaluationsSettingsKindOfTest(id: string): void {
    this.afs.firestore
      .collection(`/db/generalConfig/evaluationsKindOfTest`)
      .doc(id)
      .delete()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  //#
  // BROADCAS LIST
  // get all EvaluationBroadcastlist
  getAllBroadcastList(): Observable<EvaluationBroadcastList[]> {
    return this.afs
      .collection<EvaluationBroadcastList>(
        `/db/generalConfig/evaluationBroadcastList`,
        (ref) => ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  updateBrodcastEmailList(
    entryId: string,
    broadcast: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/evaluationBroadcastList/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayRemove(broadcast),
      /*  editedAt: new Date(),
        edited: user, */
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }
  updateBrodcastList(
    entryId: string,
    broadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore.doc(
      `/db/generalConfig/evaluationBroadcastList/${entryId}`
    );
    // Structuring the data model
    const data: any = {
      emailList: firebase.default.firestore.FieldValue.arrayUnion(broadcast),
      editedAt: new Date(),
      edited: user,
    };
    batch.update(qualityDocRef, data);

    return of(batch);
  }

  addNewBrodcastList(
    nameBroadcast: string,
    user: User
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    // create reference for document in evaluation entries collection
    const qualityDocRef = this.afs.firestore
      .collection(`/db/generalConfig/evaluationBroadcastList`)
      .doc();

    // Structuring the data model
    const data: any = {
      id: qualityDocRef.id,
      name: nameBroadcast,
      emailList: null,
      createdAt: new Date(),
      createdBy: user,
    };
    batch.set(qualityDocRef, data);

    return of(batch);
  }

  deleteListBroadcast(
    id: string
  ): Observable<firebase.default.firestore.WriteBatch> {
    // create batch
    const batch = this.afs.firestore.batch();
    const broadcastDocRef = this.afs.firestore.doc(
      `/db/generalConfig/evaluationBroadcastList/${id}`
    );
    //
    batch.delete(broadcastDocRef);
    return of(batch);
  }
}
